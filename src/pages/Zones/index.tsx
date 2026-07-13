import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Hexagon, Zap, Battery, AlertTriangle, Activity, MapPin, ChevronRight
} from 'lucide-react';
import { PageHeader, GlassCard } from '../../components/ui';
import { getGridZones } from '../../services/mockData';
import { cn } from '../../utils';

export default function Zones() {
  const zones = useMemo(() => getGridZones(), []);

  return (
    <div>
      <PageHeader
        title="Grid Zones"
        subtitle="Manage and view telemetry partitioned by geographic regions and substations"
        breadcrumb={[{ label: 'GridWeaver' }, { label: 'Grid Zones' }]}
      />

      {/* Overview stats or zone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {zones.map((zone) => {
          const isHighHealth = zone.gridHealth >= 95;
          const isWarningHealth = zone.gridHealth >= 90 && zone.gridHealth < 95;

          return (
            <motion.div
              key={zone.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard
                title={zone.name}
                subtitle={`${zone.region} Sector Substation`}
                action={
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: zone.color }}
                  />
                }
              >
                <div className="space-y-4">
                  {/* Health Meter */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                        Zone Stability Index
                      </span>
                      <span
                        className={cn(
                          'text-xs font-bold',
                          isHighHealth
                            ? 'text-emerald-400'
                            : isWarningHealth
                              ? 'text-amber-400'
                              : 'text-red-400'
                        )}
                      >
                        {zone.gridHealth}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${zone.gridHealth}%`,
                          backgroundColor: isHighHealth
                            ? '#10B981'
                            : isWarningHealth
                              ? '#F59E0B'
                              : '#EF4444',
                        }}
                      />
                    </div>
                  </div>

                  {/* Quick details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <div>
                        <p className="text-[10px] text-slate-500">Generation</p>
                        <p className="font-semibold text-white">
                          {zone.powerProduced.toFixed(1)} MW
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-blue-400" />
                      <div>
                        <p className="text-[10px] text-slate-500">Consumption</p>
                        <p className="font-semibold text-white">
                          {zone.powerConsumed.toFixed(1)} MW
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Battery className="w-3.5 h-3.5 text-emerald-400" />
                      <div>
                        <p className="text-[10px] text-slate-500">Storage Cap.</p>
                        <p className="font-semibold text-white">
                          {zone.batteryCapacity.toFixed(1)} MWh
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                      <div>
                        <p className="text-[10px] text-slate-500">Faults Count</p>
                        <p className="font-semibold text-white">
                          {zone.faultCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom details */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Hexagon className="w-3 h-3 text-slate-500" />{' '}
                      {zone.totalDevices} Devices
                    </span>
                    <button className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-0.5">
                      Console <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
