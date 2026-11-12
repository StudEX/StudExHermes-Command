import test from 'node:test';
import assert from 'node:assert/strict';
import { getIntegrationReport, probeLinuxHealth, validateHealthUrl } from '../lib/integrations.ts';
const target = 'http://127.0.0.1:4000/api/health';
const health = { status: 'ok', uptime: 22, agents: 5, orchestrator: 0, timestamp: '2026-11-12T03:00:00Z' };
const responseFetcher = (body: string, status = 200): typeof fetch => async () => new Response(body, { status });

test('rejects non-loopback, credentials, redirects paths and URL normalization tricks', () => {
  for (const value of ['https://127.0.0.1/api/health', 'http://localhost/api/health', 'http://192.168.1.1/api/health', 'http://127.0.0.1.evil.test/api/health', 'http://user:secret@127.0.0.1/api/health', 'http://127.0.0.1/api/health?q=secret', 'http://127.0.0.1/api/health#x', 'http://127.0.0.1/api/tmux', 'http://127.1/api/health', 'http://2130706433/api/health', 'http://127.0.0.1/x/../api/health', 'http://127.0.0.1:0/api/health', target + '?', target + '#', target + ' ']) assert.equal(validateHealthUrl(value), null, value);
  assert.equal(validateHealthUrl(target)?.pathname, '/api/health');
  assert.ok(validateHealthUrl('http://[::1]:4000/api/health'));
});

test('absent config makes no network request and never claims health', async () => {
  const report = await getIntegrationReport({}, { fetcher: async () => { throw new Error('must not fetch'); } });
  assert.equal(report.mode, 'local-preview');
  assert.equal(report.integrations.length, 10);
  assert.equal(report.integrations.find(x => x.id === 'linux')?.state, 'not-configured');
  assert.ok(report.integrations.every(x => ['unverified', 'not-configured'].includes(x.state)));
  assert.ok(Number.isFinite(Date.parse(report.checkedAt)));
});

test('declared config is not verified; secrets are never copied', async () => {
  const report = await getIntegrationReport({ STUDBOT_ORGO_CONFIGURED: 'true', ORGO_API_KEY: 'secret-sample' });
  assert.equal(report.integrations.find(x => x.id === 'orgo')?.state, 'configured');
  assert.ok(!JSON.stringify(report).includes('secret-sample'));
});

test('valid response only proves a responding process, suppresses fields and target', async () => {
  const result = await probeLinuxHealth(target, { fetcher: responseFetcher(JSON.stringify({ ...health, token: 'secret-sample' })) });
  assert.equal(result.state, 'responding');
  assert.match(result.detail, /not verified/);
  const serialized = JSON.stringify(result);
  assert.ok(!serialized.includes('secret-sample'));
  assert.ok(!serialized.includes('127.0.0.1'));
  assert.ok(!serialized.includes('agents":5'));
});

test('unsafe target never fetched and errors never leak', async () => {
  const result = await probeLinuxHealth('http://user:secret-sample@example.test/api/health', { fetcher: async () => { throw new Error('must not fetch'); } });
  assert.equal(result.state, 'invalid-config');
  assert.ok(!JSON.stringify(result).includes('secret-sample'));
  const error = await probeLinuxHealth(target, { fetcher: async () => { throw new Error('secret-sample private-host'); } });
  assert.equal(error.state, 'unavailable');
  assert.ok(!JSON.stringify(error).includes('secret-sample'));
});

test('HTTP error, invalid JSON, wrong shape and oversized response are distinguished', async () => {
  assert.equal((await probeLinuxHealth(target, { fetcher: responseFetcher('secret-sample', 500) })).state, 'unavailable');
  for (const body of ['not json', '{}', JSON.stringify({ ...health, status: 'offline' }), JSON.stringify({ ...health, agents: -1 })]) {
    assert.equal((await probeLinuxHealth(target, { fetcher: responseFetcher(body) })).state, 'malformed');
  }
  const oversized = await probeLinuxHealth(target, { maxBytes: 90, fetcher: responseFetcher('x'.repeat(100)) });
  assert.equal(oversized.state, 'malformed');
  assert.match(oversized.detail, /exceeded/);
});

test('health fetch is GET with redirects blocked and bounded timeout', async () => {
  let signal: AbortSignal | null | undefined;
  const result = await probeLinuxHealth(target, { timeoutMs: 10, fetcher: async (_url, init) => {
    assert.equal(init?.method, 'GET'); assert.equal(init?.redirect, 'error'); assert.equal(init?.cache, 'no-store');
    signal = init?.signal;
    return new Promise<Response>(() => {});
  } });
  assert.equal(result.state, 'unavailable');
  assert.match(result.detail, /timed out/);
  assert.equal(signal?.aborted, true);
});

test('body read is also time bounded', async () => {
  const result = await probeLinuxHealth(target, { timeoutMs: 10, fetcher: async () => new Response(new ReadableStream({ start() {} })) });
  assert.equal(result.state, 'unavailable');
});
