import type {
  Device,
  DeviceType,
  DeviceStatus,
  DeviceState,
  Alert,
  AlertSeverity,
  AlertStatus,
  EventLog,
  GridZone,
  GridStats,
  Notification,
  OperatorProfile,
} from '../types';
import { randomBetween, randomInt, randomItem, generateId } from '../utils';

// ============================================================
// Zone Definitions
// ============================================================
const ZONE_DEFS = [
  { name: 'Downtown Core', region: 'Central', color: '#2563EB', center: { lat: 40.7580, lng: -73.9855 } },
  { name: 'Industrial Park North', region: 'North', color: '#10B981', center: { lat: 40.8200, lng: -73.9500 } },
  { name: 'Residential East', region: 'East', color: '#F59E0B', center: { lat: 40.7400, lng: -73.9200 } },
  { name: 'Solar Farm West', region: 'West', color: '#EF4444', center: { lat: 40.7600, lng: -74.0300 } },
  { name: 'Harbor District', region: 'South', color: '#8B5CF6', center: { lat: 40.6900, lng: -74.0000 } },
  { name: 'Tech Campus', region: 'Central', color: '#EC4899', center: { lat: 40.7700, lng: -73.9700 } },
  { name: 'Green Valley', region: 'North', color: '#14B8A6', center: { lat: 40.8400, lng: -73.9200 } },
  { name: 'University Quarter', region: 'East', color: '#F97316', center: { lat: 40.7300, lng: -73.9000 } },
  { name: 'Wind Corridor', region: 'West', color: '#06B6D4', center: { lat: 40.7500, lng: -74.0500 } },
  { name: 'Commercial Hub', region: 'Central', color: '#84CC16', center: { lat: 40.7550, lng: -73.9750 } },
  { name: 'Suburban North', region: 'North', color: '#A855F7', center: { lat: 40.8600, lng: -73.8800 } },
  { name: 'Marina Bay', region: 'South', color: '#22D3EE', center: { lat: 40.6700, lng: -73.9800 } },
  { name: 'Airport Zone', region: 'East', color: '#E11D48', center: { lat: 40.6450, lng: -73.7800 } },
  { name: 'Power District', region: 'West', color: '#D946EF', center: { lat: 40.7400, lng: -74.0100 } },
  { name: 'Medical Center', region: 'Central', color: '#0EA5E9', center: { lat: 40.7650, lng: -73.9550 } },
  { name: 'Logistics Park', region: 'North', color: '#65A30D', center: { lat: 40.8100, lng: -73.8600 } },
  { name: 'Waterfront', region: 'South', color: '#0891B2', center: { lat: 40.7000, lng: -74.0200 } },
  { name: 'Financial District', region: 'Central', color: '#7C3AED', center: { lat: 40.7075, lng: -74.0089 } },
  { name: 'Research Park', region: 'East', color: '#DB2777', center: { lat: 40.7550, lng: -73.8900 } },
  { name: 'EV Corridor', region: 'West', color: '#059669', center: { lat: 40.7800, lng: -74.0400 } },
];

const DEVICE_TYPES: DeviceType[] = [
  'solar_panel', 'battery', 'ev_charger', 'wind_turbine',
  'transformer', 'smart_meter', 'power_station',
];

const MANUFACTURERS: Record<DeviceType, string[]> = {
  solar_panel: ['SunPower', 'First Solar', 'Canadian Solar', 'JinkoSolar'],
  battery: ['Tesla', 'LG Chem', 'BYD', 'Panasonic'],
  ev_charger: ['ChargePoint', 'Tesla', 'ABB', 'Siemens'],
  wind_turbine: ['Vestas', 'Siemens Gamesa', 'GE Renewable', 'Nordex'],
  transformer: ['ABB', 'Siemens', 'Schneider Electric', 'GE'],
  smart_meter: ['Landis+Gyr', 'Itron', 'Honeywell', 'Siemens'],
  power_station: ['GE', 'Siemens', 'Mitsubishi', 'Hitachi'],
};

const MODELS: Record<DeviceType, string[]> = {
  solar_panel: ['SP-400X', 'FS-500', 'CS-380P', 'JK-600M'],
  battery: ['Powerwall 3', 'RESU 16H', 'Blade B', 'EverVolt'],
  ev_charger: ['Express 350', 'Supercharger V4', 'Terra 360', 'VersiCharge'],
  wind_turbine: ['V162-7.2', 'SG-14-222', 'Haliade-X', 'N163-6.X'],
  transformer: ['DTR-500', 'GEAFOL', 'Trihal', 'Prolec'],
  smart_meter: ['E360', 'OpenWay 3', 'Elster A3', 'SENTRON 7KT'],
  power_station: ['9HA.02', 'SGT-8000H', 'M701JAC', 'H-25'],
};

