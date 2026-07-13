import { useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';
import {
  Layers, Thermometer, Zap, Battery, Clock, MapPin,
  Filter, BarChart3, Eye, Maximize2,
} from 'lucide-react';
import { GlassCard, StatusBadge, PageHeader } from '../../components/ui';
import { getDevices, getGridStats } from '../../services/mockData';
import { getStatusColor, getDeviceTypeLabel, formatPower, cn } from '../../utils';
import type { Device, DeviceType } from '../../types';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default icon
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
L.Marker.prototype.options.icon = L.icon({ iconUrl, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });

function createDeviceIcon(device: Device) {
  const color = getStatusColor(device.status);
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 14px; height: 14px;
      background: ${color};
      border: 2px solid ${color}44;
      border-radius: 50%;
      box-shadow: 0 0 8px ${color}66, 0 0 20px ${color}22;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function FlyToCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  map.flyTo(center, 13, { duration: 1.5 });
  return null;
}

const DEVICE_TYPE_OPTIONS: { value: DeviceType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Devices' },
  { value: 'solar_panel', label: 'Solar Panels' },
  { value: 'battery', label: 'Batteries' },
  { value: 'ev_charger', label: 'EV Chargers' },
  { value: 'wind_turbine', label: 'Wind Turbines' },
  { value: 'transformer', label: 'Transformers' },
  { value: 'smart_meter', label: 'Smart Meters' },
  { value: 'power_station', label: 'Power Stations' },
];

export default function GridMap() {
  const [selectedType, setSelectedType] = useState<DeviceType | 'all'>('all');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [flyCenter, setFlyCenter] = useState<[number, number] | null>(null);
  const stats = useMemo(() => getGridStats(), []);

  // Only show first 500 devices on map for performance
  const devices = useMemo(() => {
    const all = getDevices();
    const filtered = selectedType === 'all' ? all : all.filter(d => d.type === selectedType);
    return filtered.slice(0, 500);
  }, [selectedType]);

  const centerOnDevice = useCallback((device: Device) => {
    setFlyCenter([device.location.lat, device.location.lng]);
    setTimeout(() => setFlyCenter(null), 2000);
  }, []);

  return (
    <div>
      <PageHeader
        title="Live Grid Map"
        subtitle="Real-time GIS device monitoring"
        breadcrumb={[{ label: 'GridWeaver' }, { label: 'Grid Map' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all',
                showHeatmap
                  ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              Heatmap
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">{devices.length} devices</span>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-[280px_1fr] gap-4 h-[calc(100vh-10rem)]">
        {/* Sidebar Filters */}
        <div className="space-y-4 overflow-y-auto pr-1">
          <GlassCard title="Device Filter" noPadding>
            <div className="p-3 space-y-1">
              {DEVICE_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedType(opt.value)}
                  className={cn(
                    'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all',
                    selectedType === opt.value
                      ? 'bg-blue-500/15 text-blue-400'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {opt.label}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard title="Grid Summary">
            <div className="space-y-3">
              {[
                { label: 'Total Online', value: stats.onlineDevices.toLocaleString(), color: 'text-emerald-400' },
                { label: 'Total Offline', value: stats.offlineDevices.toLocaleString(), color: 'text-slate-400' },
                { label: 'Faults', value: stats.faultDevices.toLocaleString(), color: 'text-red-400' },
                { label: 'Solar Output', value: formatPower(stats.solarOutput * 1000), color: 'text-amber-400' },
                { label: 'Grid Stability', value: `${stats.gridStability}%`, color: 'text-emerald-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className={cn('text-xs font-semibold', item.color)}>{item.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Legend */}
          <GlassCard title="Legend">
            <div className="space-y-2">
              {[
                { color: '#10B981', label: 'Online' },
                { color: '#94A3B8', label: 'Offline' },
                { color: '#EF4444', label: 'Fault' },
                { color: '#F59E0B', label: 'Maintenance' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <span className="text-xs text-slate-400">{item.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Map */}
        <GlassCard noPadding className="overflow-hidden">
          <MapContainer
            center={[40.7580, -73.9855]}
            zoom={12}
            style={{ height: '100%', width: '100%', background: '#0B1220' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {flyCenter && <FlyToCenter center={flyCenter} />}

            {/* Heatmap circles */}
            {showHeatmap && devices.map((device) => (
              <CircleMarker
                key={`heat-${device.id}`}
                center={[device.location.lat, device.location.lng]}
                radius={device.telemetry.power > 0 ? Math.min(device.telemetry.power / 50, 30) + 5 : 5}
                pathOptions={{
                  fillColor: getStatusColor(device.status),
                  fillOpacity: 0.15,
                  stroke: false,
                }}
              />
            ))}

            {/* Device markers */}
            {devices.map((device) => (
              <Marker
                key={device.id}
                position={[device.location.lat, device.location.lng]}
                icon={createDeviceIcon(device)}
              >
                <Popup className="custom-popup" maxWidth={320} minWidth={280}>
                  <div className="bg-[#111827] text-white rounded-lg -m-[16px] -mt-[10px] overflow-hidden" style={{ margin: '-14px -20px' }}>
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold">{device.name}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">{device.id} · {getDeviceTypeLabel(device.type)}</p>
                      </div>
                      <StatusBadge status={device.status} size="md" />
                    </div>
                    <div className="px-4 py-3 grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <div>
                          <p className="text-[10px] text-slate-500">Power</p>
                          <p className="text-xs font-semibold">{formatPower(device.telemetry.power)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                        <div>
                          <p className="text-[10px] text-slate-500">Voltage</p>
                          <p className="text-xs font-semibold">{device.telemetry.voltage} V</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-3.5 h-3.5 text-red-400" />
                        <div>
                          <p className="text-[10px] text-slate-500">Temperature</p>
                          <p className="text-xs font-semibold">{device.telemetry.temperature}°C</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Battery className="w-3.5 h-3.5 text-emerald-400" />
                        <div>
                          <p className="text-[10px] text-slate-500">Battery</p>
                          <p className="text-xs font-semibold">{device.telemetry.battery}%</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <MapPin className="w-3 h-3" />
                        {device.location.lat.toFixed(4)}, {device.location.lng.toFixed(4)}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        {new Date(device.lastUpdated).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-white/10 flex gap-2">
                      <button className="flex-1 px-3 py-1.5 text-[11px] font-medium bg-blue-500/15 text-blue-400 rounded-lg hover:bg-blue-500/25 transition-colors flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3" /> Details
                      </button>
                      <button
                        onClick={() => centerOnDevice(device)}
                        className="flex-1 px-3 py-1.5 text-[11px] font-medium bg-white/5 text-slate-300 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-1"
                      >
                        <Maximize2 className="w-3 h-3" /> Center
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </GlassCard>
      </div>
    </div>
  );
}
