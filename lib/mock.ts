export interface Device {
  id: string
  deviceId: string
  clusterName: string
  customerName: string
  location: string
  mode: 'Normal' | 'Eco' | 'Smart'
  targetTemp: number
  currentTemp: number
  hashrate: string
  powerDraw: number
  efficiency: number
  uptime: string
  status: 'Online' | 'Offline' | 'Critical' | 'Attention' | 'Inactive'
}

// 使用固定种子的伪随机数生成器
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  random(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  randomChoice<T>(array: T[]): T {
    return array[Math.floor(this.random() * array.length)];
  }
}

const rng = new SeededRandom(12345); // 固定种子值

const generateDeviceId = (index: number) => {
  const prefixes = ['CSPW', 'CSR', 'CSG', 'CSZ', 'CSK', 'CSY', 'CSL', 'CS4', 'CS9']
  const prefix = prefixes[index % prefixes.length]
  // 使用 index 生成固定的后缀
  const suffix = (1000 + index).toString(36).toUpperCase().slice(-4)
  return prefix + suffix
}

const customerNames = [
  'Tesla',
  'Zone A',
  'East Coast Hardware',
  'Zone B', 
  'Apple Inc.',
  'James Wong',
  'Microsoft Corp',
  'Amazon Web Services',
  'Google LLC',
  'Meta Platforms'
]

const locations = [
  'New York, USA',
  'San Francisco, USA',
  'Berlin, Germany',
  'Tokyo, Japan',
  'London, UK',
  'Sydney, Australia',
  'Toronto, Canada',
  'Seoul, South Korea'
]

const clusterNames = [
  'cluster-a',
  'cluster-b', 
  'cluster-c',
  'cluster-d',
  'cluster-e'
]

const generateHashrate = (index: number) => {
  // 使用固定算法生成哈希率
  const value = (150 + (index * 0.5) % 50).toFixed(1)
  return `${value} TH/s`
}

const generateUptime = (index: number) => {
  // 生成运行时间，格式：天数d 小时h 分钟m
  const days = (index % 30) + 1;
  const hours = (index * 7) % 24;
  const minutes = (index * 13) % 60;
  return `${days}d ${hours}h ${minutes}m`;
}

export const mockDevices: Device[] = Array.from({ length: 100 }, (_, index) => ({
  id: `device-${index + 1}`,
  deviceId: generateDeviceId(index),
  clusterName: clusterNames[index % clusterNames.length],
  customerName: customerNames[index % customerNames.length],
  location: locations[index % locations.length],
  mode: ['Normal', 'Eco', 'Smart'][index % 3] as Device['mode'],
  targetTemp: 50 + (index % 20),
  currentTemp: 45 + (index % 20),
  hashrate: generateHashrate(index),
  powerDraw: 2800 + (index % 500), // 功率：2800-3300W
  efficiency: Number((0.025 + (index % 100) * 0.0001).toFixed(4)), // 效率：0.025-0.035 J/GH
  uptime: generateUptime(index),
  status: ['Online', 'Offline', 'Critical', 'Attention', 'Inactive'][index % 5] as Device['status']
}))

// ==================== 图表数据 Mock ====================

export interface ChartDataPoint {
  date: string;
  value: number;
}

// 生成日期标签
const generateDateLabels = (count: number, type: 'hourly' | 'daily' | 'weekly' | 'monthly'): string[] => {
  const labels: string[] = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now);
    
    switch (type) {
      case 'hourly':
        date.setHours(now.getHours() - i);
        labels.push(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        break;
      case 'daily':
        date.setDate(now.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }));
        break;
      case 'weekly':
        date.setDate(now.getDate() - i * 7);
        labels.push(`Week ${Math.ceil((now.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000))}`);
        break;
      case 'monthly':
        date.setMonth(now.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
        break;
    }
  }
  
  return labels;
};

// 生成随机数据点
const generateDataPoints = (count: number, min: number, max: number, seed: number = 0): number[] => {
  const localRng = new SeededRandom(seed);
  return Array.from({ length: count }, () => localRng.randomInt(min, max));
};

// BTC Earnings 数据
export const mockBTCEarningsData = {
  daily: generateDateLabels(15, 'daily').map((date, i) => ({
    date,
    value: generateDataPoints(15, 3000, 9000, 100)[i]
  })),
  weekly: generateDateLabels(12, 'weekly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 20000, 60000, 101)[i]
  })),
  monthly: generateDateLabels(12, 'monthly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 80000, 250000, 102)[i]
  }))
};

// Fleet Hashrate 数据（折线图）
export const mockFleetHashrateData = {
  hourly: generateDateLabels(24, 'hourly').map((date, i) => ({
    date,
    value: generateDataPoints(24, 140, 180, 200)[i]
  })),
  daily: generateDateLabels(30, 'daily').map((date, i) => ({
    date,
    value: generateDataPoints(30, 145, 175, 201)[i]
  })),
  weekly: generateDateLabels(12, 'weekly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 150, 170, 202)[i]
  })),
  monthly: generateDateLabels(12, 'monthly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 155, 165, 203)[i]
  }))
};