const ALERT_TITLES = [
  'Over-temperature detected',
  'Voltage fluctuation warning',
  'Communication timeout',
  'Power output degradation',
  'Battery cell imbalance',
  'Inverter fault',
  'Grid frequency deviation',
  'Overcurrent protection triggered',
  'Ground fault detected',
  'Firmware update required',
  'Transformer oil level low',
  'Phase imbalance warning',
  'Breaker trip event',
  'Load shedding initiated',
  'Arc flash warning',
  'Harmonic distortion high',
  'Power factor below threshold',
  'Insulation resistance low',
  'Cooling system failure',
  'Meter reading anomaly',
];

const TRANSITION_REASONS = [
  'Scheduled maintenance',
  'Load balancing',
  'Grid demand response',
  'Fault recovery',
  'Operator command',
  'Auto-protection',
  'Energy arbitrage',
  'Peak shaving',
  'Solar intermittency',
  'Wind speed change',
  'Temperature limit',
  'Voltage regulation',
  'Frequency response',
  'Capacity limit reached',
  'Grid synchronization',
];

const OPERATOR_NAMES = [
  'James Mitchell', 'Sarah Chen', 'Robert Garcia',
  'Emily Watson', 'Michael Torres', 'Lisa Park',
  'David Kim', 'Rachel Foster', 'Alex Rivera', 'Nicole Brown',
];

// ============================================================
// Device Generator
// ============================================================
function generateDevice(index: number): Device {
  const zone = ZONE_DEFS[index % ZONE_DEFS.length];
  const type = DEVICE_TYPES[index % DEVICE_TYPES.length];

  const statusRoll = Math.random();
  let status: DeviceStatus;
  if (statusRoll < 0.82) status = 'online';
  else if (statusRoll < 0.92) status = 'offline';
  else if (statusRoll < 0.97) status = 'fault';
  else status = 'maintenance';

  let state: DeviceState;
  if (status === 'offline') state = 'offline';
  else if (status === 'fault') state = 'fault';
  else {
    const states: DeviceState[] =
      type === 'solar_panel' || type === 'wind_turbine' || type === 'power_station'
        ? ['idle', 'generating']
        : type === 'battery'
          ? ['idle', 'charging', 'discharging']
          : ['idle', 'charging'];
    state = randomItem(states);
  }

  const capacityMap: Record<DeviceType, number> = {
    solar_panel: randomBetween(5, 50),
    battery: randomBetween(10, 100),
    ev_charger: randomBetween(7, 350),
    wind_turbine: randomBetween(2000, 8000),
    transformer: randomBetween(500, 5000),
    smart_meter: randomBetween(1, 10),
    power_station: randomBetween(50000, 500000),
  };

  const capacity = capacityMap[type];
  const powerFraction = status === 'online' ? randomBetween(0.1, 0.95) : 0;

  return {
    id: `GW-${String(index + 1).padStart(5, '0')}`,
    name: `${zone.name} ${type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} #${(index % 500) + 1}`,
    type,
    status,
    state,
    zone: zone.name,
    zoneId: `zone-${(index % ZONE_DEFS.length) + 1}`,
    location: {
      lat: zone.center.lat + randomBetween(-0.02, 0.02),
      lng: zone.center.lng + randomBetween(-0.02, 0.02),
    },
    telemetry: {
      power: status === 'online' ? +(capacity * powerFraction).toFixed(1) : 0,
      voltage: +(randomBetween(210, 250)).toFixed(1),
      current: +(randomBetween(5, 80)).toFixed(1),
      temperature: +(randomBetween(15, 75)).toFixed(1),
      battery: type === 'battery' || type === 'ev_charger' ? +(randomBetween(5, 100)).toFixed(1) : 0,
      frequency: +(randomBetween(49.8, 50.2)).toFixed(2),
      powerFactor: +(randomBetween(0.85, 0.99)).toFixed(2),
    },
    lastUpdated: new Date(Date.now() - randomInt(0, 600000)).toISOString(),
    installedDate: new Date(Date.now() - randomInt(86400000 * 30, 86400000 * 1500)).toISOString(),
    manufacturer: randomItem(MANUFACTURERS[type]),
    model: randomItem(MODELS[type]),
    firmware: `v${randomInt(2, 5)}.${randomInt(0, 9)}.${randomInt(0, 20)}`,
    capacity: +capacity.toFixed(1),
  };
}

