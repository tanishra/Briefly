'use client';

import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../shared/GlassCard';
import AnimatedButton from '../shared/AnimatedButton';
import LoadingSpinner from '../shared/LoadingSpinner';
import MessageBubble from './MessageBubble';
import { api } from '@/lib/api';

export default function ChatInterface() {
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
    if (!query.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      // Replace with actual API call when backend is ready
      // const response = await api.askAI(query);
      
      // Simulated response
      setTimeout(() => {
        const aiMessage = {
          role: 'assistant',
          content: 'This feature is coming soon! The /ask endpoint will be integrated to provide intelligent answers about your reports and data. I\'ll be able to analyze trends, compare metrics, and provide actionable insights.',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
        setLoading(false);
      }, 1500);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  return (
    <GlassCard className="h-[600px] flex flex-col" hover={false}>
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scroll-smooth">
        {messages.map((message, index) => (
          <MessageBubble 
            key={index} 
            message={message} 
            index={index} 
          />
        ))}
        
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-slate-800/50 rounded-2xl px-4 py-3 flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-gray-400">Thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about sales trends, marketing metrics, or report summaries..."
          className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
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
  );
}
