import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Lock, ShoppingBag, Edit, Check, ShieldCheck, Calendar, Info, LogOut } from 'lucide-react';
import apiClient from '../api/apiClient';
import { useAlertStore } from '../store/useAlertStore';

export default function Profile() {
  const { user, updateUserProfileState, logout } = useAuthStore();
  const [activeSubTab, setActiveSubTab] = useState('settings'); // 'settings' or 'history'
  const addToast = useAlertStore((state) => state.addToast);

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
        <div className="bg-card-dark border border-border-dark p-8 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">Please Login</h2>
          <p className="text-zinc-500 text-xs">You must be logged in to access your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 select-none space-y-6">
      
      {/* Title */}
      <div className="border-b border-border-dark pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">My Account</h1>
          <p className="text-zinc-500 text-xs mt-0.5 font-medium">Manage settings and review transacted items validity</p>
        </div>
      </div>

      {/* Sub tabs navigation at the top */}
      <div className="flex gap-3 border-b border-zinc-900 pb-4">
        <button
          onClick={() => setActiveSubTab('settings')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            activeSubTab === 'settings'
              ? 'bg-zinc-900 text-accent-green border-accent-green/20'
              : 'bg-transparent text-zinc-400 border-transparent hover:text-white hover:border-zinc-800'
          }`}
        >
          Personal Settings
        </button>
        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            activeSubTab === 'history'
              ? 'bg-zinc-900 text-accent-green border-accent-green/20'
              : 'bg-transparent text-zinc-400 border-transparent hover:text-white hover:border-zinc-800'
          }`}
        >
          My Purchase History
        </button>
      </div>

      {/* Sub Tab panels */}
      <div>
        {activeSubTab === 'settings' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Profile Settings Form */}
            <div className="bg-card-dark border border-border-dark p-6 rounded-2xl space-y-4 shadow-lg">
              <h3 className="text-white font-extrabold text-sm border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-accent-green" />
                <span>Personal Details</span>
              </h3>

              {profileError && <p className="text-red-500 text-[10px]">{profileError}</p>}
              {profileSuccess && (
                <p className="text-accent-green text-[10px] bg-accent-green/5 border border-accent-green/10 p-2 rounded-lg flex items-center gap-1">
                  <Check className="w-3 h-3" /> Profile updated successfully!
                </p>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-600" />
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-zinc-950/60 border border-border-dark text-zinc-500 rounded-xl pl-10 pr-4 py-3 text-xs cursor-not-allowed select-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Telegram / Discord Handle</label>
                  <div className="relative">
                    <Edit className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={discordOrTelegram}
                      onChange={(e) => setDiscordOrTelegram(e.target.value)}
                      placeholder="e.g. @telegram_handle or DiscordName#1234"
                      className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full bg-accent-green hover:bg-accent-green-hover disabled:bg-zinc-800 text-black font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer"
                >
                  {updateProfileMutation.isPending ? 'Updating...' : 'Save Settings'}
                </button>
              </form>
            </div>

            {/* Password Reset Form */}
            <div className="bg-card-dark border border-border-dark p-6 rounded-2xl space-y-4 shadow-lg">
              <h3 className="text-white font-extrabold text-sm border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-accent-green" />
                <span>Change Password</span>
              </h3>

              {passwordError && <p className="text-red-500 text-[10px]">{passwordError}</p>}
              {passwordSuccess && (
                <p className="text-accent-green text-[10px] bg-accent-green/5 border border-accent-green/10 p-2 rounded-lg flex items-center gap-1">
                  <Check className="w-3 h-3" /> Password changed successfully!
                </p>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-accent-green/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-800 text-white font-bold text-xs py-3 rounded-xl transition-all border border-zinc-800 cursor-pointer"
                >
                  Reset Password
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Purchase History Card Layout Tab */
          <div id="profile-purchases" className="bg-card-dark border border-border-dark p-6 rounded-2xl space-y-4 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-white font-extrabold text-sm border-b border-zinc-900 pb-2 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-accent-green" />
              <span>My Purchase History</span>
            </h3>

            {ordersLoading ? (
              <div className="text-center py-10 text-zinc-500 text-xs">Loading orders...</div>
            ) : myOrders && myOrders.length > 0 ? (
              <div className="space-y-5 overflow-y-auto max-h-[640px] pr-2">
                {myOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl space-y-4 hover:border-zinc-800/80 transition-all hover:bg-zinc-900/10 shadow"
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
                          className="bg-zinc-900/30 border border-zinc-900/60 px-4 py-3 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-[8px] font-black text-accent-green bg-accent-green/5 border border-accent-green/10 px-1.5 py-0.5 rounded shrink-0">
                              {item.platform}
                            </span>
                            <span className="text-white font-bold truncate">{item.title}</span>
                          </div>
                          
                          {/* Validity Indicator */}
                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <span className="text-[10px] text-zinc-400 font-semibold border border-zinc-800/60 bg-zinc-950 px-2 py-0.5 rounded">
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
              <div className="text-center py-12 text-zinc-500 text-xs space-y-2">
                <p>You haven't transacted any assets yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout button at the very bottom of profile page */}
      <div className="pt-6 border-t border-zinc-900 flex justify-end">
        <button
          onClick={() => {
            logout();
            window.location.reload();
          }}
          className="px-6 py-2.5 bg-red-950/40 hover:bg-red-900/40 border border-red-900/50 text-red-400 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Account</span>
        </button>
      </div>

    </div>
  );
}
