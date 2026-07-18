export const SYSTEM_HEALTH_STATUS = {
  OPTIMAL: 'optimal',
  DEGRADED: 'degraded',
  CRITICAL: 'critical',
};

export const systemHealth = {
  status: SYSTEM_HEALTH_STATUS.OPTIMAL,
  uptime: 99.7,
  activeIncidents: 1,
  lastIncidentResolvedMinsAgo: 42,
};

export const kpiData = [
  { id: 'total-power', label: 'Total Power Output', value: 24.8, unit: 'MW', trend: 3.4, trendDirection: 'up', icon: 'bolt' },
  { id: 'active-devices', label: 'Active Devices', value: 1284, unit: '', trend: 1.2, trendDirection: 'up', icon: 'devices' },
  { id: 'grid-efficiency', label: 'Grid Efficiency', value: 94.6, unit: '%', trend: 0.8, trendDirection: 'up', icon: 'speed' },
  { id: 'battery-reserve', label: 'Battery Reserve', value: 78, unit: '%', trend: -2.1, trendDirection: 'down', icon: 'battery' },
  { id: 'open-alerts', label: 'Open Alerts', value: 6, unit: '', trend: -14.3, trendDirection: 'down', icon: 'alert' },
  { id: 'carbon-offset', label: 'Carbon Offset', value: 412, unit: 't CO₂', trend: 5.6, trendDirection: 'up', icon: 'eco' },
];

export const powerFlowNodes = [
  { id: 'solar', label: 'Solar Farms', value: 12.4, unit: 'MW', type: 'source', status: 'active' },
  { id: 'wind', label: 'Wind Turbines', value: 6.1, unit: 'MW', type: 'source', status: 'active' },
  { id: 'battery', label: 'Battery Storage', value: 4.2, unit: 'MW', type: 'storage', status: 'active' },
  { id: 'grid-node', label: 'Grid Interconnect', value: 2.1, unit: 'MW', type: 'source', status: 'active' },
  { id: 'distribution', label: 'Distribution Hub', value: 24.8, unit: 'MW', type: 'hub', status: 'active' },
  { id: 'load', label: 'Consumer Load', value: 22.6, unit: 'MW', type: 'load', status: 'active' },
];

export const powerGenerationSeries = [
  { time: '00:00', generation: 14.2, forecast: 13.8 },
  { time: '04:00', generation: 11.5, forecast: 12.0 },
  { time: '08:00', generation: 19.8, forecast: 18.5 },
  { time: '12:00', generation: 27.4, forecast: 26.0 },
  { time: '16:00', generation: 24.1, forecast: 23.5 },
  { time: '20:00', generation: 18.6, forecast: 19.0 },
  { time: '23:59', generation: 15.0, forecast: 14.6 },
];

export const batteryGaugeData = {
  currentCharge: 78,
  capacity: 100,
  chargeRate: 2.4,
  status: 'charging',
  timeToFull: '1h 40m',
};

export const deviceStatusBreakdown = [
  { id: 'online', label: 'Online', value: 1122, colorKey: 'success' },
  { id: 'warning', label: 'Warning', value: 94, colorKey: 'warning' },
  { id: 'critical', label: 'Critical', value: 18, colorKey: 'error' },
  { id: 'offline', label: 'Offline', value: 50, colorKey: 'grey' },
];

export const weeklyEnergyData = [
  { day: 'Mon', generated: 320, consumed: 290 },
  { day: 'Tue', generated: 305, consumed: 300 },
  { day: 'Wed', generated: 340, consumed: 310 },
  { day: 'Thu', generated: 315, consumed: 295 },
  { day: 'Fri', generated: 360, consumed: 330 },
  { day: 'Sat', generated: 280, consumed: 240 },
  { day: 'Sun', generated: 260, consumed: 220 },
];

export const liveAlerts = [
  { id: 'AL-901', title: 'Wind Turbine WT-14 offline', severity: 'critical', timestamp: '2026-07-18T04:12:00' },
  { id: 'AL-902', title: 'Battery Bank B-2 charge below threshold', severity: 'warning', timestamp: '2026-07-18T05:30:00' },
  { id: 'AL-903', title: 'Smart Meter C-11 voltage irregular', severity: 'warning', timestamp: '2026-07-18T06:38:00' },
  { id: 'AL-904', title: 'Unauthorized access attempt blocked', severity: 'critical', timestamp: '2026-07-18T06:15:00' },
  { id: 'AL-905', title: 'Peak load threshold approaching', severity: 'warning', timestamp: '2026-07-18T06:25:00' },
];

export const recentActivities = [
  { id: 'AC-701', title: 'Firmware updated on Smart Meter cluster', actor: 'System', timestamp: '2026-07-18T06:20:00' },
  { id: 'AC-702', title: 'Backup power test passed', actor: 'System', timestamp: '2026-07-18T03:00:00' },
  { id: 'AC-703', title: 'New device EV Charger E-5 onboarded', actor: 'Harsha Deshmukh', timestamp: '2026-07-18T06:10:00' },
  { id: 'AC-704', title: 'Password policy updated', actor: 'Admin', timestamp: '2026-07-18T02:10:00' },
  { id: 'AC-705', title: 'Transformer T-9 load normalized', actor: 'System', timestamp: '2026-07-18T06:41:00' },
];

export const iotMapDevices = [
  { id: 'DEV-1001', name: 'Solar Array North-A', status: 'online', lat: 21.4602, lng: 80.1922 },
  { id: 'DEV-1002', name: 'Battery Bank B-2', status: 'warning', lat: 21.4550, lng: 80.1850 },
  { id: 'DEV-1004', name: 'Wind Turbine WT-14', status: 'critical', lat: 21.4800, lng: 80.2100 },
  { id: 'DEV-1005', name: 'Transformer T-7', status: 'online', lat: 21.4500, lng: 80.1800 },
  { id: 'DEV-1007', name: 'Solar Array South-B', status: 'online', lat: 21.4400, lng: 80.1700 },
  { id: 'DEV-1010', name: 'Wind Turbine WT-16', status: 'online', lat: 21.4820, lng: 80.2130 },
];

export const weatherSnapshot = {
  location: 'Gondia, Maharashtra',
  tempC: 31,
  condition: 'Partly Cloudy',
  humidity: 64,
  windSpeedKmh: 14,
  solarIrradiance: 720,
};

export const aiInsight = {
  title: 'Predicted Peak Load Tonight',
  summary:
    'Based on the last 7 days, consumption is likely to peak around 8–9 PM. Consider pre-charging battery reserves by 15% before 6 PM to avoid grid draw.',
  confidence: 87,
};

export const quickActions = [
  { id: 'add-device', label: 'Add Device', icon: 'add' },
  { id: 'run-diagnostics', label: 'Run Diagnostics', icon: 'diagnostics' },
  { id: 'export-report', label: 'Export Report', icon: 'export' },
  { id: 'view-alerts', label: 'View Alerts', icon: 'alert' },
];