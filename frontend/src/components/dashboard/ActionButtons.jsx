'use client';

import { useState, useEffect } from 'react';
import { Zap, TrendingUp, BarChart3, FileText, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedButton from '../shared/AnimatedButton';
import { api } from '@/lib/api';

export default function ActionButtons({ onSuccess }) {
  const [loading, setLoading] = useState({});
  const [emailConfigured, setEmailConfigured] = useState(false);
  const [emailSettings, setEmailSettings] = useState(null);

  useEffect(() => {
    checkEmailSettings();
  }, []);

  const checkEmailSettings = async () => {
    try {
      const data = await api.getEmailSettings();
      if (data.ok && data.settings) {
        setEmailSettings(data.settings);
        setEmailConfigured(
          data.settings.notifications_enabled && 
          data.settings.recipient_email &&
          data.settings.recipient_email !== 'default@example.com'
        );
      }
    } catch (error) {
      console.error('Failed to check email settings:', error);
    }
  };

  const handleGenerate = async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const data = await api.generateReport(type);
      if (data.ok) {
        onSuccess(data.message, 'success');
        
        // Show email notification info for full report generation
        if (type === 'all' && emailConfigured) {
          setTimeout(() => {
            onSuccess(`📧 Report will be sent to ${emailSettings.recipient_email}!`, 'success');
          }, 2000);
        }
      } else {
        onSuccess('Failed to generate report', 'error');
      }
    } catch (error) {
      onSuccess('Network error occurred', 'error');
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const buttons = [
    {
      type: 'all',
      label: 'Generate All Reports',
      icon: Zap,
      variant: 'primary',
      className: 'col-span-2 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50'
    },
    { type: 'sales', label: 'Sales Report', icon: TrendingUp, variant: 'outline' },
    { type: 'marketing', label: 'Marketing Report', icon: BarChart3, variant: 'outline' },
    { type: 'summary', label: 'Summary Report', icon: FileText, variant: 'outline' },
  ];

  return (
    <>
      {/* Email Notification Banner */}
      {emailConfigured && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-300 mb-1">
                Email Notifications Enabled
              </p>
              <p className="text-xs text-green-400/80">
                Reports will be automatically sent to <strong>{emailSettings?.recipient_email}</strong>
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Email Not Configured Warning */}
      {!emailConfigured && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-300 mb-1">
                Email Not Configured
              </p>
              <p className="text-xs text-yellow-400/80">
                Configure your email in{' '}
                <a href="/settings" className="underline hover:text-yellow-300">
                  Settings
                </a>{' '}
                to receive reports automatically
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
      >
        {buttons.map((btn, index) => (
          <motion.div
            key={btn.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <AnimatedButton
              onClick={() => handleGenerate(btn.type)}
              loading={loading[btn.type]}
              variant={btn.variant}
              icon={btn.icon}
              className={`w-full ${btn.className || ''}`}
            >
              {btn.label}
            </AnimatedButton>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}