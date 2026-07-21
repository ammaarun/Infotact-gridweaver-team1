import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  FileText, Download, CheckCircle, Calendar, Shield, AlertTriangle
} from 'lucide-react';
import { PageHeader, GlassCard } from '../../components/ui';
import { fetchGridZones } from '../../services/telemetryApi';
import { useQuery } from '@tanstack/react-query';
import { cn } from '../../utils';
import type { ReportConfig } from '../../types';

export default function Reports() {
  const { data: zones = [] } = useQuery({ queryKey: ['zones'], queryFn: fetchGridZones });
  const [isGenerating, setIsGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, watch } = useForm<ReportConfig>({
    defaultValues: {
      type: 'daily',
      startDate: new Date().toISOString().substring(0, 10),
      endDate: new Date().toISOString().substring(0, 10),
      zones: ['all'],
      includeCharts: true,
      format: 'pdf',
    },
  });

  const onSubmit = (data: ReportConfig) => {
    setIsGenerating(true);
    setSuccessMsg('');
    setTimeout(() => {
      setIsGenerating(false);
      setSuccessMsg(
        `Report generated successfully in ${data.format.toUpperCase()} format. Export downloaded.`
      );
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Telemetry Reports"
        subtitle="Generate and export system performance reports"
        breadcrumb={[{ label: 'GridWeaver' }, { label: 'Reports' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6">
        <GlassCard title="Configure Report Parameters">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
            {/* Report Type */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'daily', label: 'Daily Summary', desc: 'Detailed 24-hr status' },
                { value: 'weekly', label: 'Weekly Overview', desc: '7-day aggregation' },
                { value: 'monthly', label: 'Monthly Report', desc: '30-day grid trends' },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    'flex flex-col p-3 rounded-lg border cursor-pointer select-none transition-all',
                    watch('type') === opt.value
                      ? 'bg-blue-500/10 border-blue-500/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  )}
                >
                  <input
                    type="radio"
                    value={opt.value}
                    {...register('type')}
                    className="sr-only"
                  />
                  <span className="font-semibold text-xs mb-1">{opt.label}</span>
                  <span className="text-[10px] text-slate-500">{opt.desc}</span>
                </label>
              ))}
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-500 mb-1">Start Date</label>
                <div className="relative">
                  <input
                    type="date"
                    {...register('startDate')}
                    className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">End Date</label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Target Zones Selection */}
            <div>
              <label className="block text-slate-500 mb-1">Select Zones</label>
              <select
                multiple
                {...register('zones')}
                className="w-full h-32 bg-[#111827] border border-white/10 rounded-lg p-2 text-white outline-none focus:border-blue-500"
              >
                <option value="all">All Substation Zones</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name} ({z.region})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500 mt-1">
                Hold Ctrl (Cmd) to select multiple specific zones.
              </p>
            </div>

            {/* Include elements */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-slate-400 select-none cursor-pointer">
                <input
                  type="checkbox"
                  {...register('includeCharts')}
                  className="rounded bg-[#111827] border-white/10 text-blue-500 focus:ring-0"
                />
                Include graphical charts and visualization trends
              </label>
            </div>

            {/* Formats Selection */}
            <div>
              <label className="block text-slate-500 mb-2">Export Format</label>
              <div className="flex gap-4">
                {[
                  { value: 'pdf', label: 'PDF Document' },
                  { value: 'excel', label: 'Excel Worksheet' },
                  { value: 'csv', label: 'CSV Spreadsheet' },
                ].map((f) => (
                  <label
                    key={f.value}
                    className="flex items-center gap-2 text-slate-300 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={f.value}
                      {...register('format')}
                      className="bg-[#111827] border-white/10 text-blue-500 focus:ring-0"
                    />
                    {f.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Feedback Message */}
            {successMsg && (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isGenerating ? 'Compiling Report...' : 'Compile and Download'}
              </button>
            </div>
          </form>
        </GlassCard>

        {/* Info panel */}
        <div className="space-y-4">
          <GlassCard title="Recent Exports">
            <div className="space-y-3 text-xs">
              {[
                { name: 'Grid_Status_Daily_2026-07-13.pdf', date: 'Today, 10:42 AM', size: '2.4 MB' },
                { name: 'Weekly_Load_Mix_W28.xlsx', date: 'Yesterday, 4:15 PM', size: '840 KB' },
                { name: 'Anomalies_Log_June.csv', date: 'Jul 01, 2026', size: '150 KB' },
              ].map((exp, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 pb-2 border-b border-white/5 last:border-0 last:pb-0"
                >
                  <FileText className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{exp.name}</p>
                    <p className="text-[10px] text-slate-500">{exp.date}</p>
                  </div>
                  <span className="text-[10px] text-slate-600">{exp.size}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
