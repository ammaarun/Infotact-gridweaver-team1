import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  color?: string;
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, color = '#2563EB', className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative rounded-xl border border-white/5 bg-[#111827] p-5 overflow-hidden group',
        className
      )}
    >
      <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <AnimatedNumber value={typeof value === 'number' ? value : 0} display={String(value)} />
            {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
          </div>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span className={cn('text-xs font-medium', trend.value >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-[10px] text-slate-500">{trend.label}</span>
            </div>
          )}
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ background: `${color}15` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </motion.div>
  );
}

function AnimatedNumber({ value, display }: { value: number; display: string }) {
  const [shown, setShown] = useState(display);
  const prev = useRef(value);

  useEffect(() => {
    if (value === 0) {
      setShown(display);
      return;
    }
    const start = prev.current;
    const end = value;
    const duration = 600;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setShown(typeof value === 'number' && !display.includes('.') ? Math.round(current).toLocaleString() : current.toFixed(1));
      if (progress < 1) requestAnimationFrame(tick);
      else { setShown(display); prev.current = end; }
    };
    requestAnimationFrame(tick);
  }, [value, display]);

  return <span className="text-2xl font-bold text-white tabular-nums">{shown}</span>;
}

// Status Badge
interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    online: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    offline: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    fault: 'bg-red-500/15 text-red-400 border-red-500/20',
    maintenance: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    critical: 'bg-red-500/15 text-red-400 border-red-500/20',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    info: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    active: 'bg-red-500/15 text-red-400 border-red-500/20',
    acknowledged: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    idle: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
    charging: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    discharging: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    generating: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium capitalize',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        colors[status] || 'bg-slate-500/15 text-slate-400 border-slate-500/20'
      )}
    >
      <span className={cn(
        'rounded-full',
        size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
        status === 'online' || status === 'resolved' || status === 'generating' ? 'bg-emerald-400 animate-pulse' :
        status === 'fault' || status === 'critical' || status === 'active' ? 'bg-red-400 animate-pulse' :
        status === 'warning' || status === 'maintenance' || status === 'acknowledged' || status === 'charging' ? 'bg-amber-400' :
        'bg-slate-400'
      )} />
      {status}
    </span>
  );
}

// Glass Card
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  noPadding?: boolean;
}

export function GlassCard({ children, className, title, subtitle, action, noPadding }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-xl border border-white/5 bg-[#111827]/80 backdrop-blur-sm overflow-hidden',
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            {title && <h3 className="text-sm font-semibold text-white">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </motion.div>
  );
}

// Skeleton Loader
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-white/5', className)} />
  );
}

// Empty State
interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-slate-500">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm">{description}</p>
    </div>
  );
}

// Page Header
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: { label: string; path?: string }[];
}

export function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumb && (
        <div className="flex items-center gap-2 mb-2">
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-600">/</span>}
              <span className={cn('text-xs', i === breadcrumb.length - 1 ? 'text-slate-300' : 'text-slate-500')}>
                {item.label}
              </span>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}
