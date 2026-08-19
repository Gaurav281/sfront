import React, { useState } from 'react';
import { Mail, Lock, User, Key, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function Signup({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [validationError, setValidationError] = useState('');
  const { signup, error, loading, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    const success = await signup(name, email, password);
    if (success) {
      onNavigate('home');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 select-none">
      <div className="bg-card-dark border border-zinc-700/80 p-8 rounded-2xl space-y-5 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-accent-green/5 border border-accent-green/10 flex items-center justify-center text-accent-green mx-auto">
            <Key className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider">Register Account</h2>
          <p className="text-zinc-500 text-xs">Create your buyer profile to start safe shopping</p>
        </div>

        {/* Local validation error or server error */}
        {(validationError || error) && (
          <div className="bg-red-950/40 border border-red-900/50 text-red-400 text-xs p-3.5 rounded-xl font-medium text-center animate-shake">
            {validationError || error}
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
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50"
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
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-10 pr-10 py-3 text-xs focus:outline-none focus:border-accent-green/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-white cursor-pointer"
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-400">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full bg-zinc-950 border border-zinc-800 text-white rounded-xl pl-10 pr-10 py-3 text-xs focus:outline-none focus:border-accent-green/50"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-white cursor-pointer"
                title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
        <p className="text-zinc-500 text-[11px] text-center font-semibold">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-accent-green hover:underline font-bold"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
