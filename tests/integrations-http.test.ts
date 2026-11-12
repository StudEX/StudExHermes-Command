import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { probeLinuxHealth } from '../lib/integrations.ts';

test('real loopback HTTP probe validates JSON and refuses redirects', async () => {
  let redirect = false;
  let redirectedRequests = 0;
  const server = createServer((req, res) => {
    if (req.url !== '/api/health') { redirectedRequests++; res.end('unexpected'); return; }
    if (redirect) { res.writeHead(302, { Location: '/execution' }); res.end(); return; }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'ok', uptime: 0, agents: 5, orchestrator: 0, timestamp: new Date().toISOString() }));
  });
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/health`;
    assert.equal((await probeLinuxHealth(url)).state, 'responding');
    redirect = true;
    assert.equal((await probeLinuxHealth(url)).state, 'unavailable');
    assert.equal(redirectedRequests, 0);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
