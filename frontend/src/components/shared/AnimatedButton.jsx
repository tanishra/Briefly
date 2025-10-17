'use client';

import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

export default function AnimatedButton({ 
  children, 
  onClick, 
  loading = false, 
  variant = 'primary',
  icon: Icon,
  className = '',
  disabled = false,
  type = 'button'
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50',
    secondary: 'bg-slate-800/50 hover:bg-slate-700/50 text-gray-200 border border-slate-700 hover:border-slate-600',
    outline: 'border-2 border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10 text-purple-300',
    ghost: 'hover:bg-slate-800/30 text-gray-300 hover:text-gray-100'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      className={`
        relative px-6 py-3 rounded-xl font-semibold
        flex items-center justify-center gap-2
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${loading ? 'cursor-wait' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5" />}
          {children}
        </>
      )}
    </motion.button>
  );
}