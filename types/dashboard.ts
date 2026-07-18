export interface RegionalStats {
  region: string;
  agents: number;
  vms: number;
  revenue: number;
}

export interface DashboardMetrics {
  totalAgents: number;
  activeVMs: number;
  totalRevenue: number;
  partnershipsInPipeline: number;
  regionStats: RegionalStats[];
  lastUpdated: Date;
}

export interface AgentStatus {
  id: string;
  region: string;
  status: 'active' | 'idle' | 'syncing' | 'error';
  opportunitiesIdentified: number;
  lastSync: Date;
  performance: number; // 0-100
}

export interface VMAllocation {
  tier: '1' | '2' | '3';
  allocated: number;
  available: number;
  price: number;
}

export interface Partnership {
  id: string;
  name: string;
  status: 'prospecting' | 'negotiating' | 'closing' | 'closed';
  value: number;
  probability: number;
  daysInStage: number;
}

export interface RevenueStream {
  name: string;
  percentage: number;
  value: number;
  growth: number;
}
