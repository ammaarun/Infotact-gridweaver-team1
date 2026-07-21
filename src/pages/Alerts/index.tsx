import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Shield, CheckCircle, Search, Filter, Clock,
  Bell, ChevronDown, X,
} from 'lucide-react';
import { PageHeader, GlassCard, StatusBadge, StatCard } from '../../components/ui';
import { useQuery } from '@tanstack/react-query';
import { fetchAlerts } from '../../services/telemetryApi';
import { cn, timeAgo, getDeviceIcon } from '../../utils';
import type { AlertSeverity, AlertStatus } from '../../types';

export default function Alerts() {
  const { data: allAlerts = [] } = useQuery({ queryKey: ['alerts'], queryFn: fetchAlerts, refetchInterval: 10000 });
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity | 'all'>('all');
  const [status, setStatus] = useState<AlertStatus | 'all'>('all');

  const filtered = useMemo(() => {
    let result = allAlerts;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a => a.title.toLowerCase().includes(q) || a.deviceName.toLowerCase().includes(q));
    }
    if (severity !== 'all') result = result.filter(a => a.severity === severity);
    if (status !== 'all') result = result.filter(a => a.status === status);
    return result;
  }, [allAlerts, search, severity, status]);

  const critCount = allAlerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const warnCount = allAlerts.filter(a => a.severity === 'warning' && a.status === 'active').length;
  const resolvedCount = allAlerts.filter(a => a.status === 'resolved').length;
  const ackCount = allAlerts.filter(a => a.status === 'acknowledged').length;

  return (
    <div>
      <PageHeader
        title="Alert Management"
        subtitle="Monitor and respond to grid alerts"
        breadcrumb={[{ label: 'GridWeaver' }, { label: 'Alerts' }]}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Critical Active" value={critCount} icon={<AlertTriangle className="w-5 h-5" />} color="#EF4444" />
        <StatCard title="Warnings" value={warnCount} icon={<Shield className="w-5 h-5" />} color="#F59E0B" />
        <StatCard title="Acknowledged" value={ackCount} icon={<Bell className="w-5 h-5" />} color="#38BDF8" />
        <StatCard title="Resolved" value={resolvedCount} icon={<CheckCircle className="w-5 h-5" />} color="#10B981" />
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111827] border border-white/5">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none w-full"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'critical', 'warning', 'info'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium border transition-all capitalize',
                severity === s ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              )}
            >
              {s === 'all' ? 'All Severity' : s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'acknowledged', 'resolved'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium border transition-all capitalize',
                status === s ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              )}
            >
              {s === 'all' ? 'All Status' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <GlassCard noPadding>
        <div className="divide-y divide-white/5">
          {filtered.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className={cn(
                'px-5 py-4 hover:bg-white/[0.02] transition-colors',
                alert.severity === 'critical' && alert.status === 'active' && 'border-l-2 border-l-red-500 bg-red-500/[0.02]'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  alert.severity === 'critical' ? 'bg-red-500/10' : alert.severity === 'warning' ? 'bg-amber-500/10' : 'bg-blue-500/10'
                )}>
                  <AlertTriangle className={cn('w-5 h-5',
                    alert.severity === 'critical' ? 'text-red-400' : alert.severity === 'warning' ? 'text-amber-400' : 'text-blue-400'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
                    <StatusBadge status={alert.severity} />
                    <StatusBadge status={alert.status} />
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{alert.message}</p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-500">
                    <span>{getDeviceIcon(alert.deviceType)} {alert.deviceName}</span>
                    <span>📍 {alert.zone}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(alert.timestamp).toLocaleString()}</span>
                    {alert.acknowledgedBy && <span>✓ {alert.acknowledgedBy}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {alert.status === 'active' && (
                    <button className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-medium hover:bg-blue-500/25 transition-colors">
                      Acknowledge
                    </button>
                  )}
                  {alert.status === 'acknowledged' && (
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-medium hover:bg-emerald-500/25 transition-colors">
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
