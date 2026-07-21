import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Play, Pause, RefreshCw, Activity, ArrowRight, FileText, CheckCircle2, AlertTriangle, AlertCircle
} from 'lucide-react';
import { PageHeader, GlassCard, StatusBadge } from '../../components/ui';
import { fetchEventLogs, fetchAllDevices } from '../../services/telemetryApi';
import { useQuery } from '@tanstack/react-query';
import { cn } from '../../utils';
import type { DeviceState, EventLog } from '../../types';

interface StateNode {
  id: DeviceState;
  label: string;
  description: string;
  color: string;
  bgClass: string;
}

const STATES: StateNode[] = [
  { id: 'offline', label: 'Offline', description: 'Device connection lost or shut down', color: '#94A3B8', bgClass: 'bg-slate-500/10 border-slate-500/30 text-slate-400' },
  { id: 'idle', label: 'Idle', description: 'Connected, ready, zero energy transfer', color: '#94A3B8', bgClass: 'bg-slate-400/10 border-slate-400/30 text-slate-400' },
  { id: 'generating', label: 'Generating', description: 'Producing energy onto the microgrid', color: '#10B981', bgClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' },
  { id: 'charging', label: 'Charging', description: 'Absorbing energy from the microgrid', color: '#F59E0B', bgClass: 'bg-amber-500/10 border-amber-500/30 text-amber-400' },
  { id: 'discharging', label: 'Discharging', description: 'Supplying battery reserves to the grid', color: '#2563EB', bgClass: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  { id: 'fault', label: 'Fault', description: 'Internal safety threshold trip / error status', color: '#EF4444', bgClass: 'bg-red-500/10 border-red-500/30 text-red-400' },
];

export default function StateMachine() {
  const [activeNode, setActiveNode] = useState<DeviceState>('idle');
  const [isRunning, setIsRunning] = useState(true);
  
  const { data: initialLogs = [] } = useQuery({ queryKey: ['events'], queryFn: fetchEventLogs });
  const { data: devices = [] } = useQuery({ queryKey: ['allDevices'], queryFn: fetchAllDevices });
  
  const [logs, setLogs] = useState<EventLog[]>([]);

  useEffect(() => {
    if (initialLogs.length > 0 && logs.length === 0) {
      setLogs(initialLogs.slice(0, 15));
    }
  }, [initialLogs, logs.length]);

  // Simulate incoming live transitions
  useEffect(() => {
    if (!isRunning || devices.length === 0) return;

    const interval = setInterval(() => {
      // Pick random device to transition
      const device = devices[Math.floor(Math.random() * devices.length)] as any;
      const oldState = device.state;
      const stateOptions: DeviceState[] = ['idle', 'charging', 'discharging', 'generating', 'fault', 'offline'];
      const newState = stateOptions[Math.floor(Math.random() * stateOptions.length)];

      if (oldState === newState) return;

      const newLog: EventLog = {
        id: `LOG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        deviceId: device.id,
        deviceName: device.name,
        deviceType: device.type,
        oldState,
        newState,
        reason: 'Autonomous Telemetry Threshold Change',
        operator: 'System Orchestrator',
        timestamp: new Date().toISOString(),
        zone: device.zone,
      };

      setActiveNode(newState);
      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isRunning, devices]);

  return (
    <div>
      <PageHeader
        title="Virtual Thread State Engine"
        subtitle="Live state transitions, thread pools, and active device state logic nodes"
        breadcrumb={[{ label: 'GridWeaver' }, { label: 'State Machine' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all',
                isRunning
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              )}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause Sim
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Resume Sim
                </>
              )}
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111827] border border-white/5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-slate-300">Virtual Threads: Active</span>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-[1fr_380px] gap-6">
        {/* State Node Graph Container */}
        <div className="space-y-4">
          <GlassCard title="Grid Engine State Diagram" subtitle="Click on a state to view target definition or observe active simulated states">
            <div className="relative min-h-[480px] bg-slate-950/40 rounded-xl border border-white/5 p-6 flex flex-col justify-between overflow-hidden">
              {/* Outer boundary Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

              {/* Connected Lines Visuals */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <svg className="w-full h-full opacity-20">
                  {/* Connecting state paths */}
                  <line x1="15%" y1="50%" x2="50%" y2="20%" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5 5" />
                  <line x1="50%" y1="20%" x2="85%" y2="50%" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5 5" />
                  <line x1="85%" y1="50%" x2="65%" y2="80%" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5 5" />
                  <line x1="65%" y1="80%" x2="35%" y2="80%" stroke="#38BDF8" strokeWidth="2" />
                  <line x1="35%" y1="80%" x2="15%" y2="50%" stroke="#EF4444" strokeWidth="2" />
                  <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#38BDF8" strokeWidth="1" />
                </svg>
              </div>

              {/* State grid nodes */}
              <div className="relative grid grid-cols-3 gap-8 py-10 z-10">
                {STATES.map((node) => {
                  const isActive = activeNode === node.id;
                  return (
                    <motion.div
                      key={node.id}
                      onClick={() => setActiveNode(node.id)}
                      className={cn(
                        'flex flex-col p-4 rounded-xl border cursor-pointer select-none transition-all duration-300',
                        isActive
                          ? 'bg-[#111827] border-blue-500/80 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                          : 'bg-[#111827]/40 border-white/5 hover:border-white/10'
                      )}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded', node.bgClass)}>
                          {node.label}
                        </span>
                        {isActive && (
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {node.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Engine State Overview Info */}
              <div className="relative bg-[#111827]/80 border border-white/5 p-4 rounded-lg z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold">Active State Process Pool</p>
                    <p className="text-[10px] text-slate-500">System is observing transitions across 10K virtual threads.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Stable Load</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">100% OK</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Transition Log List */}
        <div className="space-y-4">
          <GlassCard title="Transition Logs" subtitle="Simulated state changes in real-time" noPadding>
            <div className="max-h-[500px] overflow-y-auto divide-y divide-white/5 scrollbar-thin">
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-4 hover:bg-white/[0.01]"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-blue-400">
                        {log.deviceName}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 capitalize">
                        {log.oldState}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/40 text-blue-400 capitalize">
                        {log.newState}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-normal">
                      Trigger: {log.reason}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
