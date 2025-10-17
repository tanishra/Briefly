'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Download, FileText, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../shared/GlassCard';
import AnimatedButton from '../shared/AnimatedButton';
import { api } from '@/lib/api';

export default function LatestReport({ report }) {
  const [expanded, setExpanded] = useState(false);

  if (!report) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-purple-400" />
          Latest Executive Summary
        </h2>
        <GlassCard delay={0.5} hover={false}>
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No reports generated yet</p>
            <p className="text-sm text-gray-500 mt-1">Click "Generate All Reports" to start</p>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-12"
    >
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FileText className="w-6 h-6 text-purple-400" />
        Latest Executive Summary
      </h2>

      <GlassCard hover={false}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              {report.filename}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <AnimatedButton
              variant="ghost"
              icon={Download}
              onClick={() => api.downloadReport(report.filename)}
            >
              Download
            </AnimatedButton>
            <AnimatedButton
              variant="ghost"
              icon={expanded ? ChevronUp : ChevronDown}
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? 'Collapse' : 'Expand'}
            </AnimatedButton>
          </div>
        </div>

        <div className="border-t border-slate-700/50 pt-4">
          <AnimatePresence mode="wait">
            {!expanded && (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="text-gray-300 line-clamp-3">
                  {report.preview || report.full_text?.substring(0, 200) + '...'}
                </p>
              </motion.div>
            )}
            
            {expanded && (
              <motion.div
                key="full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-300 font-sans text-sm leading-relaxed bg-slate-900/50 p-4 rounded-lg">
                    {report.full_text}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </motion.div>
  );
}