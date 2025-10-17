'use client';

import { motion } from 'framer-motion';

export default function GlassCard({ 
  children, 
  className = '', 
  hover = true, 
  delay = 0 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      className={`
        glass-effect rounded-2xl p-6 
        transition-all duration-300
        ${hover ? 'cursor-pointer' : ''} 
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
