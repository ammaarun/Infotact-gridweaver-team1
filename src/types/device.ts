// ============================================================
// GridWeaver - Device & Telemetry Types
// ============================================================

export type DeviceType =
  | 'solar_panel'
  | 'battery'
  | 'ev_charger'
  | 'wind_turbine'
  | 'transformer'
  | 'smart_meter'
  | 'power_station';

export type DeviceStatus = 'online' | 'offline' | 'fault' | 'maintenance';

export type DeviceState =
  | 'idle'
  | 'charging'
  | 'discharging'
  | 'generating'
  | 'fault'
  | 'offline';

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface DeviceTelemetry {
  power: number;        // kW
  voltage: number;      // V
  current: number;      // A
  temperature: number;  // °C
  battery: number;      // % (0-100)
  frequency: number;    // Hz
  powerFactor: number;  // 0-1
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  state: DeviceState;
  zone: string;
  zoneId: string;
  location: GeoLocation;
  telemetry: DeviceTelemetry;
  lastUpdated: string;
  installedDate: string;
  manufacturer: string;
  model: string;
  firmware: string;
  capacity: number;     // kW rated capacity
}

export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  zone: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  timestamp: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface EventLog {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  oldState: DeviceState;
  newState: DeviceState;
  reason: string;
  operator: string;
  timestamp: string;
  zone: string;
}

export interface StateTransition {
  from: DeviceState;
  to: DeviceState;
  trigger: string;
  timestamp: string;
  deviceId: string;
}

export interface GridZone {
  id: string;
  name: string;
  region: string;
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  faultDevices: number;
  powerProduced: number;   // MW
  powerConsumed: number;   // MW
  batteryCapacity: number; // MWh
  gridHealth: number;      // 0-100
  faultCount: number;
  center: GeoLocation;
  color: string;
}

export interface GridStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  faultDevices: number;
  solarOutput: number;      // MW
  batteryCapacity: number;  // MWh
  powerConsumption: number; // MW
  gridStability: number;    // 0-100%
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
}

export interface OperatorProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  station: string;
  shift: string;
}

export interface ReportConfig {
  type: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  zones: string[];
  includeCharts: boolean;
  format: 'pdf' | 'excel' | 'csv';
}

export interface SettingsConfig {
  theme: 'dark' | 'light';
  notifications: boolean;
  refreshInterval: number; // seconds
  language: string;
  mapStyle: string;
  alertSound: boolean;
  autoAcknowledge: boolean;
}
