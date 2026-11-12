import { NextResponse } from 'next/server';

// The legacy sample password/cookie was not authentication. This local preview
// grants no session until a real identity provider and access policy are added.
export async function POST() {
  return NextResponse.json(
    { ok: false, error: 'Access is not configured. This build is a local preview.' },
    { status: 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
