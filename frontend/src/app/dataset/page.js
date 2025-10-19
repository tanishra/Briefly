'use client';

import { useState, useEffect } from 'react';
import { Database, Upload, FileText, Calendar, TrendingUp, Package, AlertCircle, BarChart3, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import GlassCard from '@/components/shared/GlassCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { api } from '@/lib/api';

export default function DatasetPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [marketingData, setMarketingData] = useState([]);
  const [columns, setColumns] = useState({ sales: [], marketing: [] });
  const [activeTab, setActiveTab] = useState('sales'); 

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    setLoading(true);
    try {
      // Load overview
      const overviewData = await api.getDatasetOverview();
      if (overviewData.ok) {
        setOverview(overviewData);
      }

      // Load sales data (first 10 records)
      const salesResp = await api.getSalesData(10);
      if (salesResp.ok) {
        setSalesData(salesResp.data);
      }

      // Load marketing data (first 10 records)
      const marketingResp = await api.getMarketingData(10);
      if (marketingResp.ok) {
        setMarketingData(marketingResp.data);
      }

      // Load columns
      const columnsResp = await api.getDatasetColumns();
      if (columnsResp.ok) {
        setColumns({
          sales: columnsResp.sales_columns,
          marketing: columnsResp.marketing_columns
        });
      }

    } catch (error) {
      console.error('Failed to load datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <LoadingSpinner size="xl" className="mx-auto mb-4" />
            <p className="text-gray-400">Loading datasets...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const salesStats = overview?.sales_dataset?.statistics || {};
  const marketingStats = overview?.marketing_dataset?.statistics || {};

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 font-display">
            Dataset Overview
          </h1>
          <p className="text-gray-400">Real data being used for AI report generation</p>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-300 mb-1">
                Active Production Datasets
              </p>
              <p className="text-xs text-green-400/80">
                Using real sales and marketing data from JSON files. Dynamic upload feature coming soon!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dataset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Sales Dataset Card */}
          <GlassCard hover={false}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-200">{overview?.sales_dataset?.name}</h2>
                  <p className="text-xs text-gray-500">{overview?.sales_dataset?.file}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-400 font-medium">
                {overview?.sales_dataset?.status?.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Total Records</p>
                <p className="text-sm font-semibold text-gray-200">
                  {overview?.sales_dataset?.total_records?.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">File Size</p>
                <p className="text-sm font-semibold text-gray-200">
                  {overview?.sales_dataset?.file_size}
                </p>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                <p className="text-sm font-semibold text-gray-200 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {overview?.sales_dataset?.last_updated}
                </p>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                <p className="text-sm font-semibold text-gray-200">
                  ${salesStats.total_revenue?.toLocaleString()}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Marketing Dataset Card */}
          <GlassCard hover={false}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-200">{overview?.marketing_dataset?.name}</h2>
                  <p className="text-xs text-gray-500">{overview?.marketing_dataset?.file}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-400 font-medium">
                {overview?.marketing_dataset?.status?.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Total Campaigns</p>
                <p className="text-sm font-semibold text-gray-200">
                  {overview?.marketing_dataset?.total_records?.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">File Size</p>
                <p className="text-sm font-semibold text-gray-200">
                  {overview?.marketing_dataset?.file_size}
                </p>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                <p className="text-sm font-semibold text-gray-200 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {overview?.marketing_dataset?.last_updated}
                </p>
              </div>
              <div className="p-3 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Total Budget</p>
                <p className="text-sm font-semibold text-gray-200">
                  ${marketingStats.total_budget?.toLocaleString()}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Combined Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <GlassCard>
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-xs text-gray-500">Total Revenue</p>
                <p className="text-xl font-bold text-gray-200">
                  ${salesStats.total_revenue?.toLocaleString()}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-xs text-gray-500">Units Sold</p>
                <p className="text-xl font-bold text-gray-200">
                  {salesStats.total_units?.toLocaleString()}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-xs text-gray-500">Total Clicks</p>
                <p className="text-xl font-bold text-gray-200">
                  {marketingStats.total_clicks?.toLocaleString()}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-xs text-gray-500">Conversions</p>
                <p className="text-xl font-bold text-gray-200">
                  {marketingStats.total_conversions?.toLocaleString()}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('sales')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'sales'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                : 'bg-slate-800/30 text-gray-400 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Sales Data
          </button>
          <button
            onClick={() => setActiveTab('marketing')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'marketing'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-slate-800/30 text-gray-400 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Marketing Data
          </button>
        </div>

        {/* Data Columns */}
        <GlassCard className="mb-6" hover={false}>
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            {activeTab === 'sales' ? 'Sales' : 'Marketing'} Data Columns ({activeTab === 'sales' ? columns.sales.length : columns.marketing.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(activeTab === 'sales' ? columns.sales : columns.marketing).map((column, index) => (
              <motion.div
                key={column.field}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50"
              >
                <p className="text-sm font-semibold text-gray-200 mb-1">{column.name}</p>
                <p className="text-xs text-gray-500 mb-2">{column.type}</p>
                <p className="text-xs text-gray-400 font-mono bg-slate-900/50 px-2 py-1 rounded truncate">
                  {column.sample}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Sample Data Table */}
        <GlassCard hover={false}>
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            Sample {activeTab === 'sales' ? 'Sales' : 'Marketing'} Data (Latest 10 Records)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {activeTab === 'sales' ? (
                    <>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">ID</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Product</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Revenue</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Units</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Region</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Quarter</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Segment</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">ID</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Campaign</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Channel</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Budget</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Clicks</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Conversions</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Quarter</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {(activeTab === 'sales' ? salesData : marketingData).map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    {activeTab === 'sales' ? (
                      <>
                        <td className="py-3 px-4 text-sm text-gray-300 font-mono">{row.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.product}</td>
                        <td className="py-3 px-4 text-sm text-gray-300 font-semibold">${row.revenue?.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.units_sold}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.region}</td>
                        <td className="py-3 px-4 text-sm text-gray-400">{row.quarter}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.customer_segment}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-4 text-sm text-gray-300 font-mono">{row.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.campaign_name}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.channel}</td>
                        <td className="py-3 px-4 text-sm text-gray-300 font-semibold">${row.budget?.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.clicks?.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-300">{row.conversions?.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-400">{row.quarter}</td>
                      </>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Future Feature Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl"
        >
          <div className="flex items-start gap-4">
            <Upload className="w-6 h-6 text-purple-400 flex-shrink-0" />
            <div>
              <h4 className="text-lg font-semibold text-purple-300 mb-2">
                Dynamic Data Upload - Coming Soon!
              </h4>
              <p className="text-sm text-gray-400 mb-3">
                In the next update, you'll be able to:
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  Upload your own CSV/Excel files
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  Replace existing datasets
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  Schedule automatic data refreshes
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                  Manage multiple datasets
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}