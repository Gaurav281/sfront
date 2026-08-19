import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldCheck, Plus, Trash2, Edit2, TrendingUp, Users, ShoppingCart, MessageCircle, PlusCircle, Send, Check } from 'lucide-react';
import apiClient from '../api/apiClient';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  // Navigation states
  const [activeTab, setActiveTab] = useState('overview');
  const [editingListing, setEditingListing] = useState(null);
  
  // Selected user chat state
  const [selectedChatUserId, setSelectedChatUserId] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const chatEndRef = useRef(null);

  // Form states for adding/editing a listing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Instagram Accounts');
  const [platform, setPlatform] = useState('Instagram');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('0'); // Discount percentage
  const [sellerInfo, setSellerInfo] = useState('Verified Reseller');
  
  // Specs form states
  const [followers, setFollowers] = useState('');
  const [niche, setNiche] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('24 Hours');
  const [domainAuthority, setDomainAuthority] = useState('');
  const [age, setAge] = useState('');
  const [revisionCount, setRevisionCount] = useState('');
  const [monetized, setMonetized] = useState(false);
  const [status, setStatus] = useState('available');

  const categories = [
    'Instagram Accounts',
    'YouTube Channels',
    'TikTok Accounts',
    'Streaming Accounts',
    'SEO Services',
    'Graphics & Design',
  ];

  // Access check
  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center select-none">
        <div className="bg-card-dark border border-border-dark p-8 rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-950/40 border border-red-900/50 flex items-center justify-center text-red-500 mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-zinc-500 text-xs leading-normal">
            This dashboard is only accessible to authorized administrator accounts.
          </p>
        </div>
      </div>
    );
  }

  // React Queries to pull admin data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/stats');
      return res.data;
    },
  });

  const { data: listings, isLoading: listingsLoading } = useQuery({
    queryKey: ['adminListings'],
    queryFn: async () => {
      const res = await apiClient.get('/listings?all=true');
      return res.data;
    },
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/orders');
      return res.data;
    },
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/users');
      return res.data;
    },
  });

  // Query: get chat user list (those who chatted)
  const { data: chatUsers, isLoading: chatUsersLoading } = useQuery({
    queryKey: ['adminChatUsers'],
    queryFn: async () => {
      const res = await apiClient.get('/chat/admin/users');
      return res.data;
    },
    refetchInterval: 6000, // Refresh unread count bubbles
  });

  // Query: get selected user chat history
  const { data: selectedMessages, isLoading: messagesLoading } = useQuery({
    queryKey: ['adminSelectedMessages', selectedChatUserId],
    queryFn: async () => {
      const res = await apiClient.get(`/chat/admin/messages/${selectedChatUserId}`);
      // Invalidate count of unread when opening
      queryClient.invalidateQueries({ queryKey: ['adminChatUsers'] });
      return res.data;
    },
    enabled: !!selectedChatUserId,
    refetchInterval: 4000, // Poll for user replies
  });

  // Scroll support chat to bottom
  useEffect(() => {
    if (selectedMessages) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedMessages]);

  // Mutations
  const createListingMutation = useMutation({
    mutationFn: async (payload) => {
      return await apiClient.post('/listings', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminListings'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['recentListings'] });
      resetForm();
    },
  });

  const updateListingMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      return await apiClient.put(`/listings/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminListings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['recentListings'] });
      setEditingListing(null);
      resetForm();
    },
  });

  const deleteListingMutation = useMutation({
    mutationFn: async (id) => {
      return await apiClient.delete(`/listings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminListings'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['recentListings'] });
    },
  });

  // Admin reply chat mutation
  const sendReplyMutation = useMutation({
    mutationFn: async ({ userId, text }) => {
      return await apiClient.post(`/chat/admin/messages/${userId}`, { text });
    },
    onSuccess: () => {
      setAdminReplyText('');
      queryClient.invalidateQueries({ queryKey: ['adminSelectedMessages', selectedChatUserId] });
      queryClient.invalidateQueries({ queryKey: ['adminChatUsers'] });
    },
  });

  const handleAdminReplySubmit = (e) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedChatUserId) return;
    sendReplyMutation.mutate({ userId: selectedChatUserId, text: adminReplyText });
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Instagram Accounts');
    setPlatform('Instagram');
    setPrice('');
    setDiscount('0');
    setSellerInfo('Verified Reseller');
    setFollowers('');
    setNiche('');
    setDeliveryTime('24 Hours');
    setDomainAuthority('');
    setAge('');
    setRevisionCount('');
    setMonetized(false);
    setStatus('available');
  };

  const handleEditClick = (listing) => {
    setEditingListing(listing);
    setTitle(listing.title);
    setDescription(listing.description);
    setCategory(listing.category);
    setPlatform(listing.platform);
    setPrice(listing.price);
    setDiscount(listing.discount?.toString() || '0');
    setSellerInfo(listing.sellerInfo || 'Verified Reseller');
    setStatus(listing.status || 'available');
    
    // Specs
    setFollowers(listing.specs?.followers || '');
    setNiche(listing.specs?.niche || '');
    setDeliveryTime(listing.specs?.deliveryTime || '24 Hours');
    setDomainAuthority(listing.specs?.domainAuthority || '');
    setAge(listing.specs?.age || '');
    setRevisionCount(listing.specs?.revisionCount || '');
    setMonetized(listing.specs?.monetized || false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const specsPayload = {
      followers,
      niche,
      deliveryTime,
      domainAuthority,
      age,
      revisionCount,
      monetized,
    };

    const listingPayload = {
      title,
      description,
      category,
      platform,
      price: Number(price),
      discount: Number(discount),
      sellerInfo,
      specs: specsPayload,
      status,
    };

    if (editingListing) {
      updateListingMutation.mutate({ id: editingListing._id, payload: listingPayload });
    } else {
      createListingMutation.mutate(listingPayload);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      deleteListingMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 select-none space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b border-border-dark pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Admin Control Panel</h1>
          <p className="text-zinc-500 text-xs mt-0.5">Manage users, listings, orders, and support chats</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-accent-green bg-accent-green/5 border border-accent-green/10 px-3.5 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
          <span className="font-extrabold tracking-wider">ROOT ACCESS</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-zinc-900 pb-2 scrollbar-none">
        {[
          { id: 'overview', name: 'Overview' },
          { id: 'listings', name: 'Manage Listings' },
          { id: 'orders', name: 'Transacted Orders' },
          { id: 'chat', name: 'Chat Support' },
          { id: 'users', name: 'System Users' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setEditingListing(null);
              resetForm();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-zinc-900 text-accent-green border-accent-green/20'
                : 'bg-transparent text-zinc-400 border-transparent hover:text-white hover:border-zinc-800'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {/* Tab 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {statsLoading ? (
              <div className="text-center py-10 text-zinc-500 text-xs">Loading analytics...</div>
            ) : stats ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-card-dark border border-border-dark p-5 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-accent-green flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Total Sales</span>
                    <span className="text-lg font-black text-white">${stats.totalSales}</span>
                  </div>
                </div>

                <div className="bg-card-dark border border-border-dark p-5 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Orders</span>
                    <span className="text-lg font-bold text-white">{stats.totalOrders}</span>
                  </div>
                </div>

                <div className="bg-card-dark border border-border-dark p-5 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Listings</span>
                    <span className="text-lg font-bold text-white">{stats.totalListings}</span>
                  </div>
                </div>

                <div className="bg-card-dark border border-border-dark p-5 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Support Chats</span>
                    <span className="text-lg font-bold text-white">{stats.totalInquiries}</span>
                  </div>
                </div>

                <div className="bg-card-dark border border-border-dark p-5 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block">Users</span>
                    <span className="text-lg font-bold text-white">{stats.totalUsers}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500 text-xs">Error loading stats.</div>
            )}
            
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">Manual Handovers Guidelines</h4>
                <p className="text-zinc-500 text-xs">
                  Review the Transacted Orders tab to check buyers' Telegram/Discord handles. Coordinate deliveries securely.
                </p>
              </div>
              <span className="bg-emerald-500/10 text-accent-green border border-emerald-500/20 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                System Active
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: LISTINGS CRUD WITH DISCOUNTS */}
        {activeTab === 'listings' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form */}
            <div className="lg:col-span-5 bg-card-dark border border-border-dark p-6 rounded-2xl space-y-4">
              <h3 className="text-white font-extrabold text-sm border-b border-zinc-900 pb-2">
                {editingListing ? 'Edit Listing Item' : 'Add New Listing Item'}
              </h3>
              
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Listing Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Approved Cooking Page (12K)"
                    className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent-green/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Platform/Service</label>
                    <input
                      type="text"
                      required
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      placeholder="e.g. Instagram, Netflix"
                      className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Price ($)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="99"
                      className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  {/* Discount input */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Discount (%)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  {/* Seller tag */}
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Seller Tag</label>
                    <input
                      type="text"
                      value={sellerInfo}
                      onChange={(e) => setSellerInfo(e.target.value)}
                      className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Specs */}
                <div className="bg-zinc-950/60 border border-zinc-900 p-4 rounded-xl space-y-3">
                  <h4 className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-900 pb-1">
                    Specs Details
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-wider text-zinc-500 block">Followers/Subs</label>
                      <input
                        type="text"
                        value={followers}
                        onChange={(e) => setFollowers(e.target.value)}
                        placeholder="e.g. 15K"
                        className="w-full bg-zinc-950 border border-zinc-900 text-white rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-wider text-zinc-500 block">Niche</label>
                      <input
                        type="text"
                        value={niche}
                        onChange={(e) => setNiche(e.target.value)}
                        placeholder="e.g. Gaming"
                        className="w-full bg-zinc-950 border border-zinc-900 text-white rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-wider text-zinc-500 block">Delivery</label>
                      <input
                        type="text"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-900 text-white rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-wider text-zinc-500 block">DA / Authority</label>
                      <input
                        type="text"
                        value={domainAuthority}
                        onChange={(e) => setDomainAuthority(e.target.value)}
                        placeholder="e.g. DA 50+"
                        className="w-full bg-zinc-950 border border-zinc-900 text-white rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-wider text-zinc-500 block">Asset Age</label>
                      <input
                        type="text"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 2 Years"
                        className="w-full bg-zinc-950 border border-zinc-900 text-white rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase tracking-wider text-zinc-500 block">Revisions</label>
                      <input
                        type="text"
                        value={revisionCount}
                        onChange={(e) => setRevisionCount(e.target.value)}
                        placeholder="e.g. 3 Revisions"
                        className="w-full bg-zinc-950 border border-zinc-900 text-white rounded-lg px-2.5 py-1.5 text-[10px] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="monetized"
                      checked={monetized}
                      onChange={(e) => setMonetized(e.target.checked)}
                      className="accent-accent-green"
                    />
                    <label htmlFor="monetized" className="text-[9px] uppercase tracking-wider text-zinc-400 cursor-pointer">
                      Monetization Approved / Active Adsense
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Description</label>
                  <textarea
                    rows="3"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed description..."
                    className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none resize-none"
                  />
                </div>

                {editingListing && (
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Availability</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                    >
                      <option value="available">Available (Active in Shop)</option>
                      <option value="sold">Sold (Hidden / Complete)</option>
                    </select>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {editingListing && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingListing(null);
                        resetForm();
                      }}
                      className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold py-2.5 rounded-xl border border-zinc-800"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={createListingMutation.isPending || updateListingMutation.isPending}
                    className="flex-[2] bg-accent-green hover:bg-accent-green-hover disabled:bg-zinc-800 text-black font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    {createListingMutation.isPending || updateListingMutation.isPending ? (
                      <span>Saving...</span>
                    ) : editingListing ? (
                      <span>Save Changes</span>
                    ) : (
                      <span>Publish Listing</span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-7 bg-card-dark border border-border-dark p-6 rounded-2xl space-y-4">
              <h3 className="text-white font-extrabold text-sm border-b border-zinc-900 pb-2">
                Catalog Items Lists
              </h3>

              {listingsLoading ? (
                <div className="text-center py-10 text-zinc-500 text-xs">Loading items...</div>
              ) : listings && listings.length > 0 ? (
                <div className="overflow-y-auto max-h-[550px] space-y-3.5 pr-2">
                  {listings.map((item) => (
                    <div
                      key={item._id}
                      className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[8px] font-bold text-accent-green bg-accent-green/5 border border-accent-green/10 px-1.5 py-0.5 rounded">
                            {item.platform}
                          </span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                            item.status === 'available'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                          {item.discount > 0 && (
                            <span className="text-[8px] font-bold bg-accent-green/10 text-accent-green px-1.5 py-0.5 rounded border border-accent-green/20">
                              {item.discount}% OFF
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-white mt-2 truncate">{item.title}</h4>
                        <span className="text-[10px] text-zinc-500 block">{item.category}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          {item.discount > 0 && (
                            <span className="text-[9px] text-zinc-500 line-through block">
                              ${item.price}
                            </span>
                          )}
                          <span className="text-xs font-bold text-white">
                            ${item.discount > 0 ? Math.round(item.price - (item.price * item.discount) / 100) : item.price}
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item._id)}
                            className="p-2 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500 text-xs">No listings found.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: TRANSACTED ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-card-dark border border-border-dark p-6 rounded-2xl space-y-4">
            <h3 className="text-white font-extrabold text-sm border-b border-zinc-900 pb-2">
              Orders History
            </h3>

            {ordersLoading ? (
              <div className="text-center py-10 text-zinc-500 text-xs">Loading orders...</div>
            ) : orders && orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                      <th className="py-3 px-4">Order ID / Date</th>
                      <th className="py-3 px-4">Customer Details</th>
                      <th className="py-3 px-4">Telegram / Discord</th>
                      <th className="py-3 px-4">Transacted Items</th>
                      <th className="py-3 px-4 text-right">Total Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-zinc-900/10">
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-bold text-white block">#{order._id?.substring(18).toUpperCase()}</span>
                          <span className="text-[10px] text-zinc-500 block">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-white block">{order.billingDetails?.fullName}</span>
                          <span className="text-[10px] text-zinc-500 block">{order.email}</span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="text-accent-green font-bold bg-accent-green/5 border border-accent-green/10 px-2 py-0.5 rounded text-[10px]">
                            {order.billingDetails?.discordOrTelegram}
                          </span>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          {order.items?.map((item, index) => (
                            <div key={index} className="text-[10px] truncate text-zinc-400">
                              • {item.title} (${item.price})
                            </div>
                          ))}
                        </td>
                        <td className="py-4 px-4 text-right font-bold text-white whitespace-nowrap">
                          ${order.totalAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500 text-xs">No orders.</div>
            )}
          </div>
        )}

        {/* Tab 4: CHAT SUPPORT SYSTEM (Interactive User List and Messages Frame) */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-card-dark border border-border-dark rounded-2xl overflow-hidden h-[600px] shadow-xl">
            
            {/* Left Pane: Inbox Users List */}
            <div className="md:col-span-4 border-r border-zinc-900 flex flex-col h-full bg-zinc-950/20">
              <div className="p-4 border-b border-zinc-900 font-extrabold text-xs text-white uppercase tracking-wider">
                Support Conversations
              </div>
              
              <div className="flex-1 overflow-y-auto divide-y divide-zinc-900/60 p-2 space-y-1.5">
                {chatUsersLoading ? (
                  <div className="text-center py-6 text-zinc-500 text-xs">Loading inbox...</div>
                ) : chatUsers && chatUsers.length > 0 ? (
                  chatUsers.map((chatUser) => {
                    const isSelected = selectedChatUserId === chatUser._id;
                    return (
                      <div
                        key={chatUser._id}
                        onClick={() => {
                          setSelectedChatUserId(chatUser._id);
                          // Instantly mark messages as read inside TanStack Query cache
                          queryClient.setQueryData(['adminChatUsers'], (prev) => {
                            if (!prev) return prev;
                            return prev.map((u) => u._id === chatUser._id ? { ...u, unreadCount: 0 } : u);
                          });
                        }}
                        className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-zinc-900 border border-zinc-800'
                            : 'bg-transparent border border-transparent hover:bg-zinc-900/30'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate">{chatUser.name}</h4>
                          <p className="text-[10px] text-zinc-400 truncate mt-0.5">{chatUser.lastMessageText}</p>
                          <span className="text-[8px] text-zinc-500 block mt-1">
                            {new Date(chatUser.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {chatUser.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-accent-green text-black font-extrabold text-[10px] flex items-center justify-center shrink-0">
                            {chatUser.unreadCount}
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-zinc-600 text-xs">No active chats in system.</div>
                )}
              </div>
            </div>

            {/* Right Pane: Selected Chat Messages Frame */}
            <div className="md:col-span-8 flex flex-col h-full justify-between bg-zinc-950/40">
              {selectedChatUserId ? (
                <>
                  {/* Active user details */}
                  <div className="bg-zinc-950/60 px-6 py-3 border-b border-zinc-900 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        Chatting with:{' '}
                        <span className="text-accent-green">
                          {chatUsers?.find((u) => u._id === selectedChatUserId)?.name || 'User'}
                        </span>
                      </h4>
                      <span className="text-[9px] text-zinc-500 block">
                        Email: {chatUsers?.find((u) => u._id === selectedChatUserId)?.email}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedChatUserId(null)}
                      className="text-[10px] text-zinc-500 hover:text-white"
                    >
                      Close Chat
                    </button>
                  </div>

                  {/* Messages frame */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messagesLoading ? (
                      <div className="text-center py-6 text-zinc-500 text-xs">Loading messages...</div>
                    ) : selectedMessages && selectedMessages.length > 0 ? (
                      <>
                        {selectedMessages.map((msg) => {
                          const isAdminSender = msg.sender !== selectedChatUserId;
                          return (
                            <div
                              key={msg._id}
                              className={`flex ${isAdminSender ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-xl text-xs ${
                                  isAdminSender
                                    ? 'bg-zinc-900 border border-zinc-800 text-white rounded-tr-none'
                                    : 'bg-accent-green/10 border border-accent-green/20 text-white rounded-tl-none'
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
                        <div ref={chatEndRef} />
                      </>
                    ) : (
                      <div className="text-center py-6 text-zinc-500 text-xs">No message history.</div>
                    )}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleAdminReplySubmit} className="p-4 bg-zinc-950/60 border-t border-zinc-900 flex gap-2">
                    <input
                      type="text"
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      placeholder="Type reply to user..."
                      className="flex-1 bg-zinc-950 border border-border-dark text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={sendReplyMutation.isPending || !adminReplyText.trim()}
                      className="p-2.5 rounded-xl bg-accent-green hover:bg-accent-green-hover text-black transition-all flex items-center justify-center shrink-0 disabled:bg-zinc-800"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-xs">No chat selected</p>
                    <p className="text-zinc-500 text-[10px] mt-1 max-w-xs leading-normal">
                      Select a user from the Support list on the left to start replying to live tickets.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 5: SYSTEM USERS */}
        {activeTab === 'users' && (
          <div className="bg-card-dark border border-border-dark p-6 rounded-2xl space-y-4">
            <h3 className="text-white font-extrabold text-sm border-b border-zinc-900 pb-2">
              Registered Accounts
            </h3>

            {usersLoading ? (
              <div className="text-center py-10 text-zinc-500 text-xs">Loading accounts...</div>
            ) : users && users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-widest text-[9px] font-bold">
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Email Address</th>
                      <th className="py-3 px-4">Role Status</th>
                      <th className="py-3 px-4">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {users.map((account) => (
                      <tr key={account._id} className="hover:bg-zinc-900/10">
                        <td className="py-4 px-4 text-zinc-500">{account._id}</td>
                        <td className="py-4 px-4 font-semibold text-white">{account.name || 'No Name'}</td>
                        <td className="py-4 px-4 font-medium text-zinc-300">{account.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            account.role === 'admin'
                              ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                              : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                          }`}>
                            {account.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4">{new Date(account.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-zinc-500 text-xs">No registered accounts.</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
