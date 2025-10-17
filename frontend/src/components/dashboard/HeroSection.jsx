'use client';

import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-3 mb-6 px-6 py-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full"
      >
        <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
        <span className="text-sm font-semibold text-purple-300 tracking-wider uppercase">
          Powered by Microsoft Autogen
        </span>
      </motion.div>

      <h1 className="text-6xl md:text-7xl font-black mb-6 text-gradient font-display">
        AI Report Dashboard
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl mx-auto">
        Automated Intelligence for Sales & Marketing Insights
      </p>
    </motion.div>
  );
}