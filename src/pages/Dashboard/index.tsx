import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu, Wifi, WifiOff, AlertTriangle, Sun, Battery, Zap, Activity,
  TrendingUp, TrendingDown, Clock,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend,
} from 'recharts';
import { StatCard, GlassCard, StatusBadge, PageHeader } from '../../components/ui';
import {
  getGridStats, getAlerts, getEventLogs,
  getPowerConsumptionData, getVoltageData, getBatteryData, getGridLoadData, getDevices,
} from '../../services/mockData';
import { formatPower, formatEnergy, getDeviceIcon, timeAgo } from '../../utils';

const chartTooltipStyle = {
  contentStyle: { background: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' },
  labelStyle: { color: '#94A3B8' },
  itemStyle: { color: '#F8FAFC' },
};

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.05 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } },
};

export default function Dashboard() {
  const stats = useMemo(() => getGridStats(), []);
  const alerts = useMemo(() => getAlerts().slice(0, 6), []);
  const events = useMemo(() => getEventLogs().slice(0, 8), []);
  const powerData = useMemo(() => getPowerConsumptionData(), []);
  const voltageData = useMemo(() => getVoltageData(), []);
  const batteryData = useMemo(() => getBatteryData(), []);
  const loadData = useMemo(() => getGridLoadData(), []);
  const faultDevices = useMemo(() => getDevices().filter(d => d.status === 'fault').slice(0, 6), []);

  return (
    <div>
      <PageHeader
        title="Operations Dashboard"
        subtitle="Real-time grid monitoring and telemetry overview"
        breadcrumb={[{ label: 'GridWeaver' }, { label: 'Dashboard' }]}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Live</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-400">Auto-refresh: 5s</span>
            </div>
          </div>
        }
      />

      {/* Stats Grid */}
      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-4 2xl:grid-cols-8 gap-4 mb-6"
      >
        <motion.div variants={stagger.item}>
          <StatCard title="Total Devices" value={stats.totalDevices.toLocaleString()} icon={<Cpu className="w-5 h-5" />} color="#2563EB" trend={{ value: 2.4, label: 'vs last week' }} />
        </motion.div>
        <motion.div variants={stagger.item}>
          <StatCard title="Online" value={stats.onlineDevices.toLocaleString()} icon={<Wifi className="w-5 h-5" />} color="#10B981" trend={{ value: 1.2, label: 'vs last hour' }} />
        </motion.div>
        <motion.div variants={stagger.item}>
          <StatCard title="Offline" value={stats.offlineDevices.toLocaleString()} icon={<WifiOff className="w-5 h-5" />} color="#94A3B8" trend={{ value: -3.1, label: 'vs last hour' }} />
        </motion.div>
        <motion.div variants={stagger.item}>
          <StatCard title="Faults" value={stats.faultDevices.toLocaleString()} icon={<AlertTriangle className="w-5 h-5" />} color="#EF4444" trend={{ value: 0.8, label: 'vs last hour' }} />
        </motion.div>
        <motion.div variants={stagger.item}>
          <StatCard title="Solar Output" value={formatPower(stats.solarOutput * 1000)} icon={<Sun className="w-5 h-5" />} color="#F59E0B" trend={{ value: 12.5, label: 'today' }} />
        </motion.div>
        <motion.div variants={stagger.item}>
          <StatCard title="Battery Cap." value={formatEnergy(stats.batteryCapacity * 1000)} icon={<Battery className="w-5 h-5" />} color="#8B5CF6" trend={{ value: 5.3, label: 'available' }} />
        </motion.div>
        <motion.div variants={stagger.item}>
          <StatCard title="Consumption" value={formatPower(stats.powerConsumption * 1000)} icon={<Zap className="w-5 h-5" />} color="#38BDF8" trend={{ value: -1.7, label: 'vs peak' }} />
        </motion.div>
        <motion.div variants={stagger.item}>
          <StatCard title="Grid Stability" value={`${stats.gridStability}%`} icon={<Activity className="w-5 h-5" />} color="#10B981" trend={{ value: 0.3, label: 'stable' }} />
        </motion.div>
      </motion.div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <GlassCard title="Power Generation vs Consumption" subtitle="24-hour overview">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerData}>
                <defs>
                  <linearGradient id="genGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="conGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="generation" stroke="#10B981" fill="url(#genGrad)" strokeWidth={2} name="Generation (MW)" />
                <Area type="monotone" dataKey="consumption" stroke="#2563EB" fill="url(#conGrad)" strokeWidth={2} name="Consumption (MW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Voltage Monitoring" subtitle="Real-time voltage levels">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={voltageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} interval={5} />
                <YAxis domain={[225, 245]} tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="voltage" stroke="#F59E0B" strokeWidth={2} dot={false} name="Voltage (V)" />
                <Line type="monotone" dataKey="nominal" stroke="#64748B" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Nominal (V)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <GlassCard title="Battery Status" subtitle="Charge/Discharge cycles">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={batteryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="charge" fill="#10B981" radius={[4, 4, 0, 0]} name="Charging %" />
                <Bar dataKey="discharge" fill="#EF4444" radius={[4, 4, 0, 0]} name="Discharging %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Grid Load" subtitle="Current load vs capacity">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={loadData}>
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#38BDF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 110]} tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="load" stroke="#38BDF8" fill="url(#loadGrad)" strokeWidth={2} name="Load %" />
                <Line type="monotone" dataKey="capacity" stroke="#EF4444" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Max Capacity %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent Alerts */}
        <GlassCard title="Recent Alerts" subtitle={`${alerts.length} active alerts`} noPadding
          action={<button className="text-xs text-blue-400 hover:text-blue-300">View All</button>}
        >
          <div className="divide-y divide-white/5">
            {alerts.map((alert) => (
              <div key={alert.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    alert.severity === 'critical' ? 'bg-red-500/10' : alert.severity === 'warning' ? 'bg-amber-500/10' : 'bg-blue-500/10'
                  }`}>
                    <AlertTriangle className={`w-4 h-4 ${
                      alert.severity === 'critical' ? 'text-red-400' : alert.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{alert.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{alert.deviceName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={alert.severity} />
                    <span className="text-[10px] text-slate-600">{timeAgo(alert.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Latest Events */}
        <GlassCard title="Latest Events" subtitle="State transitions" noPadding
          action={<button className="text-xs text-blue-400 hover:text-blue-300">View All</button>}
        >
          <div className="divide-y divide-white/5">
            {events.map((event) => (
              <div key={event.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-lg flex-shrink-0">{getDeviceIcon(event.deviceType)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{event.deviceName}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <StatusBadge status={event.oldState} />
                      <TrendingUp className="w-3 h-3 text-slate-500" />
                      <StatusBadge status={event.newState} />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-600 flex-shrink-0">{timeAgo(event.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Active Faults */}
        <GlassCard title="Active Faults" subtitle={`${faultDevices.length} devices in fault state`} noPadding
          action={<button className="text-xs text-red-400 hover:text-red-300">Resolve All</button>}
        >
          <div className="divide-y divide-white/5">
            {faultDevices.map((device) => (
              <div key={device.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{device.name}</p>
                    <p className="text-[11px] text-slate-500">{device.zone} · {device.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-red-400 font-medium">{device.telemetry.temperature}°C</p>
                    <p className="text-[10px] text-slate-600">{timeAgo(device.lastUpdated)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
