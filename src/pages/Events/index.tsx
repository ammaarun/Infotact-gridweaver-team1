import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Search, Clock, ArrowRight, User, Settings, Filter
} from 'lucide-react';
import { PageHeader, GlassCard, StatusBadge } from '../../components/ui';
import { fetchEventLogs } from '../../services/telemetryApi';
import { useQuery } from '@tanstack/react-query';
import { getDeviceIcon, getDeviceTypeLabel } from '../../utils';

export default function Events() {
  const { data: allEvents = [] } = useQuery({ queryKey: ['events'], queryFn: fetchEventLogs, refetchInterval: 10000 });
  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState('all');

  const filtered = useMemo(() => {
    let result = allEvents;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.deviceName.toLowerCase().includes(q) ||
          e.deviceId.toLowerCase().includes(q) ||
          e.operator.toLowerCase().includes(q) ||
          e.reason.toLowerCase().includes(q)
      );
    }
    if (reasonFilter !== 'all') {
      result = result.filter((e) => e.reason === reasonFilter);
    }
    return result;
  }, [allEvents, search, reasonFilter]);

  const reasons = useMemo(() => {
    const set = new Set(allEvents.map((e) => e.reason));
    return ['all', ...Array.from(set)];
  }, [allEvents]);

  return (
    <div>
      <PageHeader
        title="Event Logs"
        subtitle="Historical log of state transitions and operations"
        breadcrumb={[{ label: 'GridWeaver' }, { label: 'Event Logs' }]}
      />

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111827] border border-white/5">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search events by device, operator, reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none w-full"
          />
        </div>
        <div className="relative flex items-center bg-[#111827] border border-white/5 rounded-lg px-3 py-2">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-2" />
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer border-none"
          >
            {reasons.map((r) => (
              <option key={r} value={r} className="bg-[#111827] text-white">
                {r === 'all' ? 'All Reasons' : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Timeline List */}
      <GlassCard noPadding>
        <div className="divide-y divide-white/5">
          {filtered.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.01, 0.2) }}
              className="px-5 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="text-2xl mt-1 flex-shrink-0">
                    {getDeviceIcon(event.deviceType)}
                  </div>
                  <div>
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">
                        {event.deviceName}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        ({event.deviceId})
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded">
                        {getDeviceTypeLabel(event.deviceType)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 mb-2">
                      <StatusBadge status={event.oldState} />
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <StatusBadge status={event.newState} />
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />{' '}
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> Operator: {event.operator}
                      </span>
                      <span className="flex items-center gap-1">
                        <Settings className="w-3 h-3" /> Trigger: {event.reason}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center self-start md:self-center">
                  <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">
                    {event.id}
                  </span>
                  <span className="text-[10px] text-slate-600 mt-1">
                    Zone: {event.zone}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
