import React from 'react';
import { ShoppingCart, LogOut, User, Menu, X, Home, Search, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/apiClient';

export default function Navbar({ activePage, onNavigate }) {
  const { items, toggleCart } = useCartStore();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const cartCount = items.length;
  const isAdmin = user && user.role === 'admin';

  // React Query to fetch unread support chat count
  const { data: unreadData } = useQuery({
    queryKey: ['chatUnreadCount', user?._id],
    queryFn: async () => {
      const res = await apiClient.get('/chat/unread');
      return res.data;
    },
    enabled: !!user && !isAdmin, // Only query for regular logged-in users
    refetchInterval: 8000,
  });

  const unreadCount = unreadData?.unreadCount || 0;

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Shop', id: 'shop' }, // Renamed from "Shop Assets" to "Shop"
    { name: 'About Us', id: 'about' },
    { name: 'Support Chat', id: 'contact' },
    { name: 'Terms & Conditions', id: 'terms' },
  ];

  const handleMobileNavClick = (pageId) => {
    setMobileMenuOpen(false);
    onNavigate(pageId);
  };

  return (
    <>
      <nav className="sticky top-0 bg-[#070707]/90 backdrop-blur-md border-b border-border-dark z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-accent-green flex items-center justify-center font-black text-black text-lg">
                Ω
              </div>
              <span className="text-white font-extrabold text-lg tracking-wider">
                DIGI<span className="text-accent-green">VAULT</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`relative text-xs font-semibold uppercase tracking-wider transition-colors hover:text-accent-green flex items-center gap-1 cursor-pointer ${
                    activePage === link.id ? 'text-accent-green' : 'text-zinc-400'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.id === 'contact' && unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-accent-green text-black font-extrabold text-[8px] flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
              
              {/* Admin Dashboard */}
              {isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`text-xs font-bold uppercase tracking-wider transition-colors hover:text-accent-green border border-accent-green/30 bg-accent-green/5 px-2.5 py-1 rounded-lg cursor-pointer ${
                    activePage === 'admin' ? 'text-accent-green' : 'text-zinc-300'
                  }`}
                >
                  Admin Panel
                </button>
              )}
            </div>

            {/* Desktop Right Panel (Cart & Auth) */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-accent-green hover:border-accent-green/30 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      key={cartCount}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent-green text-black font-extrabold text-[10px] flex items-center justify-center border-2 border-[#070707]"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Auth Buttons */}
              {user ? (
                <div className="flex items-center gap-3 bg-zinc-900/60 border border-border-dark px-3 py-1.5 rounded-xl">
                  <div
                    onClick={() => onNavigate('profile')}
                    className="flex items-center gap-1.5 text-zinc-300 text-xs font-semibold max-w-[150px] truncate cursor-pointer hover:text-accent-green transition-colors"
                    title="View Profile"
                  >
                    <User className="w-3.5 h-3.5 text-accent-green" />
                    <span>{user.name || user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      onNavigate('home');
                    }}
                    className="p-1 rounded-md text-zinc-500 hover:text-red-500 hover:bg-zinc-800/40 transition-all cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('login')}
                    className="text-xs font-bold text-zinc-300 hover:text-white px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onNavigate('signup')}
                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger menu */}
            <div className="md:hidden flex items-center gap-3">
              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-accent-green text-black font-extrabold text-[9px] flex items-center justify-center border border-[#070707]">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Right-Sliding Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex justify-end">
              {/* Backdrop - Explicit Inline Styling to Prevent Transparency */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="absolute inset-0 cursor-pointer"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
              />

              {/* Sidebar Menu Panel - Solid Black Inline Styling */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
                className="relative w-full max-w-[280px] h-full flex flex-col justify-between p-6 shadow-2xl z-10"
                style={{ backgroundColor: '#070707', borderLeft: '1px solid #1E1E1E' }}
              >
                <div>
                  {/* Header */}
                  <div className="flex justify-between items-center pb-6 border-b border-zinc-900">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-accent-green flex items-center justify-center font-black text-black text-xs">
                        Ω
                      </div>
                      <span className="text-white font-extrabold text-sm tracking-wider">Menu</span>
                    </div>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Nav links */}
                  <div className="mt-6 flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <button
                        key={link.id}
                        onClick={() => handleMobileNavClick(link.id)}
                        className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wide border transition-all flex items-center justify-between cursor-pointer ${
                          activePage === link.id
                            ? 'bg-zinc-900 text-accent-green border-zinc-800 font-bold'
                            : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white border-transparent'
                        }`}
                      >
                        <span>{link.name}</span>
                        {link.id === 'contact' && unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-accent-green text-black font-extrabold text-[8px] flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    ))}

                    {/* Profile */}
                    {user && (
                      <button
                        onClick={() => handleMobileNavClick('profile')}
                        className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                          activePage === 'profile'
                            ? 'bg-zinc-900 text-accent-green border-zinc-800 font-bold'
                            : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white border-transparent'
                        }`}
                      >
                        My Profile
                      </button>
                    )}

                    {/* Admin Dashboard */}
                    {isAdmin && (
                      <button
                        onClick={() => handleMobileNavClick('admin')}
                        className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-bold tracking-wide border mt-2 transition-all cursor-pointer ${
                          activePage === 'admin'
                            ? 'bg-accent-green/10 text-accent-green border-accent-green/20'
                            : 'text-zinc-300 bg-zinc-900/40 hover:bg-zinc-900 hover:text-white border-border-dark'
                        }`}
                      >
                        Admin Dashboard
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-zinc-900">
                  {user ? (
                    <div className="flex flex-col gap-3">
                      <span className="text-zinc-400 text-xs truncate flex items-center gap-1.5">
                        <User className="w-4 h-4 text-accent-green shrink-0" />
                        <span className="truncate">{user.name || user.email}</span>
                      </span>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                          onNavigate('home');
                        }}
                        className="flex items-center justify-center gap-1.5 w-full bg-red-950/40 border border-red-900/50 hover:bg-red-900/40 text-red-400 font-bold py-2.5 rounded-xl transition-all text-xs cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout Account</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleMobileNavClick('login')}
                        className="text-center font-bold text-zinc-300 py-2 border border-zinc-900 rounded-xl text-xs hover:bg-zinc-900 cursor-pointer"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => handleMobileNavClick('signup')}
                        className="text-center bg-accent-green text-black font-bold py-2 rounded-xl text-xs cursor-pointer"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </nav>

      {/* Fixed Bottom Navigation Bar for Mobile viewports */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-zinc-900 md:hidden flex justify-around items-center z-45">
        
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors cursor-pointer ${
            activePage === 'home' ? 'text-accent-green' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-semibold uppercase tracking-wider">Home</span>
        </button>

        {/* Shop */}
        <button
          onClick={() => onNavigate('shop')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors cursor-pointer ${
            activePage === 'shop' ? 'text-accent-green' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[9px] font-semibold uppercase tracking-wider">Shop</span>
        </button>

        {/* Support Chat */}
        <button
          onClick={() => onNavigate(user ? 'contact' : 'login')}
          className={`relative flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors cursor-pointer ${
            activePage === 'contact' ? 'text-accent-green' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2.5 w-4 h-4 rounded-full bg-accent-green text-black font-extrabold text-[8px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          <span className="text-[9px] font-semibold uppercase tracking-wider">Chat</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate(user ? 'profile' : 'login')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full transition-colors cursor-pointer ${
            activePage === 'profile' || activePage === 'login' || activePage === 'signup'
              ? 'text-accent-green'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[9px] font-semibold uppercase tracking-wider">Profile</span>
        </button>

      </div>
    </>
  );
}