// Fleet Water Temperature 数据（折线图）
export const mockFleetWaterTempData = {
  hourly: generateDateLabels(24, 'hourly').map((date, i) => ({
    date,
    value: generateDataPoints(24, 45, 65, 300)[i]
  })),
  daily: generateDateLabels(30, 'daily').map((date, i) => ({
    date,
    value: generateDataPoints(30, 48, 62, 301)[i]
  })),
  weekly: generateDateLabels(12, 'weekly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 50, 60, 302)[i]
  })),
  monthly: generateDateLabels(12, 'monthly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 52, 58, 303)[i]
  }))
};

// Incidents 数据（柱状图）
export const mockIncidentsData = {
  daily: generateDateLabels(15, 'daily').map((date, i) => ({
    date,
    value: generateDataPoints(15, 0, 12, 400)[i]
  })),
  weekly: generateDateLabels(12, 'weekly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 5, 50, 401)[i]
  })),
  monthly: generateDateLabels(12, 'monthly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 20, 180, 402)[i]
  }))
};

// Tickets 数据（柱状图）
export const mockTicketsData = {
  daily: generateDateLabels(15, 'daily').map((date, i) => ({
    date,
    value: generateDataPoints(15, 0, 15, 500)[i]
  })),
  weekly: generateDateLabels(12, 'weekly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 10, 80, 501)[i]
  })),
  monthly: generateDateLabels(12, 'monthly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 40, 300, 502)[i]
  }))
};

// Sales 数据（柱状图）
export const mockSalesData = {
  daily: generateDateLabels(15, 'daily').map((date, i) => ({
    date,
    value: generateDataPoints(15, 1000, 10000, 600)[i]
  })),
  weekly: generateDateLabels(12, 'weekly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 5000, 50000, 601)[i]
  })),
  monthly: generateDateLabels(12, 'monthly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 20000, 200000, 602)[i]
  }))
};

// Fleet Power Consumption 数据（折线图）
export const mockFleetPowerConsumptionData = {
  hourly: generateDateLabels(24, 'hourly').map((date, i) => ({
    date,
    value: generateDataPoints(24, 2500, 3500, 700)[i]
  })),
  daily: generateDateLabels(30, 'daily').map((date, i) => ({
    date,
    value: generateDataPoints(30, 2600, 3400, 701)[i]
  })),
  weekly: generateDateLabels(12, 'weekly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 2700, 3300, 702)[i]
  })),
  monthly: generateDateLabels(12, 'monthly').map((date, i) => ({
    date,
    value: generateDataPoints(12, 2800, 3200, 703)[i]
  }))
};

// 获取图表数据的辅助函数
export const getChartData = (chartType: string, timeRange: string): ChartDataPoint[] => {
  const dataMap: Record<string, any> = {
    'btc-earnings': mockBTCEarningsData,
    'fleet-hashrate': mockFleetHashrateData,
    'fleet-water-temp': mockFleetWaterTempData,
    'incidents': mockIncidentsData,
    'tickets': mockTicketsData,
    'sales': mockSalesData,
    'fleet-power-consumption': mockFleetPowerConsumptionData,
  };
  
  return dataMap[chartType]?.[timeRange] || [];
};

// ==================== Location 数据 Mock ====================

export interface LocationStats {
  location: string;
  dashboard: {
    totalDevices: number;
    onlineDevices: number;
    offlineDevices: number;
    criticalDevices: number;
    attentionDevices: number;
    totalEarnings: number;
    fleetPerformance: number;
    fleetWallet: number;
    serviceRequests: number;
    unprocessedTickets: number;
    sales: number;
    powerConsumption: number;
  };
  device: {
    online: number;
    offline: number;
    attention: number;
    critical: number;
    total: number;
  };
}

