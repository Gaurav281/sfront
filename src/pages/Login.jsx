import React, { useState, useEffect } from 'react';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Login({ onNavigate }) {
  const { login, loading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      onNavigate('home');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 select-none">
      <div className="bg-card-dark border border-border-dark p-8 rounded-2xl space-y-6 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-accent-green/10 border border-accent-green/20 items-center justify-center text-accent-green mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">Login Account</h2>
          <p className="text-zinc-500 text-xs">Enter credentials to trade digital assets</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-400 text-xs p-3.5 rounded-xl font-medium text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-400">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-green hover:bg-accent-green-hover disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-zinc-500 text-[11px] text-center">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('signup')}
            className="text-accent-green hover:underline font-bold"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
