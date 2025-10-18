'use client';

import { useState } from 'react';
import { Database, Upload, FileText, Calendar, Users, TrendingUp, Package, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import GlassCard from '@/components/shared/GlassCard';

export default function DatasetPage() {
  // Sample data - replace with actual data from your backend
  const [datasetInfo] = useState({
    name: "Sales & Marketing Dataset",
    lastUpdated: "2025-01-15",
    totalRecords: 15420,
    fileSize: "2.4 MB",
    format: "CSV",
    status: "active"
  });

  const [dataColumns] = useState([
    { name: "Order ID", type: "String", sample: "ORD-2024-001" },
    { name: "Customer Name", type: "String", sample: "John Doe" },
    { name: "Product", type: "String", sample: "Laptop Pro" },
    { name: "Quantity", type: "Integer", sample: "2" },
    { name: "Unit Price", type: "Float", sample: "$1,299.99" },
    { name: "Total Amount", type: "Float", sample: "$2,599.98" },
    { name: "Order Date", type: "Date", sample: "2024-10-15" },
    { name: "Region", type: "String", sample: "North America" },
    { name: "Status", type: "String", sample: "Completed" },
    { name: "Sales Rep", type: "String", sample: "Jane Smith" },
  ]);

  const [dataStats] = useState([
    { label: "Total Sales", value: "$3.2M", icon: TrendingUp, color: "text-green-400" },
    { label: "Total Orders", value: "15,420", icon: Package, color: "text-blue-400" },
    { label: "Total Customers", value: "8,234", icon: Users, color: "text-purple-400" },
    { label: "Avg Order Value", value: "$207.53", icon: TrendingUp, color: "text-cyan-400" },
  ]);

  const [sampleData] = useState([
    {
      orderId: "ORD-2024-001",
      customer: "John Doe",
      product: "Laptop Pro",
      quantity: 2,
      amount: "$2,599.98",
      date: "2024-10-15",
      region: "North America",
      status: "Completed"
    },
    {
      orderId: "ORD-2024-002",
      customer: "Jane Smith",
      product: "Wireless Mouse",
      quantity: 5,
      amount: "$149.95",
      date: "2024-10-14",
      region: "Europe",
      status: "Completed"
    },
    {
      orderId: "ORD-2024-003",
      customer: "Bob Johnson",
      product: "Monitor 4K",
      quantity: 1,
      amount: "$899.99",
      date: "2024-10-14",
      region: "Asia",
      status: "Processing"
    },
    {
      orderId: "ORD-2024-004",
      customer: "Alice Williams",
      product: "Keyboard Mechanical",
      quantity: 3,
      amount: "$449.97",
      date: "2024-10-13",
      region: "North America",
      status: "Completed"
    },
    {
      orderId: "ORD-2024-005",
      customer: "Charlie Brown",
      product: "Webcam HD",
      quantity: 2,
      amount: "$199.98",
      date: "2024-10-13",
      region: "Europe",
      status: "Shipped"
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 font-display">
            Dataset Overview
          </h1>
          <p className="text-gray-400">View the data being used for report generation</p>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-300 mb-1">
                Static Dataset (Development Mode)
              </p>
              <p className="text-xs text-blue-400/80">
                Currently using a fixed dataset for report generation. Dynamic data upload will be available in future updates.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dataset Info Card */}
        <GlassCard className="mb-6" hover={false}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-200">{datasetInfo.name}</h2>
                <p className="text-sm text-gray-500">Active dataset being used for reports</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-400 font-medium">
              {datasetInfo.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Last Updated</p>
              <p className="text-sm font-semibold text-gray-200 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {datasetInfo.lastUpdated}
              </p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Total Records</p>
              <p className="text-sm font-semibold text-gray-200 flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {datasetInfo.totalRecords.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">File Size</p>
              <p className="text-sm font-semibold text-gray-200">
                {datasetInfo.fileSize}
              </p>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Format</p>
              <p className="text-sm font-semibold text-gray-200">
                {datasetInfo.format}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {dataStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <GlassCard>
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-slate-800/50 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-200">{stat.value}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Data Columns */}
        <GlassCard className="mb-6" hover={false}>
          <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Data Columns ({dataColumns.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dataColumns.map((column, index) => (
              <motion.div
                key={column.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50"
              >
                <p className="text-sm font-semibold text-gray-200 mb-1">{column.name}</p>
                <p className="text-xs text-gray-500 mb-2">{column.type}</p>
                <p className="text-xs text-gray-400 font-mono bg-slate-900/50 px-2 py-1 rounded">
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
            Sample Data (Latest 5 Records)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Order ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Product</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Qty</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Region</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map((row, index) => (
                  <motion.tr
                    key={row.orderId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-300 font-mono">{row.orderId}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{row.customer}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{row.product}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{row.quantity}</td>
                    <td className="py-3 px-4 text-sm text-gray-300 font-semibold">{row.amount}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{row.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{row.region}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-lg ${
                        row.status === 'Completed' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : row.status === 'Processing'
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {row.status}
                      </span>
                    </td>
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
                  Connect to external databases
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