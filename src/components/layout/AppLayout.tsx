import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAppSelector } from '../../hooks/useRedux';

export default function AppLayout() {
  const collapsed = useAppSelector((s) => s.app.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
      <Sidebar />
      <Navbar />
      <motion.main
        initial={false}
        animate={{ marginLeft: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="pt-16 min-h-screen"
      >
        <div className="p-6">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
