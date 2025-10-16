'use client';

import { MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MessageBubble({ message, index }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
            : 'bg-slate-800/50 text-gray-200 border border-slate-700/50'
        }`}
      >
        <div className="flex items-start gap-2">
          {!isUser && (
            <MessageSquare className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          )}
          {isUser && (
            <User className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
            <p className={`text-xs mt-1 ${isUser ? 'text-purple-200/70' : 'text-gray-500'}`}>
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}