import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals = 1): string {
  if (num >= 1000000) return (num / 1000000).toFixed(decimals) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(decimals) + 'K';
  return num.toFixed(decimals);
}

export function formatPower(kw: number): string {
  if (kw >= 1000) return (kw / 1000).toFixed(1) + ' MW';
  return kw.toFixed(1) + ' kW';
}

export function formatEnergy(kwh: number): string {
  if (kwh >= 1000) return (kwh / 1000).toFixed(1) + ' MWh';
  return kwh.toFixed(1) + ' kWh';
}

export function formatPercent(value: number): string {
  return value.toFixed(1) + '%';
}

export function formatTemperature(temp: number): string {
  return temp.toFixed(1) + '°C';
}

export function formatVoltage(v: number): string {
  return v.toFixed(0) + ' V';
}

export function formatCurrent(a: number): string {
  return a.toFixed(1) + ' A';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'online':
    case 'resolved':
    case 'generating':
    case 'success':
      return '#10B981';
    case 'offline':
    case 'idle':
      return '#94A3B8';
    case 'fault':
    case 'critical':
    case 'danger':
      return '#EF4444';
    case 'maintenance':
    case 'warning':
    case 'charging':
      return '#F59E0B';
    case 'discharging':
      return '#2563EB';
    case 'info':
    case 'acknowledged':
      return '#38BDF8';
    default:
      return '#94A3B8';
  }
}

export function getDeviceIcon(type: string): string {
  switch (type) {
    case 'solar_panel': return '☀️';
    case 'battery': return '🔋';
    case 'ev_charger': return '⚡';
    case 'wind_turbine': return '🌬️';
    case 'transformer': return '🔌';
    case 'smart_meter': return '📊';
    case 'power_station': return '🏭';
    default: return '📡';
  }
}

export function getDeviceTypeLabel(type: string): string {
  switch (type) {
    case 'solar_panel': return 'Solar Panel';
    case 'battery': return 'Battery';
    case 'ev_charger': return 'EV Charger';
    case 'wind_turbine': return 'Wind Turbine';
    case 'transformer': return 'Transformer';
    case 'smart_meter': return 'Smart Meter';
    case 'power_station': return 'Power Station';
    default: return type;
  }
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max));
}

export function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateId(prefix: string = 'GW'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

export function generateTimeSeriesData(
  points: number,
  baseValue: number,
  variance: number,
  hoursBack: number = 24
): { timestamp: string; value: number }[] {
  const data = [];
  const now = Date.now();
  const interval = (hoursBack * 3600 * 1000) / points;

  for (let i = 0; i < points; i++) {
    const time = new Date(now - (points - i) * interval);
    const sinWave = Math.sin((i / points) * Math.PI * 4) * variance * 0.3;
    const noise = (Math.random() - 0.5) * variance;
    data.push({
      timestamp: time.toISOString(),
      value: Math.max(0, baseValue + sinWave + noise),
    });
  }
  return data;
}
