'use client';

import { useState, useEffect } from 'react';
import { BarChart3, ZoomIn, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../shared/GlassCard';
import AnimatedButton from '../shared/AnimatedButton';
import { API_BASE_URL } from '@/lib/constants';

export default function ChartsGrid({ charts }) {
  const [selectedChart, setSelectedChart] = useState(null);
  const [uniqueCharts, setUniqueCharts] = useState([]);
  const [downloading, setDownloading] = useState(null);

  // Remove duplicates based on filename
  useEffect(() => {
    if (charts && charts.length > 0) {
      const seen = new Set();
      const filtered = charts.filter(chart => {
        const isDuplicate = seen.has(chart.filename);
        seen.add(chart.filename);
        return !isDuplicate;
      });
      setUniqueCharts(filtered);
    } else {
      setUniqueCharts([]);
    }
  }, [charts]);

  const handleDownload = async (chart, e) => {
    if (e) e.stopPropagation();
    
    setDownloading(chart.filename);
    
    try {
      const imageUrl = `${API_BASE_URL}${chart.url}`;
      
      // Method 1: Try direct download first
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = chart.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('Download started:', chart.filename);
    } catch (error) {
      console.error('Download failed:', error);
      
      // Method 2: Fallback - open in new tab
      try {
        window.open(`${API_BASE_URL}${chart.url}`, '_blank');
      } catch (fallbackError) {
        alert('Failed to download chart. Please try right-click and "Save Image As"');
      }
    } finally {
      setTimeout(() => setDownloading(null), 1000);
    }
  };

  if (!uniqueCharts || uniqueCharts.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          AI-Generated Visualizations
        </h2>
        <GlassCard hover={false}>
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No visualizations available</p>
            <p className="text-sm text-gray-500 mt-1">Generate reports to see charts</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <>
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          AI-Generated Visualizations
          <span className="text-sm font-normal text-gray-500">({uniqueCharts.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {uniqueCharts.map((chart, index) => (
            <motion.div
              key={`${chart.filename}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <GlassCard className="group overflow-hidden">
                {/* Image Container */}
                <div 
                  className="relative overflow-hidden rounded-lg bg-slate-900/50 cursor-pointer"
                  onClick={() => setSelectedChart(chart)}
                >
                  <img
                    src={`${API_BASE_URL}${chart.url}`}
                    alt={chart.filename}
                    className="w-full h-48 object-contain transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Image failed to load:', chart.url);
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23334155" width="200" height="200"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <ZoomIn className="w-5 h-5" />
                      <span>View Full Size</span>
                    </div>
                  </div>
                </div>

                {/* Chart Info */}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-gray-300 truncate flex-1">
                    {chart.filename
                      .replace(/\.(png|jpg|jpeg)$/i, '')
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <button
                    onClick={(e) => handleDownload(chart, e)}
                    disabled={downloading === chart.filename}
                    className="p-2 hover:bg-purple-600/20 rounded-lg transition-colors group/btn disabled:opacity-50 disabled:cursor-wait"
                    title="Download chart"
                  >
                    {downloading === chart.filename ? (
                      <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Download className="w-4 h-4 text-gray-400 group-hover/btn:text-purple-400" />
                    )}
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {selectedChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedChart(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            style={{ margin: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-7xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4 px-4">
                <h3 className="text-xl font-semibold text-white">
                  {selectedChart.filename
                    .replace(/\.(png|jpg|jpeg)$/i, '')
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <div className="flex items-center gap-2">
                  <AnimatedButton
                    variant="secondary"
                    icon={Download}
                    onClick={(e) => handleDownload(selectedChart, e)}
                    loading={downloading === selectedChart.filename}
                    disabled={downloading === selectedChart.filename}
                  >
                    {downloading === selectedChart.filename ? 'Downloading...' : 'Download'}
                  </AnimatedButton>
                  <button
                    onClick={() => setSelectedChart(null)}
                    className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg transition-colors flex items-center gap-2 text-white"
                  >
                    <X className="w-5 h-5" />
                    <span className="hidden sm:inline">Close</span>
                  </button>
                </div>
              </div>

              {/* Modal Image */}
              <div className="flex-1 flex items-center justify-center bg-slate-900/50 rounded-2xl p-4 overflow-auto">
                <img
                  src={`${API_BASE_URL}${selectedChart.url}`}
                  alt={selectedChart.filename}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  style={{ maxHeight: 'calc(90vh - 100px)' }}
                  onError={(e) => {
                    console.error('Modal image failed to load:', selectedChart.url);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}



