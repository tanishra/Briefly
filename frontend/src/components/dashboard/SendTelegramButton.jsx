'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedButton from '../shared/AnimatedButton';
import GlassCard from '../shared/GlassCard';
import { api } from '@/lib/api';

export default function SendTelegramButton({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadPreview();
  }, []);

  const loadPreview = async () => {
    try {
      const data = await api.previewTelegram();
      if (data.ok) {
        setPreview(data);
      }
    } catch (error) {
      console.error('Failed to load telegram preview:', error);
    }
  };

  const handleSendTelegram = async () => {
    if (!preview?.ready_to_send) {
      onSuccess('Please generate reports and configure Telegram first!', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await api.sendTelegramManually();
      
      if (data.ok) {
        onSuccess(`${data.message}`, 'success');
        await loadPreview();
      } else {
        onSuccess(data.message, 'error');
      }
    } catch (error) {
      onSuccess('Failed to send to Telegram. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isReady = preview?.ready_to_send && preview?.notifications_enabled;
  const hasPhone = preview?.phone_number && preview.phone_number !== '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="mb-12"
    >
      <GlassCard hover={false}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200">
                  Send to Telegram
                </h3>
                <p className="text-sm text-gray-500">
                  Send reports to your Telegram
                </p>
              </div>
            </div>

            {/* Preview Info */}
            {preview && (
              <div className="ml-15 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Phone:</span>
                  <span className={`font-medium ${hasPhone ? 'text-green-400' : 'text-yellow-400'}`}>
                    {hasPhone ? preview.phone_number : 'Not configured'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Reports available:</span>
                  <span className={`font-medium ${preview.reports?.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {preview.reports?.length || 0} files
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Charts available:</span>
                  <span className={`font-medium ${preview.charts?.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {preview.charts?.length || 0} images
                  </span>
                </div>

                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-green-400 hover:text-green-300 transition-colors mt-2"
                >
                  {showPreview ? '▼ Hide details' : '▶ Show details'}
                </button>

                {/* Expandable Preview */}
                <AnimatePresence>
                  {showPreview && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3 bg-slate-800/30 rounded-lg"
                    >
                      {preview.reports?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Reports to send:</p>
                          <ul className="space-y-1">
                            {preview.reports.map((report, idx) => (
                              <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                                {report}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {preview.charts?.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Charts to send:</p>
                          <ul className="space-y-1">
                            {preview.charts.map((chart, idx) => (
                              <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                                {chart}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Warnings */}
            {!hasPhone && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-300">
                  <p className="font-medium mb-1">Telegram not configured</p>
                  <p className="text-yellow-400/80">
                    Please set up your phone number in{' '}
                    <a href="/settings" className="underline hover:text-yellow-300">
                      Settings
                    </a>
                  </p>
                </div>
              </div>
            )}

            {hasPhone && (!preview?.reports?.length || !preview?.charts?.length) && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-300">
                  <p className="font-medium mb-1">No reports to send</p>
                  <p className="text-yellow-400/80">
                    Generate reports first using the buttons above
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Send Button */}
          <div className="ml-4">
            <AnimatedButton
              onClick={handleSendTelegram}
              loading={loading}
              disabled={!isReady || loading}
              variant={isReady ? "primary" : "secondary"}
              icon={Send}
              className={isReady ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500" : ""}
            >
              Send to Telegram
            </AnimatedButton>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}