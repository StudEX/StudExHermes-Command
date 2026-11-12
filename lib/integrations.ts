/** Read-only readiness metadata. No execution endpoint or credentials are exposed. */
export type IntegrationState = 'not-configured' | 'configured' | 'unverified' | 'responding' | 'unavailable' | 'invalid-config' | 'malformed';
export interface Integration { id: string; name: string; state: IntegrationState; detail: string }
export interface IntegrationReport { checkedAt: string; mode: 'local-preview'; integrations: Integration[] }
type Environment = Record<string, string | undefined>;
type ProbeOptions = { fetcher?: typeof fetch; timeoutMs?: number; maxBytes?: number };
const definitions = [
  ['hermes', 'Hermes Command'], ['linux', 'Linux StudEx'], ['portable', 'Portable Agents'],
  ['shopify', 'Shopify'], ['base44', 'Base44'], ['orgo', 'Orgo'], ['qoder', 'Qoder'],
  ['factory', 'Factory'], ['twilio', 'Twilio'], ['drive', 'Google Drive'],
] as const;

/** Only numeric loopback addresses: avoids DNS rebinding, userinfo and redirect SSRF. */
export function validateHealthUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    if (value !== value.trim() || url.protocol !== 'http:' ||
        !['127.0.0.1', '[::1]'].includes(url.hostname) ||
        url.username || url.password || url.search || url.hash ||
        url.pathname !== '/api/health') return null;
    // Reject normalized alternate IP representations and dot-segment paths.
    const authority = value.match(/^http:\/\/(127\.0\.0\.1|\[::1\])(?::([0-9]+))?\/api\/health$/);
    if (!authority || (authority[2] && Number(authority[2]) === 0)) return null;
    return url;
  } catch { return null; }
}

function knownHealth(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const data = value as Record<string, unknown>;
  return data.status === 'ok' && typeof data.uptime === 'number' && Number.isFinite(data.uptime) && data.uptime >= 0 &&
    typeof data.agents === 'number' && Number.isInteger(data.agents) && data.agents >= 0 &&
    typeof data.orchestrator === 'number' && Number.isInteger(data.orchestrator) && data.orchestrator >= 0 &&
    typeof data.timestamp === 'string' && Number.isFinite(Date.parse(data.timestamp));
}

export async function probeLinuxHealth(value: string, options: ProbeOptions = {}): Promise<Integration> {
  const base = { id: 'linux', name: 'Linux StudEx' };
  const url = validateHealthUrl(value);
  if (!url) return { ...base, state: 'invalid-config', detail: 'Health target rejected. Use an exact loopback HTTP health endpoint without credentials or parameters.' };
  const fetcher = options.fetcher ?? fetch;
  const controller = new AbortController();
  const maxBytes = options.maxBytes ?? 8192;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  const operation = async (): Promise<Integration> => {
    const response = await fetcher(url, { method: 'GET', redirect: 'error', signal: controller.signal, cache: 'no-store', headers: { Accept: 'application/json' } });
    if (!response.ok) { await response.body?.cancel(); return { ...base, state: 'unavailable', detail: 'The health endpoint returned an unsuccessful HTTP status. Agent and VM health remain unverified.' }; }
    const length = response.headers.get('content-length');
    if (length && Number(length) > maxBytes) { await response.body?.cancel(); return { ...base, state: 'malformed', detail: 'The health response exceeded the permitted size.' }; }
    if (!response.body) return { ...base, state: 'malformed', detail: 'The health endpoint returned no response body.' };
    reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      size += result.value.byteLength;
      if (size > maxBytes) { await reader.cancel(); return { ...base, state: 'malformed', detail: 'The health response exceeded the permitted size.' }; }
      chunks.push(result.value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    let data: unknown;
    try { data = JSON.parse(new TextDecoder().decode(bytes)); } catch { return { ...base, state: 'malformed', detail: 'The health endpoint returned invalid JSON.' }; }
    if (!knownHealth(data)) return { ...base, state: 'malformed', detail: 'The response did not match the Linux StudEx health contract.' };
    return { ...base, state: 'responding', detail: 'A process returned the expected health response. VM availability, agent execution and authentication are not verified.' };
  };
  try {
    const deadline = new Promise<Integration>(resolve => {
      timer = setTimeout(() => {
        controller.abort();
        void reader?.cancel().catch(() => {});
        resolve({ ...base, state: 'unavailable', detail: 'The health check timed out. Agent and VM health remain unverified.' });
      }, options.timeoutMs ?? 1500);
    });
    return await Promise.race([operation(), deadline]);
  } catch {
    return { ...base, state: 'unavailable', detail: 'The health endpoint could not be read. Agent and VM health remain unverified.' };
  } finally { if (timer) clearTimeout(timer); controller.abort(); }
}

export async function getIntegrationReport(env: Environment = process.env, options: ProbeOptions = {}): Promise<IntegrationReport> {
  const integrations: Integration[] = definitions.map(([id, name]) => {
    const configured = env[`STUDBOT_${id.toUpperCase()}_CONFIGURED`] === 'true';
    return { id, name, state: configured ? 'configured' : 'unverified', detail: configured ? 'Configuration is declared; access and runtime behavior have not been verified.' : 'No live check performed. Repository or connector availability is not evidence of a working connection.' };
  });
  const linuxIndex = integrations.findIndex(item => item.id === 'linux');
  integrations[linuxIndex] = env.STUDBOT_LINUX_HEALTH_URL
    ? await probeLinuxHealth(env.STUDBOT_LINUX_HEALTH_URL, options)
    : { id: 'linux', name: 'Linux StudEx', state: 'not-configured', detail: 'Optional local health check is not configured. No request was sent.' };
  return { checkedAt: new Date().toISOString(), mode: 'local-preview', integrations };
}
