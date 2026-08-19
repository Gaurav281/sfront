import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Signup({ onNavigate }) {
  const { signup, loading, error, clearError } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    const res = await signup(name, email, password);
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
          <h2 className="text-2xl font-black text-white">Create Account</h2>
          <p className="text-zinc-500 text-xs">Sign up to buy premium digital products</p>
        </div>

        {/* Errors */}
        {(error || validationError) && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-400 text-xs p-3.5 rounded-xl font-medium text-center">
            {error || validationError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-400">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50"
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-400">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-green hover:bg-accent-green-hover disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer mt-2"
          >
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-zinc-500 text-[11px] text-center">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-accent-green hover:underline font-bold"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
