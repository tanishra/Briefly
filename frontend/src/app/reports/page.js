'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import GlassCard from '@/components/shared/GlassCard';
import AnimatedButton from '@/components/shared/AnimatedButton';
import { api } from '@/lib/api';

export default function ReportsPage() {
  const [reports] = useState([
    {
      id: 1,
      filename: 'daily_executive_summary_20251015.txt',
      type: 'Executive Summary',
      date: '2025-10-15',
      size: '45 KB'
    },
    {
      id: 2,
      filename: 'sales_report_20251015.txt',
      type: 'Sales Report',
      date: '2025-10-15',
      size: '32 KB'
    },
    {
      id: 3,
      filename: 'marketing_insights_20251015.txt',
      type: 'Marketing Report',
      date: '2025-10-15',
      size: '28 KB'
    },
  ]);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">All Reports</h1>
          <p className="text-gray-400">View and download your generated reports</p>
        </div>

        {/* Reports Table */}
        <GlassCard hover={false}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Filename</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400">Size</th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-gray-200">{report.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-400 font-mono">{report.filename}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(report.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-400">{report.size}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => api.downloadReport(report.filename)}
                          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Empty State (if no reports) */}
        {reports.length === 0 && (
          <GlassCard>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Reports Yet</h3>
              <p className="text-gray-500 mb-6">Generate your first report to see it here</p>
              <AnimatedButton variant="primary">
                Go to Dashboard
              </AnimatedButton>
            </div>
          </GlassCard>
        )}
      </motion.div>
    </MainLayout>
  );
}