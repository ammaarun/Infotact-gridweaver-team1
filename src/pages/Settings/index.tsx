import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
  Settings as SettingsIcon, Bell, RefreshCw, Volume2, Shield, User,
  Save, CheckCircle
} from 'lucide-react';
import { PageHeader, GlassCard } from '../../components/ui';
import { fetchOperatorProfile } from '../../services/telemetryApi';
import { useQuery } from '@tanstack/react-query';
import { cn } from '../../utils';
import type { SettingsConfig } from '../../types';

export default function Settings() {
  const { data: profile = {} as any } = useQuery({ queryKey: ['operatorProfile'], queryFn: fetchOperatorProfile });
  const [successMsg, setSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit } = useForm<SettingsConfig>({
    defaultValues: {
      theme: 'dark',
      notifications: true,
      refreshInterval: 5,
      language: 'en',
      mapStyle: 'dark',
      alertSound: true,
      autoAcknowledge: false,
    },
  });

  const onSubmit = (data: SettingsConfig) => {
    setIsSaving(true);
    setSuccessMsg('');
    setTimeout(() => {
      setIsSaving(false);
      setSuccessMsg('System configuration saved successfully.');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Control Settings"
        subtitle="Configure dashboard limits, notifications, and telemetry refresh loops"
        breadcrumb={[{ label: 'GridWeaver' }, { label: 'Settings' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        {/* Settings Configuration form */}
        <GlassCard title="Dashboard Configuration Options">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-xs">
            {/* Telemetry Refresh loop */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Telemetry Refresh Interval
              </label>
              <p className="text-[10px] text-slate-500 mb-2">
                Set how often the virtual thread pool pulls status telemetry from IoT nodes.
              </p>
              <select
                {...register('refreshInterval', { valueAsNumber: true })}
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
              >
                <option value={1}>1 Second (Realtime continuous)</option>
                <option value={2}>2 Seconds</option>
                <option value={5}>5 Seconds (Recommended)</option>
                <option value={10}>10 Seconds</option>
                <option value={30}>30 Seconds</option>
              </select>
            </div>

            {/* Notification and Sounds */}
            <div className="space-y-3 pt-2">
              <h4 className="text-slate-400 font-semibold border-b border-white/5 pb-1">
                Notifications & Alarms
              </h4>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('notifications')}
                  className="rounded bg-[#111827] border-white/10 text-blue-500 focus:ring-0"
                />
                Enable visual alert banners for critical events
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('alertSound')}
                  className="rounded bg-[#111827] border-white/10 text-blue-500 focus:ring-0"
                />
                Audible alarm notification on critical zone faults
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  {...register('autoAcknowledge')}
                  className="rounded bg-[#111827] border-white/10 text-blue-500 focus:ring-0"
                />
                Auto-acknowledge warnings beneath Severity Level 1
              </label>
            </div>

            {/* GIS mapping theme */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                GIS Mapping Style
              </label>
              <select
                {...register('mapStyle')}
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
              >
                <option value="dark">Carto Dark (Premium Slate)</option>
                <option value="satellite">Satellite Orthographic Map</option>
                <option value="street">Standard Vector street lines</option>
              </select>
            </div>

            {/* System lang */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Localization & Units
              </label>
              <select
                {...register('language')}
                className="w-full bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
              >
                <option value="en">English (kW / MW / V / °C)</option>
                <option value="de">Deutsch (kW / MW / V / °C)</option>
                <option value="jp">日本語 (kW / MW / V / °C)</option>
              </select>
            </div>

            {/* Feedback Message */}
            {successMsg && (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving Configurations...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        </GlassCard>

        {/* Operator Profile panel */}
        <div className="space-y-4">
          <GlassCard title="Operator Session Profile">
            <div className="flex flex-col items-center text-center py-4 border-b border-white/5 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white text-xl font-bold mb-3">
                {profile.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <h4 className="font-bold text-white text-sm">{profile.name}</h4>
              <p className="text-xs text-blue-400 font-medium mt-0.5">
                {profile.role}
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Assigned Substation
                </p>
                <p className="text-white font-semibold">{profile.station}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Active Operator Shift
                </p>
                <p className="text-white font-semibold">{profile.shift}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Authentication Rank
                </p>
                <p className="text-emerald-400 font-semibold">Tier 3 Root operator</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
