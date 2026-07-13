import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Filter, ChevronDown, ChevronLeft, ChevronRight,
  Eye, History, MapPin, Download, SlidersHorizontal, ArrowUpDown,
} from 'lucide-react';
import { PageHeader, GlassCard, StatusBadge } from '../../components/ui';
import { getDevices } from '../../services/mockData';
import { getDeviceTypeLabel, formatPower, cn } from '../../utils';
import type { Device, DeviceType, DeviceStatus } from '../../types';

const PAGE_SIZE = 20;

export default function Devices() {
  const navigate = useNavigate();
  const allDevices = useMemo(() => getDevices(), []);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<DeviceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | 'all'>('all');
  const [sortField, setSortField] = useState<keyof Device>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = allDevices;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.id.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.zone.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== 'all') result = result.filter(d => d.type === typeFilter);
    if (statusFilter !== 'all') result = result.filter(d => d.status === statusFilter);

    result = [...result].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });
    return result;
  }, [allDevices, search, typeFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: keyof Device) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }: { field: keyof Device }) => (
    <ArrowUpDown className={cn('w-3 h-3 ml-1 inline-block', sortField === field ? 'text-blue-400' : 'text-slate-600')} />
  );

  return (
    <div>
      <PageHeader
        title="Device Management"
        subtitle={`${allDevices.length.toLocaleString()} registered IoT devices`}
        breadcrumb={[{ label: 'GridWeaver' }, { label: 'Devices' }]}
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:bg-white/10 transition-all">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all',
                showFilters ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
          </div>
        }
      />

      {/* Search and Filters */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#111827] border border-white/5">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by ID, name, or zone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none w-full"
            />
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex gap-3"
          >
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value as DeviceType | 'all'); setPage(1); }}
                className="appearance-none px-3 py-2 pr-8 rounded-lg bg-[#111827] border border-white/10 text-xs text-slate-300 outline-none cursor-pointer"
              >
                <option value="all">All Types</option>
                {(['solar_panel', 'battery', 'ev_charger', 'wind_turbine', 'transformer', 'smart_meter', 'power_station'] as DeviceType[]).map(t => (
                  <option key={t} value={t}>{getDeviceTypeLabel(t)}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value as DeviceStatus | 'all'); setPage(1); }}
                className="appearance-none px-3 py-2 pr-8 rounded-lg bg-[#111827] border border-white/10 text-xs text-slate-300 outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="fault">Fault</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <span className="text-xs text-blue-400 font-medium">{filtered.length.toLocaleString()} results</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Table */}
      <GlassCard noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  { key: 'id', label: 'Device ID' },
                  { key: 'type', label: 'Type' },
                  { key: 'zone', label: 'Zone' },
                  { key: 'status', label: 'Status' },
                  { key: 'state', label: 'State' },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key as keyof Device)}
                    className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                  >
                    {col.label}<SortIcon field={col.key as keyof Device} />
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Power</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Voltage</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Battery</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Temp</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Updated</th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {pageData.map((device, i) => (
                <motion.tr
                  key={device.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-4 py-3">
                    <span className="text-blue-400 font-mono font-medium">{device.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-300">{getDeviceTypeLabel(device.type)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-400">{device.zone}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={device.status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={device.state} /></td>
                  <td className="px-4 py-3">
                    <span className="text-slate-300 font-medium">{formatPower(device.telemetry.power)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-300">{device.telemetry.voltage} V</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${device.telemetry.battery}%`,
                            background: device.telemetry.battery > 50 ? '#10B981' : device.telemetry.battery > 20 ? '#F59E0B' : '#EF4444',
                          }}
                        />
                      </div>
                      <span className="text-slate-400 w-8 text-right">{device.telemetry.battery}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('font-medium', device.telemetry.temperature > 60 ? 'text-red-400' : device.telemetry.temperature > 45 ? 'text-amber-400' : 'text-slate-300')}>
                      {device.telemetry.temperature}°C
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-500">{new Date(device.lastUpdated).toLocaleTimeString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/devices/${device.id}`)}
                        className="p-1.5 rounded-md hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 transition-colors"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors" title="History">
                        <History className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 hover:text-white transition-colors" title="Map">
                        <MapPin className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
          <span className="text-xs text-slate-500">
            Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) pageNum = i + 1;
              else if (page <= 4) pageNum = i + 1;
              else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
              else pageNum = page - 3 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={cn(
                    'w-8 h-8 rounded-md text-xs font-medium transition-colors',
                    page === pageNum ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-white/5'
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md hover:bg-white/5 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
