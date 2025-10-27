'use client';

import { useState, useEffect } from 'react';
import { Zap, TrendingUp, BarChart3, FileText, Mail, AlertCircle, Send, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AnimatedButton from '../shared/AnimatedButton';
import { api } from '@/lib/api';
import Toast from '../shared/Toast';

export default function ActionButtons() {
  const [loading, setLoading] = useState({});
  const [emailConfigured, setEmailConfigured] = useState(false);
  const [telegramConfigured, setTelegramConfigured] = useState(false); 
  const [emailSettings, setEmailSettings] = useState(null);
  const [telegramSettings, setTelegramSettings] = useState(null); 
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    checkEmailSettings();
    checkTelegramSettings(); 
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

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
      addToast('Failed to load email settings', 'error');
    }
  };

  const checkTelegramSettings = async () => {
    try {
      const data = await api.getTelegramSettings();
      if (data.ok && data.settings) {
        setTelegramSettings(data.settings);
        setTelegramConfigured(
          data.settings.notifications_enabled &&
          data.settings.phone_number &&
          data.settings.phone_number !== ''
        );
      }
    } catch (error) {
      console.error('Failed to check Telegram settings:', error);
      addToast('Failed to load Telegram settings', 'error');
    }
  };

  const handleGenerate = async (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const data = await api.generateReport(type);
      if (data.ok) {
        addToast(data.message, 'success');

        // Show email notification info for full report generation
        if (type === 'all' && emailConfigured) {
          setTimeout(() => {
            addToast(`📧 Report will be sent to ${emailSettings.recipient_email}!`, 'success');
          }, 2000);
        }
      } else {
        addToast('Failed to generate report', 'error');
      }
    } catch (error) {
      addToast('Network error occurred', 'error');
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSendEmail = async () => {
    if (!emailSettings) return;

    setLoading(prev => ({ ...prev, sendEmail: true }));
    try {
      const data = await api.sendEmailManually({
        recipient_email: emailSettings.recipient_email,
        user_name: emailSettings.user_name
      });

      if (data.ok) {
        addToast(`${data.message}`, 'success');
      } else {
        addToast(data.message || 'Failed to send email', 'error');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      addToast(`❌ Network error occurred: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, sendEmail: false }));
    }
  };

  const handleSendTelegram = async () => {
    if (!telegramConfigured) {
      addToast('Please configure Telegram first', 'error');
      return;
    }

    setLoading(prev => ({ ...prev, sendTelegram: true }));
    try {
      const data = await api.sendTelegramManually();

      if (data.ok) {
        addToast(`${data.message}`, 'success');
      } else {
        addToast(data.message || 'Failed to send Telegram message', 'error');
      }
    } catch (error) {
      console.error('Error sending to Telegram:', error);
      addToast(`❌ Network error occurred: ${error.message}`, 'error');
    } finally {
      setLoading(prev => ({ ...prev, sendTelegram: false }));
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
      {/* Toasts */}
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}

      {/* Email Notification Banner */}
      {emailConfigured && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex justify-between items-center"
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

          {/* Send Email Button */}
          <div className="ml-4">
            <AnimatedButton
              onClick={handleSendEmail}
              loading={loading.sendEmail}
              variant="primary"
              icon={Send}
              className="w-full sm:w-auto"
              disabled={!emailConfigured}
            >
              Send Email
            </AnimatedButton>
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

      {/* Telegram Notification Banner */}
      {telegramConfigured && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex justify-between items-center"
        >
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-300 mb-1">
                Telegram Notifications Enabled
              </p>
              <p className="text-xs text-green-400/80">
                Reports will be sent to <strong>{telegramSettings?.phone_number}</strong>
              </p>
            </div>
          </div>

          {/* Send Telegram Button */}
          <div className="ml-4">
            <AnimatedButton
              onClick={handleSendTelegram}
              loading={loading.sendTelegram}
              variant="primary"
              icon={Send}
              className="w-full sm:w-auto"
              disabled={!telegramConfigured}
            >
              Send Gram
            </AnimatedButton>
          </div>
        </motion.div>
      )}

      {/* Telegram Not Configured Warning */}
      {!telegramConfigured && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-300 mb-1">
                Telegram Not Configured
              </p>
              <p className="text-xs text-yellow-400/80">
                Configure your Telegram number in{' '}
                <a href="/settings" className="underline hover:text-yellow-300">
                  Settings
                </a>{' '}
                to receive messages automatically
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
