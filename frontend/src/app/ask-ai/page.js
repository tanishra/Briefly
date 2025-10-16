'use client';

import { useState } from 'react';
import { Send, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import GlassCard from '@/components/shared/GlassCard';
import AnimatedButton from '@/components/shared/AnimatedButton';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function AskAIPage() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant for report analysis. Ask me anything about your sales, marketing data, or generated reports!',
      timestamp: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = {
      role: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    // Simulate API call (replace with actual API when ready)
    setTimeout(() => {
      const aiMessage = {
        role: 'assistant',
        content: 'This feature is coming soon! The /ask endpoint will be integrated to provide intelligent answers about your reports and data.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-2 bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-sm font-semibold text-purple-300 tracking-wider uppercase">
              AI Assistant
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Ask AI Anything</h1>
          <p className="text-gray-400">Get insights about your reports and business data</p>
        </div>

        {/* Chat Container */}
        <GlassCard className="h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-slate-800/50 text-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <MessageSquare className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/50 rounded-2xl px-4 py-3">
                  <LoadingSpinner size="sm" />
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about sales trends, marketing metrics, or report summaries..."
              className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              disabled={loading}
            />
            <AnimatedButton
              type="submit"
              variant="primary"
              icon={Send}
              loading={loading}
              disabled={!query.trim() || loading}
            >
              Send
            </AnimatedButton>
          </form>
        </GlassCard>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl"
        >
          <p className="text-sm text-blue-300 text-center">
            💡 This feature is ready for integration with the <code className="bg-slate-800 px-2 py-1 rounded">/ask</code> endpoint
          </p>
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}