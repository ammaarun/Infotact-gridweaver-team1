import { useMemo, useState } from 'react';
import {
  Zap, ShieldAlert, Radio, Wrench, ShieldCheck, Power, RefreshCw, Cpu
} from 'lucide-react';
import { PageHeader, GlassCard, StatCard } from '../../components/ui';
import { getGridZones } from '../../services/mockData';

export default function OperatorConsole() {
  const zones = useMemo(() => getGridZones().slice(0, 8), []);
  const [overrideActive, setOverrideActive] = useState(false);
  const [loadAdjustment, setLoadAdjustment] = useState(0);

  return (
    <div>
      <PageHeader
        title="Operator Console"
        subtitle="Critical manual overrides, load shedding commands, and telemetry control keys"
        breadcrumb={[{ label: 'GridWeaver' }, { label: 'Operator Console' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Override panel */}
        <div className="space-y-4">
          <GlassCard title="Manual Grid Overrides" subtitle="Bypass safety limits for load management">
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">CAUTION: Override Mode</p>
                    <p className="text-[10px] opacity-80 mt-0.5">
                      Activating overrides skips secondary load balancing rules.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg">
                <div>
                  <p className="font-semibold text-white">Grid Override State</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {overrideActive ? 'OVERRIDE PROTOCOLS ACTIVE' : 'Safety interlocks normal'}
                  </p>
                </div>
                <button
                  onClick={() => setOverrideActive(!overrideActive)}
                  className={`px-3 py-1.5 rounded text-[11px] font-bold transition-colors ${
                    overrideActive
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : 'bg-white/10 hover:bg-white/15 text-slate-300'
                  }`}
                >
                  {overrideActive ? 'DEACTIVATE' : 'ACTIVATE'}
                </button>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-2 flex items-center justify-between">
                  <span>Emergency Load Shedding</span>
                  <span className="text-red-400 font-mono font-bold">
                    {loadAdjustment > 0 ? `-${loadAdjustment}%` : 'NOMINAL'}
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={loadAdjustment}
                  onChange={(e) => setLoadAdjustment(Number(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Adjust output values to trim auxiliary systems demand.
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Substation Frequencies" subtitle="Live primary frequency (nominal 50 Hz)">
            <div className="space-y-3">
              {[
                { name: 'Substation Alpha', value: '49.98 Hz', status: 'Stable' },
                { name: 'Substation Beta', value: '50.02 Hz', status: 'Stable' },
                { name: 'Substation Gamma', value: '49.88 Hz', status: 'Marginal' },
              ].map((sub, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                  <span className="text-slate-400 font-medium">{sub.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-white font-semibold">{sub.value}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      sub.status === 'Stable' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>{sub.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Telemetry zones */}
        <div className="lg:col-span-2">
          <GlassCard title="Active Power Balancers" subtitle="Live zone balance comparison">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {zones.map((zone) => {
                const diff = zone.powerProduced - zone.powerConsumed;
                const isSurplus = diff >= 0;

                return (
                  <div
                    key={zone.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{zone.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        isSurplus ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {isSurplus ? 'SURPLUS' : 'DEFICIT'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <p className="text-slate-500">Produced</p>
                        <p className="font-semibold text-white">{zone.powerProduced.toFixed(1)} MW</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Consumed</p>
                        <p className="font-semibold text-white">{zone.powerConsumed.toFixed(1)} MW</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Balance</span>
                      <span className={`font-semibold ${isSurplus ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isSurplus ? '+' : ''}{diff.toFixed(1)} MW
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
