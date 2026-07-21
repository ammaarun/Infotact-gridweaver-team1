import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Cloud,
  Shield,
  ChevronDown,
  Sun,
  User,
  X,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { logout } from '../../store/authSlice';
import { useQuery } from '@tanstack/react-query';
import { fetchNotifications, fetchOperatorProfile } from '../../services/telemetryApi';
import { cn } from '../../utils';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const collapsed = useAppSelector((s) => s.app.sidebarCollapsed);

  const { data: notifications = [] } = useQuery({ queryKey: ['notifications'], queryFn: fetchNotifications, refetchInterval: 10000 });
  const { data: profile = {} as any } = useQuery({ queryKey: ['operatorProfile'], queryFn: fetchOperatorProfile });

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const gridHealth = 97.3;

  return (
    <header
      className="fixed top-0 right-0 h-16 z-40 flex items-center justify-between px-6 border-b border-white/5 backdrop-blur-xl"
      style={{
        left: collapsed ? 72 : 260,
        background: 'rgba(11, 18, 32, 0.8)',
        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Left: Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200',
              searchOpen
                ? 'border-blue-500/50 bg-blue-500/5 w-80'
                : 'border-white/10 bg-white/5 w-64 cursor-pointer hover:border-white/20'
            )}
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search devices, zones, alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-slate-500 bg-white/5 rounded border border-white/10">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Widgets */}
      <div className="flex items-center gap-3">
        {/* Weather */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-300 font-medium">28°C</span>
          <Cloud className="w-3.5 h-3.5 text-slate-500" />
        </div>

        {/* Grid Health */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
          <Shield className={cn('w-4 h-4', gridHealth > 95 ? 'text-emerald-400' : gridHealth > 85 ? 'text-amber-400' : 'text-red-400')} />
          <span className="text-xs text-slate-300 font-medium">Grid {gridHealth}%</span>
          <div className={cn('w-2 h-2 rounded-full animate-pulse', gridHealth > 95 ? 'bg-emerald-400' : gridHealth > 85 ? 'bg-amber-400' : 'bg-red-400')} />
        </div>

        {/* Time */}
        <div className="flex flex-col items-end px-3 py-1 rounded-lg bg-white/5 border border-white/5">
          <span className="text-xs text-white font-mono font-medium tabular-nums">
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </span>
          <span className="text-[10px] text-slate-500">
            {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
          >
            <Bell className="w-4.5 h-4.5 text-slate-300" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 rounded-xl bg-[#111827] border border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full font-medium">
                    {unreadCount} new
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer',
                        !n.read && 'bg-blue-500/5'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                          n.type === 'alert' ? 'bg-red-400' :
                          n.type === 'warning' ? 'bg-amber-400' :
                          n.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-slate-600 mt-1">
                            {new Date(n.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-white/5">
                  <button className="text-xs text-blue-400 hover:text-blue-300 font-medium w-full text-center">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-col items-start hidden lg:flex">
              <span className="text-xs font-medium text-white">{profile.name}</span>
              <span className="text-[10px] text-slate-500">{profile.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-56 rounded-xl bg-[#111827] border border-white/10 shadow-2xl py-1"
              >
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-medium text-white">{profile.name}</p>
                  <p className="text-xs text-slate-400">{profile.email}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{profile.station}</p>
                </div>
                {['Profile', 'Settings', 'Help Center'].map((item) => (
                  <button key={item} className="w-full px-4 py-2 text-left text-xs text-slate-300 hover:bg-white/5 transition-colors">
                    {item}
                  </button>
                ))}
                <div className="border-t border-white/5 mt-1">
                  <button 
                    onClick={() => dispatch(logout())}
                    className="w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
