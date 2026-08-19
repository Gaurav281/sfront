import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Lock, ShoppingBag, Edit, Check, ShieldCheck, Calendar, Info } from 'lucide-react';
import apiClient from '../api/apiClient';

export default function Profile() {
  const { user, updateUserProfileState } = useAuthStore();

  // Profile forms states
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
    onSuccess: (data) => {
      updateUserProfileState(data);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    },
    onError: (err) => {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
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
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    updateProfileMutation.mutate(
      { password },
      {
        onSuccess: () => {
          setPassword('');
          setConfirmPassword('');
          setPasswordSuccess(true);
          setTimeout(() => setPasswordSuccess(false), 3000);
        },
      }
    );
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
      <div className="border-b border-border-dark pb-4">
        <h1 className="text-2xl font-black text-white">My Account</h1>
        <p className="text-zinc-500 text-xs mt-0.5">Manage personal settings and check purchase histories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Forms column (Profile & Password settings) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Profile settings */}
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
                    className="w-full bg-zinc-950/60 border border-border-dark text-zinc-500 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none cursor-not-allowed select-none"
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
                <span className="text-[8px] text-zinc-500 block leading-normal pt-1">
                  Saved handle is automatically filled at checkout to complete handovers faster.
                </span>
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

          {/* Password Settings */}
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

        {/* Purchase history column - Card Format Layout */}
        <div id="profile-purchases" className="lg:col-span-7 bg-card-dark border border-border-dark p-6 rounded-2xl space-y-4 shadow-lg">
          <h3 className="text-white font-extrabold text-sm border-b border-zinc-900 pb-2 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-accent-green" />
            <span>My Purchase History</span>
          </h3>

          {ordersLoading ? (
            <div className="text-center py-8 text-zinc-500 text-xs">Loading orders...</div>
          ) : myOrders && myOrders.length > 0 ? (
            <div className="space-y-5 overflow-y-auto max-h-[640px] pr-2">
              {myOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl space-y-4 hover:border-zinc-800/80 transition-all hover:bg-zinc-900/10 shadow"
                >
                  {/* Card Header: Order Status & ID */}
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
                        className="bg-zinc-900/30 border border-zinc-900/60 px-4 py-3 rounded-xl flex justify-between items-center text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[8px] font-black text-accent-green bg-accent-green/5 border border-accent-green/10 px-1.5 py-0.5 rounded shrink-0">
                            {item.platform}
                          </span>
                          <span className="text-white font-bold truncate">{item.title}</span>
                        </div>
                        <span className="text-zinc-300 font-extrabold shrink-0 ml-4">${item.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card Footer: Metadata Specs details */}
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
                      <span className="text-accent-green font-black text-sm">${order.totalAmount}</span>
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

      </div>
    </div>
  );
}
