'use client';

import { useState } from 'react';
import { Zap, TrendingUp, BarChart3, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedButton from '../shared/AnimatedButton';
import { api } from '@/lib/api';

export default function ActionButtons({ onSuccess }) {
  const [loading, setLoading] = useState({});

  const handleGenerate = async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const data = await api.generateReport(type);
      if (data.ok) {
        onSuccess(data.message);
      }
    } catch (error) {
      onSuccess('Failed to generate report', 'error');
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const buttons = [
    { 
      type: 'all', 
      label: 'Generate All Reports', 
      icon: Zap, 
      variant: 'primary',
      className: 'col-span-2 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50'
    },
    { type: 'sales', label: 'Sales Report', icon: TrendingUp, variant: 'outline' },
    { type: 'marketing', label: 'Marketing Report', icon: BarChart3, variant: 'outline' },
    { type: 'summary', label: 'Summary Report', icon: FileText, variant: 'outline' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
    >
      {buttons.map((btn, index) => (
        <motion.div
          key={btn.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.1 }}
        >
          <AnimatedButton
            onClick={() => handleGenerate(btn.type)}
            loading={loading[btn.type]}
            variant={btn.variant}
            icon={btn.icon}
            className={`w-full ${btn.className || ''}`}
          >
            {btn.label}
          </AnimatedButton>
        </motion.div>
      ))}
    </motion.div>
  );
}