// 为每个位置创建统计数据
export const mockLocationStats: Record<string, LocationStats> = {
  'all': {
    location: 'All locations',
    dashboard: {
      totalDevices: 75,
      onlineDevices: 48,
      offlineDevices: 25,
      criticalDevices: 1,
      attentionDevices: 1,
      totalEarnings: 245000,
      fleetPerformance: 87.5,
      fleetWallet: 156000,
      serviceRequests: 12,
      unprocessedTickets: 8,
      sales: 126,
      powerConsumption: 3200,
    },
    device: {
      online: 48,
      offline: 25,
      attention: 1,
      critical: 1,
      total: 75,
    },
  },
  'san-francisco': {
    location: 'San Francisco',
    dashboard: {
      totalDevices: 25,
      onlineDevices: 18,
      offlineDevices: 6,
      criticalDevices: 0,
      attentionDevices: 1,
      totalEarnings: 95000,
      fleetPerformance: 92.3,
      fleetWallet: 62000,
      serviceRequests: 3,
      unprocessedTickets: 2,
      sales: 45,
      powerConsumption: 2800,
    },
    device: {
      online: 18,
      offline: 6,
      attention: 1,
      critical: 0,
      total: 25,
    },
  },
  'new-york': {
    location: 'New York',
    dashboard: {
      totalDevices: 20,
      onlineDevices: 15,
      offlineDevices: 4,
      criticalDevices: 1,
      attentionDevices: 0,
      totalEarnings: 78000,
      fleetPerformance: 85.2,
      fleetWallet: 48000,
      serviceRequests: 5,
      unprocessedTickets: 3,
      sales: 38,
      powerConsumption: 3100,
    },
    device: {
      online: 15,
      offline: 4,
      attention: 0,
      critical: 1,
      total: 20,
    },
  },
  'berlin': {
    location: 'Berlin',
    dashboard: {
      totalDevices: 15,
      onlineDevices: 10,
      offlineDevices: 5,
      criticalDevices: 0,
      attentionDevices: 0,
      totalEarnings: 42000,
      fleetPerformance: 78.6,
      fleetWallet: 28000,
      serviceRequests: 2,
      unprocessedTickets: 1,
      sales: 22,
      powerConsumption: 2900,
    },
    device: {
      online: 10,
      offline: 5,
      attention: 0,
      critical: 0,
      total: 15,
    },
  },
  'london': {
    location: 'London',
    dashboard: {
      totalDevices: 15,
      onlineDevices: 5,
      offlineDevices: 10,
      criticalDevices: 0,
      attentionDevices: 0,
      totalEarnings: 30000,
      fleetPerformance: 65.4,
      fleetWallet: 18000,
      serviceRequests: 2,
      unprocessedTickets: 2,
      sales: 21,
      powerConsumption: 3400,
    },
    device: {
      online: 5,
      offline: 10,
      attention: 0,
      critical: 0,
      total: 15,
    },
  },
};

// 获取指定位置的统计数据
export const getLocationStats = (location: string): LocationStats => {
  return mockLocationStats[location] || mockLocationStats['all'];
};

// 获取 Dashboard 卡片数据（根据位置）
export const getDashboardCardsByLocation = (location: string) => {
  const stats = getLocationStats(location);
  
  return [
    {
      id: 'total-devices',
      title: 'Total Devices',
      value: stats.dashboard.totalDevices.toString(),
      icon: '/dashboard/totaldevice.svg',
      tip: `${stats.dashboard.onlineDevices} online`,
      status: stats.dashboard.attentionDevices > 0 ? 'warning' : 'normal',
      url: '/device',
    },
    {
      id: 'fleet-water-temp',
      title: 'Fleet Water Temp',
      value: '48.5 ˚C',
      icon: '/dashboard/fleetWallet.svg',
      tip: '20%',
      up: 'water',
      status: 'normal',
      tabs: [
        { name: '˚C', value: 'Celsius' },
        { name: '˚F', value: 'Fahrenheit' },
      ],
    },
    {
      id: 'fleet-performance',
      title: 'Fleet Performance',
      value: `${stats.dashboard.fleetPerformance}%`,
      icon: '/dashboard/fleetPerformance.svg',
      tip: stats.dashboard.fleetPerformance >= 85 ? '+2.3%' : '-1.5%',
      up: 'power',
      status: 'normal',
      tabs: [
        { name: 'Hashrate', value: 'Hashrate' },
        { name: 'Power', value: 'Power' },
      ],
    },
    {
      id: 'total-earning',
      title: 'Total Earnings',
      value: `₿${(stats.dashboard.totalEarnings / 100000).toFixed(8)}`,
      icon: '/dashboard/totalEarning.svg',
      tip: '+ 0.00051243 today',
      status: 'normal',
      url: '/earning',
      tabs: [
        { name: 'BTC', value: 'btc' },
        { name: 'USD', value: 'usd' },
      ],
    },
    {
      id: 'unprocessed-ticket',
      title: 'Unprocessed Tickets',
      value: stats.dashboard.unprocessedTickets.toString(),
      icon: '/dashboard/unprocessedTicket.svg',
      tip: stats.dashboard.unprocessedTickets > 5 ? `${stats.dashboard.unprocessedTickets - 5} new tickets` : 'All caught up',
      status: stats.dashboard.unprocessedTickets > 5 ? 'critical' : 'normal',
      url: '/ticket',
    },
    {
      id: 'service-request',
      title: 'Service Requests',
      value: stats.dashboard.serviceRequests.toString(),
      icon: '/dashboard/serviceRequest.svg',
      tip: stats.dashboard.serviceRequests > 10 ? `${stats.dashboard.serviceRequests - 10} new requests` : 'Normal volume',
      status: stats.dashboard.serviceRequests > 10 ? 'warning' : 'normal',
      url: '/ticket',
    },
    {
      id: 'sales',
      title: 'Sales',
      value: stats.dashboard.sales.toString(),
      icon: '/dashboard/sales.svg',
      tip: '+ 12 this month',
      status: 'normal',
      url: '/customer',
    },
  ];
};

// 获取 Device 统计数据（根据位置）
export const getDeviceStatsByLocation = (location: string) => {
  const stats = getLocationStats(location);
  return stats.device;
};