// ============================================================
// Generate 10,000 devices
// ============================================================
let _deviceCache: Device[] | null = null;

export function getDevices(): Device[] {
  if (_deviceCache) return _deviceCache;
  _deviceCache = Array.from({ length: 10000 }, (_, i) => generateDevice(i));
  return _deviceCache;
}

export function getDeviceById(id: string): Device | undefined {
  return getDevices().find(d => d.id === id);
}

export function getDevicesByZone(zoneId: string): Device[] {
  return getDevices().filter(d => d.zoneId === zoneId);
}

export function getDevicesByType(type: DeviceType): Device[] {
  return getDevices().filter(d => d.type === type);
}

// ============================================================
// Grid Statistics
// ============================================================
export function getGridStats(): GridStats {
  const devices = getDevices();
  const online = devices.filter(d => d.status === 'online');
  const offline = devices.filter(d => d.status === 'offline');
  const fault = devices.filter(d => d.status === 'fault');
  const solar = devices.filter(d => d.type === 'solar_panel' && d.status === 'online');
  const batteries = devices.filter(d => d.type === 'battery');

  return {
    totalDevices: devices.length,
    onlineDevices: online.length,
    offlineDevices: offline.length,
    faultDevices: fault.length,
    solarOutput: +(solar.reduce((s, d) => s + d.telemetry.power, 0) / 1000).toFixed(1),
    batteryCapacity: +(batteries.reduce((s, d) => s + d.capacity, 0) / 1000).toFixed(1),
    powerConsumption: +(online.reduce((s, d) => s + d.telemetry.power, 0) / 1000).toFixed(1),
    gridStability: +(randomBetween(94, 99.5)).toFixed(1),
  };
}

// ============================================================
// Grid Zones
// ============================================================
export function getGridZones(): GridZone[] {
  return ZONE_DEFS.map((z, i) => {
    const zoneDevices = getDevices().filter(d => d.zoneId === `zone-${i + 1}`);
    return {
      id: `zone-${i + 1}`,
      name: z.name,
      region: z.region,
      totalDevices: zoneDevices.length,
      onlineDevices: zoneDevices.filter(d => d.status === 'online').length,
      offlineDevices: zoneDevices.filter(d => d.status === 'offline').length,
      faultDevices: zoneDevices.filter(d => d.status === 'fault').length,
      powerProduced: +(zoneDevices.filter(d => d.status === 'online').reduce((s, d) => s + d.telemetry.power, 0) / 1000).toFixed(2),
      powerConsumed: +(randomBetween(50, 200)).toFixed(2),
      batteryCapacity: +(zoneDevices.filter(d => d.type === 'battery').reduce((s, d) => s + d.capacity, 0) / 1000).toFixed(2),
      gridHealth: +(randomBetween(85, 99)).toFixed(1),
      faultCount: zoneDevices.filter(d => d.status === 'fault').length,
      center: z.center,
      color: z.color,
    };
  });
}

