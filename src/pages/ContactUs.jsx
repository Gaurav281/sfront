import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { Send, ShieldCheck, User, MessageSquare, Trash, ArrowLeft } from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAlertStore } from '../store/useAlertStore';

const AGENT_NAMES = [
  'Rahul (Support Help)',
  'Priya (Tech Assistant)',
  'Amit (Safe Pay Desk)',
  'Sneha (Handovers Specialist)',
  'Vikram (Accounts Desk)',
  'Deepa (Billing Help)'
];

const AGENT_AVATARS = [
  'RS', 'PI', 'AP', 'SR', 'VM', 'DN'
];

export default function ContactUs({ onNavigate }) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const showConfirm = useAlertStore((state) => state.showConfirm);
  const addToast = useAlertStore((state) => state.addToast);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const prevCountRef = useRef(0);

  // States to persist randomized agent info
  const [agentName, setAgentName] = useState('');
  const [agentAvatar, setAgentAvatar] = useState('');

  useEffect(() => {
    const randIdx = Math.floor(Math.random() * AGENT_NAMES.length);
    setAgentName(AGENT_NAMES[randIdx]);
    setAgentAvatar(AGENT_AVATARS[randIdx]);
  }, []);

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
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      } else {
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

  // Clear chat history mutation
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
      <div className="fixed inset-0 z-50 bg-[#070707] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-card-dark border border-zinc-700/80 p-8 rounded-2xl space-y-5 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-accent-green/5 border border-accent-green/10 flex items-center justify-center text-accent-green mx-auto">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Live Chat Access</h2>
          <p className="text-zinc-400 text-xs leading-relaxed font-semibold">
            Please login or sign up to message our support team. Live chat requires an active profile.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('login');
                else window.location.hash = '#/login';
              }}
              className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('signup');
                else window.location.hash = '#/signup';
              }}
              className="bg-accent-green hover:bg-accent-green-hover text-black font-black py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Sign Up
            </button>
          </div>
          <button
            onClick={() => {
              if (onNavigate) onNavigate('home');
              else window.location.hash = '#/home';
            }}
            className="text-zinc-500 hover:text-zinc-400 font-bold text-xs pt-1 block mx-auto cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-55 bg-zinc-950 flex flex-col justify-between overflow-hidden w-full h-[100dvh]"
      style={{ height: '100dvh', maxHeight: '100dvh' }}
    >
      
      {/* WhatsApp Native Style Header */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Back button arrow */}
          <button
            onClick={() => {
              if (onNavigate) onNavigate('home');
              else window.location.hash = '#/home';
            }}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
            title="Back to Shop"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5px]" />
          </button>

          {/* User Status / Avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-accent-green/10 border border-accent-green/20 flex items-center justify-center font-black text-accent-green text-xs">
              {agentAvatar || 'OP'}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-accent-green border-2 border-zinc-900 animate-pulse"></span>
          </div>

          <div>
            <h4 className="text-xs font-black text-white tracking-wide">
              {agentName || 'Support Agent'}
            </h4>
            <span className="text-[9px] text-accent-green block font-bold uppercase tracking-wider">
              Active Agent • Online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-[8px] text-accent-green bg-accent-green/5 border border-accent-green/10 px-2.5 py-1 rounded-lg">
            <ShieldCheck className="w-3 h-3" />
            <span className="font-extrabold tracking-wider uppercase">Safe Pay Verified</span>
          </div>
          
          <button
            onClick={handleClearChat}
            disabled={clearChatMutation.isPending}
            className="text-[10px] text-red-500 hover:text-red-400 font-extrabold cursor-pointer transition-colors bg-red-950/10 border border-red-950/20 px-3 py-1.5 rounded-xl disabled:text-zinc-600"
          >
            Clear Conversation
          </button>
        </div>
      </div>

      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-950 scrollbar-thin scrollbar-thumb-zinc-800 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-zinc-500 text-xs">
            Loading secure connection...
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="space-y-4 flex-1">
            {messages.map((msg) => {
              const isMe = msg.sender === user._id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-lg ${
                      isMe
                        ? 'bg-emerald-950/60 border border-emerald-800/40 text-emerald-100 rounded-tr-none'
                        : 'bg-zinc-900 border border-zinc-800/80 text-zinc-100 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                    <span className="text-[8px] text-zinc-500 block mt-1.5 text-right font-medium">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <MessageSquare className="w-6 h-6 text-accent-green" />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">Instant Operator Connected</p>
              <p className="text-zinc-500 text-[10px] mt-1 leading-normal font-semibold">
                Ask us regarding delivery times, streaming logins, or verification keys. Type your query below to get started.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input controls panel */}
      <div className="bg-zinc-900/90 border-t border-zinc-800 p-3 sm:p-4 shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message securely..."
            className="flex-1 bg-zinc-950 border border-zinc-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-accent-green/50 placeholder-zinc-500 font-medium"
          />
          <button
            type="submit"
            disabled={sendMessageMutation.isPending || !text.trim()}
            className="bg-accent-green hover:bg-accent-green-hover disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-bold p-3 rounded-xl transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 stroke-[2.5px]" />
          </button>
        </form>
      </div>

    </div>
  );
}
