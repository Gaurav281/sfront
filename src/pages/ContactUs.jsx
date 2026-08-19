import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { Send, ShieldCheck, User, MessageSquare, Trash } from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAlertStore } from '../store/useAlertStore';

export default function ContactUs() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const showConfirm = useAlertStore((state) => state.showConfirm);
  const addToast = useAlertStore((state) => state.addToast);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const prevCountRef = useRef(0);

  // Tanstack Query to pull chat history
  const { data: messages, isLoading } = useQuery({
    queryKey: ['chatMessages', user?._id],
    queryFn: async () => {
      const res = await apiClient.get('/chat');
      return res.data;
    },
    enabled: !!user,
    refetchInterval: 4000, // Poll every 4 seconds for live replies
  });

  // Scroll to bottom WhatsApp style
  useEffect(() => {
    if (messages) {
      const prevCount = prevCountRef.current;
      prevCountRef.current = messages.length;
      if (prevCount === 0) {
        // Instant scroll on first load
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      } else {
        // Smooth scroll when new messages are added
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText) => {
      return await apiClient.post('/chat', { text: messageText });
    },
    onSuccess: () => {
      setText('');
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
    },
  });

  // Clear chat history mutation (deletes from both ends)
  const clearChatMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.delete('/chat/clear');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      addToast('Chat messages cleared successfully.', 'success');
    },
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessageMutation.mutate(text);
  };

  const handleClearChat = () => {
    showConfirm(
      'Clear Conversation',
      'Delete all messages in this thread from both ends? This cannot be undone.',
      () => clearChatMutation.mutate()
    );
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center select-none space-y-4">
        <div className="bg-card-dark border border-border-dark p-8 rounded-2xl space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-accent-green/10 border border-accent-green/20 flex items-center justify-center text-accent-green mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Live Support Chat</h2>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Please log in or sign up to chat with our active support desk. Only registered users can access live chat support history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-4 select-none space-y-4">
      
      {/* Page Header */}
      <div className="border-b border-border-dark pb-6 flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Support Chat</span>
            <span className="w-2 h-2 rounded-full bg-accent-green animate-ping"></span>
          </h1>
          <p className="text-zinc-500 text-xs mt-0.5 font-medium">
            Live support operator is active. Chat with us here regarding delivery handles or UPI payments.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-accent-green bg-accent-green/5 border border-accent-green/10 px-3.5 py-1.5 rounded-xl">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-extrabold tracking-wider">SAFE PAY HOLD SECURITY ACTIVE</span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div id="chat-box" className="bg-card-dark border border-zinc-700/80 rounded-2xl h-[460px] flex flex-col justify-between overflow-hidden shadow-xl">
        
        {/* Chat Header banner */}
        <div className="bg-zinc-950/60 px-6 py-4 border-b border-zinc-900 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-green/10 border border-accent-green/20 flex items-center justify-center font-bold text-accent-green text-xs animate-pulse">
              OP
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Support Desk Operators</h4>
              <span className="text-[9px] text-zinc-500 block font-medium">Typically replies in a few minutes</span>
            </div>
          </div>
          
          <button
            onClick={handleClearChat}
            disabled={clearChatMutation.isPending}
            className="text-[10px] text-red-500 hover:text-red-400 font-extrabold cursor-pointer transition-colors disabled:text-zinc-600"
          >
            Clear Chat
          </button>
        </div>

        {/* Scrollable messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-950/20 scrollbar-thin scrollbar-thumb-zinc-800">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-zinc-500 text-xs">
              Loading chat conversations...
            </div>
          ) : messages && messages.length > 0 ? (
            <>
              {messages.map((msg) => {
                const isMe = msg.sender === user._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3.5 rounded-2xl text-xs ${
                        isMe
                          ? 'bg-emerald-950/60 border border-emerald-800/40 text-emerald-100 rounded-tr-none'
                          : 'bg-zinc-900 border border-zinc-800/80 text-zinc-100 rounded-tl-none'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                      <span className="text-[8px] text-zinc-500 block mt-1.5 text-right font-medium">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-white text-xs">No Messages Yet</p>
                <p className="text-zinc-500 text-[10px] mt-1 max-w-xs leading-normal">
                  Ask us anything regarding order delivery, Safe Pay protection, or streaming upgrade keys here.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Text Input Footer */}
        <form onSubmit={handleSendMessage} className="p-4 bg-zinc-950/60 border-t border-zinc-900 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 bg-zinc-950 border border-border-dark text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent-green/50 font-medium"
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isPending || !text.trim()}
            className="p-2.5 rounded-xl bg-accent-green hover:bg-accent-green-hover text-black transition-all cursor-pointer flex items-center justify-center shrink-0 disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
