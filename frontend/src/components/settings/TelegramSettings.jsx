'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Phone, Bell, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../shared/GlassCard';
import AnimatedButton from '../shared/AnimatedButton';
import LoadingSpinner from '../shared/LoadingSpinner';
import { API_BASE_URL } from '@/lib/constants';

export default function TelegramSettings({ onSuccess }) {
  const [settings, setSettings] = useState({
    phone_number: '',
    chat_id: '',
    notifications_enabled: true
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoadingData(true);
    try {
      const response = await fetch(`${API_BASE_URL}/telegram/settings`);
      const data = await response.json();
      
      if (data.ok && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to load telegram settings:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const validatePhoneNumber = (phone) => {
    // Basic validation - should start with + and contain only digits
    const re = /^\+?\d{10,15}$/;
    return re.test(phone.replace(/\s/g, ''));
  };

  const handleSave = async () => {
    // Validate
    const newErrors = {};
    
    if (!settings.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!validatePhoneNumber(settings.phone_number)) {
      newErrors.phone_number = 'Invalid phone number format (use +1234567890)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      onSuccess('Please fix the errors', 'error');
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/telegram/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.ok) {
        onSuccess('✅ Telegram settings saved successfully!', 'success');
        await loadSettings();
      } else {
        onSuccess(data.message || 'Failed to save settings', 'error');
      }
    } catch (error) {
      console.error('Failed to save telegram settings:', error);
      onSuccess('Failed to save telegram settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isConfigured = settings.phone_number && settings.phone_number !== '';

  return (
    <GlassCard hover={false} className="mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-200">Telegram Settings</h2>
          <p className="text-sm text-gray-500">Configure Telegram notifications</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Phone Number Input */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Phone className="w-4 h-4 text-green-400" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={settings.phone_number}
            onChange={(e) => {
              setSettings({...settings, phone_number: e.target.value});
              setErrors({...errors, phone_number: ''});
            }}
            placeholder="+1234567890"
            className={`w-full px-4 py-3 bg-slate-800/50 border ${
              errors.phone_number ? 'border-red-500' : 'border-slate-700'
            } rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all`}
          />
          {errors.phone_number && (
            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.phone_number}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Enter your Telegram phone number with country code (e.g., +1234567890)
          </p>
        </div>

        {/* Chat ID (Optional) */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <MessageCircle className="w-4 h-4 text-green-400" />
            Chat ID (Optional)
          </label>
          <input
            type="text"
            value={settings.chat_id || ''}
            onChange={(e) => setSettings({...settings, chat_id: e.target.value})}
            placeholder="123456789"
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional: Specific Telegram chat ID to send messages to
          </p>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-sm font-medium text-gray-200">Telegram Notifications</p>
              <p className="text-xs text-gray-500">Enable/disable Telegram alerts</p>
            </div>
          </div>
          <button
            onClick={() => setSettings({...settings, notifications_enabled: !settings.notifications_enabled})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              settings.notifications_enabled ? 'bg-green-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.notifications_enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Current Settings Display */}
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <p className="text-xs text-green-300 mb-2 font-medium">Current Telegram Settings:</p>
          <div className="space-y-1 text-xs text-green-200/80">
            <p>📱 Phone: <strong>{settings.phone_number || 'Not set'}</strong></p>
            <p>💬 Chat ID: <strong>{settings.chat_id || 'Not set'}</strong></p>
            <p>🔔 Notifications: <strong>{settings.notifications_enabled ? 'Enabled' : 'Disabled'}</strong></p>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-700/50">
          <AnimatedButton
            onClick={handleSave}
            loading={loading}
            icon={Save}
            variant="primary"
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500"
          >
            Save Telegram Settings
          </AnimatedButton>
        </div>
      </div>

      {/* Success Indicator */}
      {isConfigured && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <p className="text-xs text-green-300">
              Telegram configured for {settings.phone_number}
            </p>
          </div>
        </motion.div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-300">
          <p className="font-medium mb-1">How to use:</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-400/80">
            <li>Enter your Telegram phone number with country code</li>
            <li>Save settings</li>
            <li>Use "Send to Telegram" button on dashboard to send reports</li>
          </ol>
        </div>
      </div>
    </GlassCard>
  );
}