'use client';

import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const Icon = toast.type === 'success' ? CheckCircle2 : AlertCircle;
  const colorClass = toast.type === 'success' 
    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100' 
    : 'bg-red-500/20 border-red-500/30 text-red-100';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl ${colorClass}`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{toast.message}</span>
        <button 
          onClick={onClose} 
          className="ml-2 hover:opacity-70 transition-opacity"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}