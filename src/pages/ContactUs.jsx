import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { Send, ShieldCheck, User, MessageSquare } from 'lucide-react';
import apiClient from '../api/apiClient';

export default function ContactUs() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  // Tanstack Query to pull chat history
  const { data: messages, isLoading } = useQuery({
    queryKey: ['chatMessages', user?._id],
    queryFn: async () => {
      const res = await apiClient.get('/chat');
      return res.data;
    },
    enabled: !!user,
    refetchInterval: 4000, // Poll every 4 seconds for live-like replies
  });

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages) {
      scrollToBottom();
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessageMutation.mutate(text);
  };

  // If user is logged out, show login prompt
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
    <div className="max-w-4xl mx-auto px-4 py-8 select-none space-y-6">
      
      {/* Page Header - localized wording */}
      <div className="border-b border-border-dark pb-6 flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Support Chat</span>
            <span className="w-2 h-2 rounded-full bg-accent-green animate-ping"></span>
          </h1>
          <p className="text-zinc-500 text-xs mt-0.5">
            Aapka queries yahan live answer kiya jayega. Chat here with our support operator.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-accent-green bg-accent-green/5 border border-accent-green/10 px-3.5 py-1.5 rounded-xl">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-extrabold tracking-wider">SAFE PAY LOCK PROTECTED</span>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-card-dark border border-border-dark rounded-2xl h-[550px] flex flex-col justify-between overflow-hidden shadow-xl">
        
        {/* Chat Header banner */}
        <div className="bg-zinc-950/60 px-6 py-4 border-b border-zinc-900 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent-green/10 border border-accent-green/20 flex items-center justify-center font-bold text-accent-green text-xs">
            OP
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">DigiVault Support Desk</h4>
            <span className="text-[9px] text-zinc-500 block">Typically replies in a few minutes</span>
          </div>
        </div>

        {/* Scrollable messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-950/20">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-zinc-500 text-xs">
              Loading previous conversations...
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
                          ? 'bg-accent-green/10 border border-accent-green/25 text-white rounded-tr-none'
                          : 'bg-zinc-900 border border-zinc-800 text-white rounded-tl-none'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      <span className="text-[8px] text-zinc-500 block mt-1.5 text-right">
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
                <p className="font-semibold text-white text-xs">No messages yet</p>
                <p className="text-zinc-500 text-[10px] mt-1 max-w-xs leading-normal">
                  Kuch poochna hai? Ask us anything regarding order delivery, Safe Pay protection, or custom digital packages here.
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
            className="flex-1 bg-zinc-950 border border-border-dark text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent-green/50"
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
