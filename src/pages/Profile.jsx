import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Lock, ShoppingBag, Edit, Check, ShieldCheck, Calendar, Info, LogOut, ArrowLeft, ShieldAlert } from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAlertStore } from '../store/useAlertStore';

export default function Profile() {
  const { user, updateUserProfileState, logout } = useAuthStore();
  const addToast = useAlertStore((state) => state.addToast);

  // Active section management: null (menu dashboard), 'settings', 'password', 'history'
  const [activeSection, setActiveSection] = useState(null);

  // Profile form states
  const [name, setName] = useState(user?.name || '');
  const [discordOrTelegram, setDiscordOrTelegram] = useState(user?.discordOrTelegram || '');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password reset states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Fetch purchase history
  const { data: myOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['myOrders', user?._id],
    queryFn: async () => {
      const res = await apiClient.get('/orders/my-orders');
      return res.data;
    },
    enabled: !!user,
  });

  // Profile Update mutation
  const updateProfileMutation = useMutation({
    pointerEvents: 'none',
    mutationFn: async (payload) => {
      const res = await apiClient.put('/auth/profile', payload);
      return res.data;
    },
    onSuccess: (data, variables) => {
      updateUserProfileState(data);
      if (!variables.password) {
        setProfileSuccess(true);
        addToast('Profile details updated successfully!', 'success');
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    },
    onError: (err) => {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setProfileError(msg);
      addToast(msg, 'error');
    },
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileError('');
    updateProfileMutation.mutate({ name, discordOrTelegram });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (password.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      addToast('New password must be at least 6 characters long', 'error');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      addToast('Passwords do not match', 'error');
      return;
    }

    updateProfileMutation.mutate(
      { password },
      {
        onSuccess: () => {
          setPassword('');
          setConfirmPassword('');
          setPasswordSuccess(true);
          addToast('Password changed successfully!', 'success');
          setTimeout(() => setPasswordSuccess(false), 3000);
        },
      }
    );
  };

  // Helper to determine item validity description
  const getItemValidity = (item) => {
    const title = item.title?.toLowerCase() || '';
    const cat = item.category?.toLowerCase() || '';

    if (title.includes('netflix') || title.includes('spotify') || title.includes('premium') || cat.includes('streaming')) {
      return '1 Year Premium Plan';
    }
    if (cat.includes('services') || cat.includes('design') || cat.includes('graphics')) {
      return '30-Day Service Guarantee';
    }
    return 'Lifetime Ownership Transfer';
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center select-none">
        <div className="bg-card-dark border border-zinc-700/80 p-8 rounded-2xl space-y-4 shadow-xl">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Login Required</h2>
          <p className="text-zinc-400 text-xs font-semibold">You must be logged in to view profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 select-none space-y-6 animate-fade-in">
      
      {/* Title */}
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-2xl font-black text-white uppercase tracking-wider">Account Dashboard</h1>
        <p className="text-zinc-500 text-xs mt-0.5 font-semibold">View settings, configure account passwords, and trace purchased keys</p>
      </div>

      {/* Render sub-views conditionally based on activeSection selection */}
      
      {activeSection === null ? (
        /* MENU DASHBOARD DISPLAY (Default startup view) */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card Trigger 1: Details Update */}
            <div
              onClick={() => setActiveSection('settings')}
              className="bg-[#0c0c0d] border border-zinc-800 hover:border-accent-green/60 p-6 rounded-2xl cursor-pointer group hover:bg-zinc-900/25 transition-all shadow-lg flex flex-col justify-between h-40 hover:scale-[1.01] duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-green/5 border border-accent-green/10 flex items-center justify-center text-accent-green group-hover:bg-accent-green/10 group-hover:border-accent-green/20 transition-all">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-white tracking-widest group-hover:text-accent-green transition-colors">
                  Personal Details
                </h3>
                <p className="text-zinc-500 text-[10px] mt-1 font-semibold">Configure full name and Telegram handles</p>
              </div>
            </div>

            {/* Card Trigger 2: Password Reset */}
            <div
              onClick={() => setActiveSection('password')}
              className="bg-[#0c0c0d] border border-zinc-800 hover:border-pink-500/60 p-6 rounded-2xl cursor-pointer group hover:bg-zinc-900/25 transition-all shadow-lg flex flex-col justify-between h-40 hover:scale-[1.01] duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/5 border border-pink-500/10 flex items-center justify-center text-pink-400 group-hover:bg-pink-500/10 group-hover:border-pink-500/20 transition-all">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-white tracking-widest group-hover:text-pink-400 transition-colors">
                  Password & Safety
                </h3>
                <p className="text-zinc-500 text-[10px] mt-1 font-semibold">Update security passwords and login access</p>
              </div>
            </div>

            {/* Card Trigger 3: Purchases history */}
            <div
              onClick={() => setActiveSection('history')}
              className="bg-[#0c0c0d] border border-zinc-800 hover:border-blue-400/60 p-6 rounded-2xl cursor-pointer group hover:bg-zinc-900/25 transition-all shadow-lg flex flex-col justify-between h-40 hover:scale-[1.01] duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-white tracking-widest group-hover:text-blue-400 transition-colors">
                  My Purchases
                </h3>
                <p className="text-zinc-500 text-[10px] mt-1 font-semibold">View purchase history and validity keys</p>
              </div>
            </div>

          </div>

          {/* Logout Trigger Card */}
          <div className="pt-6 border-t border-zinc-900 flex justify-end">
            <button
              onClick={() => {
                logout();
                window.location.reload();
              }}
              className="px-6 py-3 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-900/50 text-red-400 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-4 h-4 stroke-[2.5px]" />
              <span>Logout Account</span>
            </button>
          </div>
        </div>
      ) : (
        /* CONDITIONAL SUB-SECTIONS CONTAINER */
        <div className="space-y-6">
          {/* Global Back Link Button */}
          <div>
            <button
              onClick={() => setActiveSection(null)}
              className="flex items-center gap-2 text-xs font-black text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-850 px-4 py-2.5 rounded-xl cursor-pointer shadow"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Menu</span>
            </button>
          </div>

          {/* Sub Section 1: Settings Form */}
          {activeSection === 'settings' && (
            <div className="bg-[#0c0c0d] border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-xl max-w-lg mx-auto">
              <h3 className="text-white font-extrabold text-sm border-b border-zinc-900 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-accent-green" />
                <span>Personal Settings</span>
              </h3>

              {profileError && <p className="text-red-500 text-[10px] font-bold">{profileError}</p>}
              {profileSuccess && (
                <p className="text-accent-green text-[10px] bg-accent-green/5 border border-accent-green/10 p-2 rounded-lg flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3" /> Profile updated successfully!
                </p>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-650" />
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-zinc-950/60 border border-zinc-900 text-zinc-600 rounded-xl pl-10 pr-4 py-3 text-xs cursor-not-allowed select-none font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-550" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50 placeholder-zinc-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Telegram / Discord Handle</label>
                  <div className="relative">
                    <Edit className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-550" />
                    <input
                      type="text"
                      value={discordOrTelegram}
                      onChange={(e) => setDiscordOrTelegram(e.target.value)}
                      placeholder="e.g. @username or DiscordName#1234"
                      className="w-full bg-zinc-950 border border-zinc-850 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50 placeholder-zinc-500 font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full bg-accent-green hover:bg-accent-green-hover disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-black text-xs py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  {updateProfileMutation.isPending ? 'Saving details...' : 'Save Profile Settings'}
                </button>
              </form>
            </div>
          )}

          {/* Sub Section 2: Password Form */}
          {activeSection === 'password' && (
            <div className="bg-[#0c0c0d] border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-xl max-w-lg mx-auto">
              <h3 className="text-white font-extrabold text-sm border-b border-zinc-900 pb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-pink-500" />
                <span>Update Account Password</span>
              </h3>

              {passwordError && <p className="text-red-500 text-[10px] font-bold">{passwordError}</p>}
              {passwordSuccess && (
                <p className="text-accent-green text-[10px] bg-accent-green/5 border border-accent-green/10 p-2 rounded-lg flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3" /> Password changed successfully!
                </p>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-550" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-zinc-950 border border-zinc-855 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50 placeholder-zinc-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-550" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full bg-zinc-950 border border-zinc-855 text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50 placeholder-zinc-500 font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full bg-pink-650 hover:bg-pink-600 text-white font-black text-xs py-3.5 rounded-xl transition-all cursor-pointer shadow"
                >
                  {updateProfileMutation.isPending ? 'Updating...' : 'Save New Password'}
                </button>
              </form>
            </div>
          )}

          {/* Sub Section 3: Purchases history */}
          {activeSection === 'history' && (
            <div id="profile-purchases" className="bg-[#0c0c0d] border border-zinc-800 p-6 rounded-2xl space-y-4 shadow-xl max-w-3xl mx-auto">
              <h3 className="text-white font-extrabold text-sm border-b border-zinc-900 pb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-blue-400" />
                <span>Purchase History</span>
              </h3>

              {ordersLoading ? (
                <div className="text-center py-12 text-zinc-500 text-xs">Loading transaction records...</div>
              ) : myOrders && myOrders.length > 0 ? (
                <div className="space-y-5 overflow-y-auto max-h-[550px] pr-2">
                  {myOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl space-y-4 hover:border-zinc-800/80 transition-all shadow"
                    >
                      {/* Card Header: Order Status */}
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-green bg-accent-green/5 border border-accent-green/10 px-2.5 py-0.5 rounded-full">
                            Secure Safe Pay Hold
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-semibold">
                          ID: <span className="text-white">#{order._id?.substring(18).toUpperCase()}</span>
                        </div>
                      </div>

                      {/* Card Body: Purchased Assets List */}
                      <div className="space-y-2.5">
                        <p className="text-[9px] uppercase font-bold tracking-wider text-zinc-500">Purchased Assets</p>
                        {order.items?.map((item, index) => (
                          <div
                            key={index}
                            className="bg-zinc-900/30 border border-zinc-900/60 px-4 py-3 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-xs"
                          >
                            <div className="flex items-start gap-2 min-w-0 flex-wrap sm:flex-nowrap">
                              <span className="text-[8px] font-black text-accent-green bg-accent-green/5 border border-accent-green/10 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                                {item.platform}
                              </span>
                              <span className="text-white font-bold break-words whitespace-normal leading-normal">{item.title}</span>
                            </div>
                            
                            {/* Validity Indicator */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap shrink-0 mt-1 sm:mt-0">
                              <span className="text-[10px] text-zinc-400 font-semibold border border-zinc-800/60 bg-zinc-950 px-2 py-0.5 rounded whitespace-nowrap">
                                Validity: {getItemValidity(item)}
                              </span>
                              <span className="text-zinc-300 font-extrabold shrink-0">₹{item.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Card Footer: Metadata Details */}
                      <div className="bg-zinc-900/10 border border-zinc-900/30 p-3.5 rounded-xl space-y-2 text-[10px] text-zinc-400">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Date:</span>
                          </span>
                          <span className="text-zinc-300 font-semibold">
                            {new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Delivery Handle:</span>
                          </span>
                          <span className="text-white font-bold">{order.billingDetails?.discordOrTelegram}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="flex items-center gap-1">
                            <Info className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Payment Method:</span>
                          </span>
                          <span className="text-zinc-300 truncate max-w-[200px]" title={order.billingDetails?.paymentMethod}>
                            {order.billingDetails?.paymentMethod}
                          </span>
                        </div>

                        <div className="border-t border-zinc-900 pt-2.5 mt-2.5 flex justify-between items-center text-xs">
                          <span className="font-bold text-white uppercase tracking-wider">Total Paid</span>
                          <span className="text-accent-green font-black text-sm">₹{order.totalAmount}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-zinc-500 text-xs space-y-2 font-semibold">
                  <p>You have not made any purchases yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
