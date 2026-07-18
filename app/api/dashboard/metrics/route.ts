import { NextRequest, NextResponse } from 'next/server';
import type { DashboardMetrics } from '@/types/dashboard';

export async function GET(req: NextRequest) {
  try {
    const metrics: DashboardMetrics = {
      totalAgents: 250,
      activeVMs: 305,
      totalRevenue: 2400000,
      partnershipsInPipeline: 145,
      regionStats: [
        {
          region: 'Rwanda',
          agents: 50,
          vms: 50,
          revenue: 150000,
        },
        {
          region: 'Nigeria',
          agents: 85,
          vms: 100,
          revenue: 350000,
        },
        {
          region: 'South Africa',
          agents: 120,
          vms: 155,
          revenue: 1800000,
        },
        {
          region: 'Global',
          agents: 50,
          vms: 0,
          revenue: 100000,
        },
      ],
      lastUpdated: new Date(),
    };

    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}
