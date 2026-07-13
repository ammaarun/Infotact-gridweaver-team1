import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Zap, Battery, Thermometer, Activity, MapPin,
  Clock, Cpu, Wrench, Signal, AlertTriangle,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';
import { PageHeader, GlassCard, StatusBadge } from '../../components/ui';
import { getDeviceById, getAlerts, getEventLogs } from '../../services/mockData';
import { getDeviceTypeLabel, formatPower, generateTimeSeriesData, cn } from '../../utils';

const chartTooltipStyle = {
  contentStyle: { background: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' },
  labelStyle: { color: '#94A3B8' },
};

export default function DeviceDetails() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const device = useMemo(() => getDeviceById(deviceId || ''), [deviceId]);

  const powerHistory = useMemo(() => generateTimeSeriesData(48, device?.telemetry.power || 50, 30, 24).map((p, i) => ({
    name: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: +p.value.toFixed(1),
  })), [device]);

  const tempHistory = useMemo(() => generateTimeSeriesData(48, device?.telemetry.temperature || 35, 15, 24).map((p) => ({
    name: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: +p.value.toFixed(1),
  })), [device]);

  const voltageHistory = useMemo(() => generateTimeSeriesData(48, device?.telemetry.voltage || 230, 10, 24).map((p) => ({
    name: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: +p.value.toFixed(1),
  })), [device]);

  const batteryHistory = useMemo(() => generateTimeSeriesData(48, device?.telemetry.battery || 50, 25, 24).map((p) => ({
    name: new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: Math.min(100, Math.max(0, +p.value.toFixed(1))),
  })), [device]);

  const deviceAlerts = useMemo(() =>
    getAlerts().filter(a => a.deviceId === deviceId).slice(0, 5),
    [deviceId]
  );

  const deviceEvents = useMemo(() =>
    getEventLogs().filter(e => e.deviceId === deviceId).slice(0, 10),
    [deviceId]
  );

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Cpu className="w-12 h-12 text-slate-600 mb-4" />
        <p className="text-sm text-slate-400">Device not found</p>
        <button onClick={() => navigate('/devices')} className="mt-4 text-xs text-blue-400 hover:text-blue-300">
          ← Back to Devices
        </button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={device.name}
        subtitle={`${device.id} · ${getDeviceTypeLabel(device.type)} · ${device.zone}`}
        breadcrumb={[{ label: 'GridWeaver' }, { label: 'Devices' }, { label: device.id }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/devices')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <StatusBadge status={device.status} size="md" />
            <StatusBadge status={device.state} size="md" />
          </div>
        }
      />

      {/* Info Cards Row */}
      <div className="grid grid-cols-6 gap-4 mb-4">
        {[
          { icon: <Zap className="w-4 h-4 text-amber-400" />, label: 'Power', value: formatPower(device.telemetry.power), bg: 'bg-amber-500/10' },
          { icon: <Activity className="w-4 h-4 text-blue-400" />, label: 'Voltage', value: `${device.telemetry.voltage} V`, bg: 'bg-blue-500/10' },
          { icon: <Signal className="w-4 h-4 text-cyan-400" />, label: 'Current', value: `${device.telemetry.current} A`, bg: 'bg-cyan-500/10' },
          { icon: <Thermometer className="w-4 h-4 text-red-400" />, label: 'Temperature', value: `${device.telemetry.temperature}°C`, bg: 'bg-red-500/10' },
          { icon: <Battery className="w-4 h-4 text-emerald-400" />, label: 'Battery', value: `${device.telemetry.battery}%`, bg: 'bg-emerald-500/10' },
          { icon: <Activity className="w-4 h-4 text-purple-400" />, label: 'Frequency', value: `${device.telemetry.frequency} Hz`, bg: 'bg-purple-500/10' },
        ].map((item) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-[#111827] border border-white/5 p-4"
          >
            <div className="flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', item.bg)}>
                {item.icon}
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.label}</p>
                <p className="text-lg font-bold text-white">{item.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <GlassCard title="Power History" subtitle="24-hour trend">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerHistory}>
                <defs>
                  <linearGradient id="pwrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 9 }} axisLine={false} tickLine={false} interval={7} />
                <YAxis tick={{ fill: '#64748B', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="#F59E0B" fill="url(#pwrGrad)" strokeWidth={2} name="Power (kW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Battery History" subtitle="State of charge">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={batteryHistory}>
                <defs>
                  <linearGradient id="batGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 9 }} axisLine={false} tickLine={false} interval={7} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748B', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="#10B981" fill="url(#batGrad)" strokeWidth={2} name="SoC (%)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Voltage" subtitle="24-hour voltage levels">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={voltageHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 9 }} axisLine={false} tickLine={false} interval={7} />
                <YAxis domain={[215, 250]} tick={{ fill: '#64748B', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={false} name="Voltage (V)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Temperature" subtitle="Thermal monitoring">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 9 }} axisLine={false} tickLine={false} interval={7} />
                <YAxis tick={{ fill: '#64748B', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="value" stroke="#EF4444" strokeWidth={2} dot={false} name="Temp (°C)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Device Info + Alerts + Events */}
      <div className="grid grid-cols-3 gap-4">
        {/* Device Info */}
        <GlassCard title="Device Information">
          <div className="space-y-3">
            {[
              { label: 'Manufacturer', value: device.manufacturer },
              { label: 'Model', value: device.model },
              { label: 'Firmware', value: device.firmware },
              { label: 'Capacity', value: formatPower(device.capacity) },
              { label: 'Zone', value: device.zone },
              { label: 'Installed', value: new Date(device.installedDate).toLocaleDateString() },
              { label: 'Power Factor', value: device.telemetry.powerFactor.toFixed(2) },
              { label: 'Location', value: `${device.location.lat.toFixed(4)}, ${device.location.lng.toFixed(4)}` },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1 border-b border-white/[0.03] last:border-0">
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className="text-xs text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Alerts */}
        <GlassCard title="Device Alerts" subtitle={`${deviceAlerts.length} alerts`} noPadding>
          {deviceAlerts.length > 0 ? (
            <div className="divide-y divide-white/5">
              {deviceAlerts.map((alert) => (
                <div key={alert.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={cn('w-4 h-4 mt-0.5 flex-shrink-0',
                      alert.severity === 'critical' ? 'text-red-400' : alert.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                    )} />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-white">{alert.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                    <StatusBadge status={alert.severity} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs text-slate-500">No alerts for this device</p>
            </div>
          )}
        </GlassCard>

        {/* State History */}
        <GlassCard title="State History" noPadding>
          {deviceEvents.length > 0 ? (
            <div className="divide-y divide-white/5">
              {deviceEvents.map((event) => (
                <div key={event.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={event.oldState} />
                    <span className="text-slate-600">→</span>
                    <StatusBadge status={event.newState} />
                  </div>
                  <p className="text-[10px] text-slate-500">{event.reason} · {event.operator}</p>
                  <p className="text-[10px] text-slate-600 mt-0.5">{new Date(event.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-xs text-slate-500">No state transitions recorded</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
