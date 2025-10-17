'use client';

import { Zap, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../shared/GlassCard';

export default function AutomationStatus({ lastRun }) {
  const formatTime = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';  
  }
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  });
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="mb-12"
    >
      <GlassCard className="flex items-center justify-between" hover={false}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <Zap className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-gray-200">
                Automation Active
              </h3>
            </div>
            <p className="text-sm text-gray-500">Daily report generation running in background</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Last Run</span>
          </div>
          <p className="text-sm font-mono text-purple-400">
            {formatTime(lastRun)}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}