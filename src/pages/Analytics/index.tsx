import { useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend, Cell, PieChart, Pie
} from 'recharts';
import { PageHeader, GlassCard, StatCard } from '../../components/ui';
import {
  fetchWeeklyGenerationData,
  fetchMonthlyGenerationData,
  fetchFaultStatisticsData,
  fetchZoneComparisonData,
  fetchPeakHoursData,
  fetchPowerData
} from '../../services/telemetryApi';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Activity, AlertTriangle, Battery, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '../../utils';

const chartTooltipStyle = {
  contentStyle: { background: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' },
  labelStyle: { color: '#94A3B8' },
  itemStyle: { color: '#F8FAFC' },
};

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#38BDF8'];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const { data: weeklyData = [] } = useQuery({ queryKey: ['weeklyData'], queryFn: fetchWeeklyGenerationData });
  const { data: monthlyData = [] } = useQuery({ queryKey: ['monthlyData'], queryFn: fetchMonthlyGenerationData });
  const { data: faultData = [] } = useQuery({ queryKey: ['faultData'], queryFn: fetchFaultStatisticsData });
  const { data: zoneData = [] } = useQuery({ queryKey: ['zoneData'], queryFn: fetchZoneComparisonData });
  const { data: peakData = [] } = useQuery({ queryKey: ['peakData'], queryFn: fetchPeakHoursData });
  const { data: dailyData = [] } = useQuery({ queryKey: ['powerData'], queryFn: fetchPowerData });

  const currentGenConsData = useMemo(() => {
    if (timeRange === 'daily') {
      return dailyData.map(d => ({
        name: d.name,
        generation: d.generation,
        consumption: d.consumption
      }));
    }
    if (timeRange === 'weekly') {
      return weeklyData.map(d => ({
        name: d.name,
        generation: d.solar + d.wind + d.other,
        consumption: d.solar + d.wind + d.other - 150 // Mock consumption
      }));
    }
    return monthlyData.map(d => ({
      name: d.name,
      generation: d.generation / 100, // Normalized
      consumption: d.consumption / 100
    }));
  }, [timeRange, dailyData, weeklyData, monthlyData]);

  const pieData = useMemo(() => {
    if (weeklyData.length === 0) return [];
    const totalSolar = weeklyData.reduce((acc, d) => acc + d.solar, 0);
    const totalWind = weeklyData.reduce((acc, d) => acc + d.wind, 0);
    const totalOther = weeklyData.reduce((acc, d) => acc + d.other, 0);
    return [
      { name: 'Solar', value: totalSolar },
      { name: 'Wind', value: totalWind },
      { name: 'Other', value: totalOther }
    ];
  }, [weeklyData]);

  return (
    <div>
      <PageHeader
        title="Grid Analytics"
        subtitle="Historical analysis, generation data, and performance indicators"
        breadcrumb={[{ label: 'GridWeaver' }, { label: 'Analytics' }]}
        actions={
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize',
                  timeRange === r
                    ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Peak Generation" value="482.5 MW" icon={<TrendingUp className="w-5 h-5" />} color="#10B981" subtitle="14:00 Today" />
        <StatCard title="Average Grid Load" value="74.2%" icon={<Activity className="w-5 h-5" />} color="#2563EB" subtitle="Stable" />
        <StatCard title="Battery Roundtrip Eff." value="91.4%" icon={<Battery className="w-5 h-5" />} color="#8B5CF6" subtitle="Optimal" />
        <StatCard title="Reported Grid Anomalies" value="12" icon={<AlertTriangle className="w-5 h-5" />} color="#EF4444" trend={{ value: -14.2, label: 'vs last week' }} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Generation vs Consumption */}
        <GlassCard title="Generation vs Consumption Trend" subtitle={`View by ${timeRange} range`}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentGenConsData}>
                <defs>
                  <linearGradient id="genColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="conColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} />
                <Tooltip {...chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="generation" stroke="#10B981" fillOpacity={1} fill="url(#genColor)" strokeWidth={2} name="Generation" />
                <Area type="monotone" dataKey="consumption" stroke="#2563EB" fillOpacity={1} fill="url(#conColor)" strokeWidth={2} name="Consumption" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Energy Source Mix */}
        <GlassCard title="Energy Generation Mix" subtitle="Distribution by source type (Weekly)">
          <div className="grid grid-cols-2 items-center h-72">
            <div className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-white">{entry.name}</p>
                    <p className="text-[10px] text-slate-500">{entry.value.toLocaleString()} MWh generated</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Peak Hours Grid Load */}
        <GlassCard title="Peak Hours Grid Demand" subtitle="Supply vs demand over 24 hours">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={peakData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} />
                <Tooltip {...chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="demand" stroke="#EF4444" strokeWidth={2.5} dot={false} name="Grid Demand (MW)" />
                <Line type="monotone" dataKey="supply" stroke="#38BDF8" strokeWidth={2} dot={false} name="Available Supply (MW)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Zone Load Comparisons */}
        <GlassCard title="Power Load by Zones" subtitle="Comparison of top grid zones">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 9 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="power" fill="#38BDF8" radius={[4, 4, 0, 0]} name="Power Output (MW)">
                  {zoneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Fault Statistics */}
      <GlassCard title="Grid Component Fault Rates" subtitle="Anomalies and warning alerts by device category">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={faultData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} />
              <YAxis tick={{ fill: '#64748B', fontSize: 10 }} />
              <Tooltip {...chartTooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="faults" fill="#EF4444" name="Critical Faults" radius={[4, 4, 0, 0]} />
              <Bar dataKey="warnings" fill="#F59E0B" name="Warning Alerts" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}
