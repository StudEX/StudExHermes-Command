import { getIntegrationReport } from '../../../lib/integrations.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return Response.json(await getIntegrationReport(), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
