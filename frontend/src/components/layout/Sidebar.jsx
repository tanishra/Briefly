'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, FileText, Zap, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Ask AI', path: '/ask-ai', icon: MessageSquare },
  { name: 'Reports', path: '/reports', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-950/50 backdrop-blur-xl border-r border-slate-800/50 p-6 z-30">
      <nav className="space-y-2">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-300 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/20' 
                    : 'hover:bg-slate-800/30 text-gray-400 hover:text-gray-200'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto w-2 h-2 bg-purple-400 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Automation Status in Sidebar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute bottom-6 left-6 right-6 glass-effect rounded-xl p-4 border border-slate-700/50"
      >
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
          <span className="text-sm font-semibold text-gray-200">Automation</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">Active & Running</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Last: {new Date().toLocaleTimeString()}</span>
        </div>
      </motion.div>
    </aside>
  );
}
