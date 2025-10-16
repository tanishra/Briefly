'use client';

import { Sparkles, Bell, Settings, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 hover:scale-110 transition duration-100">
              {/* <Sparkles className="w-6 h-6 text-white" /> */}
              <Sparkles className="w-6 h-6 text-white  hover:scale-100 transition duration-200" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Briefly
              </h1>
              <p className="text-xs text-gray-500">Report System</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors relative group"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-400 group-hover:text-gray-200" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <button 
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors group"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-200" />
            </button>
            <button 
              className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors group"
              aria-label="User profile"
            >
              <User className="w-5 h-5 text-gray-400 group-hover:text-gray-200" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