// ============================================================
// Alerts
// ============================================================
export function getAlerts(): Alert[] {
  const devices = getDevices();
  return Array.from({ length: 100 }, (_, i) => {
    const device = devices[randomInt(0, devices.length)];
    const severityRoll = Math.random();
    const severity: AlertSeverity = severityRoll < 0.3 ? 'critical' : severityRoll < 0.7 ? 'warning' : 'info';
    const statusRoll = Math.random();
    const status: AlertStatus = statusRoll < 0.5 ? 'active' : statusRoll < 0.8 ? 'acknowledged' : 'resolved';

    return {
      id: `ALT-${String(i + 1).padStart(4, '0')}`,
      deviceId: device.id,
      deviceName: device.name,
      deviceType: device.type,
      zone: device.zone,
      severity,
      status,
      title: randomItem(ALERT_TITLES),
      message: `Alert triggered on ${device.name} in ${device.zone}. Immediate attention required.`,
      timestamp: new Date(Date.now() - randomInt(0, 86400000 * 7)).toISOString(),
      acknowledgedBy: status !== 'active' ? randomItem(OPERATOR_NAMES) : undefined,
      acknowledgedAt: status !== 'active' ? new Date(Date.now() - randomInt(0, 3600000)).toISOString() : undefined,
      resolvedAt: status === 'resolved' ? new Date(Date.now() - randomInt(0, 1800000)).toISOString() : undefined,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ============================================================
// Event Logs
// ============================================================
export function getEventLogs(): EventLog[] {
  const devices = getDevices();
  const states: DeviceState[] = ['idle', 'charging', 'discharging', 'generating', 'fault', 'offline'];

  return Array.from({ length: 500 }, (_, i) => {
    const device = devices[randomInt(0, devices.length)];
    const oldState = randomItem(states);
    let newState = randomItem(states);
    while (newState === oldState) newState = randomItem(states);

    return {
      id: `EVT-${String(i + 1).padStart(5, '0')}`,
      deviceId: device.id,
      deviceName: device.name,
      deviceType: device.type,
      oldState,
      newState,
      reason: randomItem(TRANSITION_REASONS),
      operator: randomItem(OPERATOR_NAMES),
      timestamp: new Date(Date.now() - randomInt(0, 86400000 * 14)).toISOString(),
      zone: device.zone,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ============================================================
// Notifications
// ============================================================
export function getNotifications(): Notification[] {
  return Array.from({ length: 15 }, (_, i) => ({
    id: `NOT-${i + 1}`,
    title: randomItem([
      'Critical fault detected',
      'Device came online',
      'Zone power threshold exceeded',
      'Maintenance completed',
      'Battery fully charged',
      'Grid stability warning',
    ]),
    message: 'Automated system notification requiring operator review.',
    type: randomItem(['alert', 'info', 'success', 'warning'] as const),
    timestamp: new Date(Date.now() - randomInt(0, 3600000 * 6)).toISOString(),
    read: Math.random() > 0.4,
  }));
}

// ============================================================
// Operator Profile
// ============================================================
export function getOperatorProfile(): OperatorProfile {
  return {
    id: 'OP-001',
    name: 'Yash',
    role: 'FRONTEND DEVELOPER',
    avatar: '',
    email: 'yashaudichya001@gmail.com',
    station: 'Control Center Alpha',
    shift: 'Day Shift (06:00 - 18:00)',
  };
}

// ============================================================
// Chart Data Generators
// ============================================================
export function getPowerConsumptionData() {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, '0') + ':00';
    return {
      name: h,
      consumption: +(randomBetween(120, 340)).toFixed(1),
      generation: +(randomBetween(80, 380)).toFixed(1),
      solar: +(randomBetween(0, i >= 6 && i <= 18 ? 250 : 10)).toFixed(1),
      wind: +(randomBetween(20, 120)).toFixed(1),
    };
  });
  return hours;
}

export function getVoltageData() {
  return Array.from({ length: 48 }, (_, i) => ({
    name: `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    voltage: +(randomBetween(228, 242)).toFixed(1),
    nominal: 230,
  }));
}

export function getBatteryData() {
  return Array.from({ length: 24 }, (_, i) => ({
    name: String(i).padStart(2, '0') + ':00',
    charge: +(randomBetween(20, 95)).toFixed(1),
    discharge: +(randomBetween(5, 60)).toFixed(1),
    soc: +(randomBetween(30, 90)).toFixed(1),
  }));
}

export function getGridLoadData() {
  return Array.from({ length: 24 }, (_, i) => ({
    name: String(i).padStart(2, '0') + ':00',
    load: +(randomBetween(55, 95)).toFixed(1),
    capacity: 100,
  }));
}

export function getWeeklyGenerationData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(d => ({
    name: d,
    solar: +(randomBetween(800, 1600)).toFixed(0),
    wind: +(randomBetween(400, 1200)).toFixed(0),
    other: +(randomBetween(200, 600)).toFixed(0),
  }));
}

export function getMonthlyGenerationData() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(m => ({
    name: m,
    generation: +(randomBetween(25000, 55000)).toFixed(0),
    consumption: +(randomBetween(20000, 50000)).toFixed(0),
  }));
}

export function getFaultStatisticsData() {
  return DEVICE_TYPES.map(t => ({
    name: t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    faults: randomInt(2, 45),
    warnings: randomInt(10, 80),
  }));
}

export function getZoneComparisonData() {
  return ZONE_DEFS.slice(0, 10).map(z => ({
    name: z.name.length > 15 ? z.name.substring(0, 15) + 'ΓÇª' : z.name,
    power: +(randomBetween(50, 300)).toFixed(1),
    efficiency: +(randomBetween(75, 98)).toFixed(1),
  }));
}

export function getPeakHoursData() {
  return Array.from({ length: 24 }, (_, i) => ({
    name: String(i).padStart(2, '0') + ':00',
    demand: +(randomBetween(100, 450)).toFixed(1),
    supply: +(randomBetween(120, 500)).toFixed(1),
  }));
}
