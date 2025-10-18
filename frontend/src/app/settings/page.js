'use client';

import { useState, useEffect } from 'react';
import { Mail, User, Bell, Save, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import GlassCard from '@/components/shared/GlassCard';
import AnimatedButton from '@/components/shared/AnimatedButton';
import Toast from '@/components/shared/Toast';
import { useToast } from '@/lib/hooks/useToast'; 
import { api } from '@/lib/api';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    recipient_email: '',
    user_name: '',
    notifications_enabled: true
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { toasts, showToast, hideToast } = useToast();
  const [errors, setErrors] = useState({});

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoadingData(true);
    try {
      const data = await api.getEmailSettings();
      if (data.ok && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      showToast('Failed to load settings', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSave = async () => {
    // Validate
    const newErrors = {};
    if (!settings.recipient_email) {
      newErrors.recipient_email = 'Email is required';
    } else if (!validateEmail(settings.recipient_email)) {
      newErrors.recipient_email = 'Invalid email format';
    }
    
    if (!settings.user_name) {
      newErrors.user_name = 'Name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const data = await api.updateEmailSettings(settings);
      if (data.ok) {
        showToast('Settings saved successfully!', 'success');
      } else {
        showToast('Failed to save settings', 'error');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      showToast('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset to default settings?')) {
      return;
    }

    setLoading(true);
    try {
      await api.resetEmailSettings();
      await loadSettings();
      showToast('Settings reset successfully', 'success');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      showToast('Failed to reset settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading settings...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Render all toasts */}
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 font-display">
            Email Settings
          </h1>
          <p className="text-gray-400">Configure where to receive your automated reports</p>
        </div>

        {/* Settings Form */}
        <GlassCard hover={false}>
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Mail className="w-4 h-4 text-purple-400" />
                Email Address
              </label>
              <input
                type="email"
                value={settings.recipient_email}
                onChange={(e) => setSettings({...settings, recipient_email: e.target.value})}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3 bg-slate-800/50 border ${
                  errors.recipient_email ? 'border-red-500' : 'border-slate-700'
                } rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
              />
              {errors.recipient_email && (
                <p className="text-red-400 text-sm mt-1">{errors.recipient_email}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Reports and charts will be sent to this email address
              </p>
            </div>

            {/* Name Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <User className="w-4 h-4 text-purple-400" />
                Your Name
              </label>
              <input
                type="text"
                value={settings.user_name}
                onChange={(e) => setSettings({...settings, user_name: e.target.value})}
                placeholder="John Doe"
                className={`w-full px-4 py-3 bg-slate-800/50 border ${
                  errors.user_name ? 'border-red-500' : 'border-slate-700'
                } rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
              />
              {errors.user_name && (
                <p className="text-red-400 text-sm mt-1">{errors.user_name}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                This name will be used in email greetings
              </p>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm font-medium text-gray-200">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive automated daily reports</p>
                </div>
              </div>
              <button
                onClick={() => setSettings({...settings, notifications_enabled: !settings.notifications_enabled})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications_enabled ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.notifications_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-700/50">
              <AnimatedButton
                onClick={handleSave}
                loading={loading}
                icon={Save}
                variant="primary"
                className="flex-1"
              >
                Save Settings
              </AnimatedButton>
              
              <AnimatedButton
                onClick={handleReset}
                disabled={loading}
                icon={RefreshCw}
                variant="secondary"
              >
                Reset
              </AnimatedButton>
            </div>
          </div>
        </GlassCard>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
        >
          <p className="text-sm text-blue-300 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Your email settings are saved securely and used only for sending automated reports
          </p>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}
