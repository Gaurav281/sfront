import React from 'react';
import { ShoppingCart, LogOut, User, Menu, Home, Search, MessageSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/apiClient';

export default function Navbar({ activePage, onNavigate, mobileMenuOpen, setMobileMenuOpen }) {
  const { items, toggleCart } = useCartStore();
  const { user, logout } = useAuthStore();

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
    { name: 'Home', id: 'home', elementId: 'nav-home' },
    { name: 'Shop', id: 'shop', elementId: 'nav-shop' }, // added elementId for tutorial
    { name: 'About Us', id: 'about' },
    { name: 'Support Chat', id: 'contact', elementId: 'nav-chat' }, // added elementId
    { name: 'Terms & Conditions', id: 'terms' },
  ];

  return (
    <>
      <nav className="sticky top-0 bg-[#070707]/90 backdrop-blur-md border-b border-border-dark z-40 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20"> {/* Increased navbar height from h-16 to h-20 */}
            {/* Logo */}
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-accent-green flex items-center justify-center font-black text-black text-xl">
                Ω
              </div>
              <span className="text-white font-extrabold text-base sm:text-lg tracking-wider uppercase">
                DIGITAL<span className="text-accent-green"> SERVICE PRO</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  id={link.elementId} // Binding ID for tutorial spotlights
                  onClick={() => onNavigate(link.id)}
                  className={`relative text-sm font-bold uppercase tracking-wider transition-colors hover:text-accent-green flex items-center gap-1.5 cursor-pointer ${
                    activePage === link.id ? 'text-accent-green' : 'text-zinc-400'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.id === 'contact' && unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-accent-green text-black font-extrabold text-[9px] flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
              
              {/* Admin Dashboard */}
              {isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`text-sm font-extrabold uppercase tracking-wider transition-colors hover:text-accent-green border border-accent-green/30 bg-accent-green/5 px-3.5 py-1.5 rounded-xl cursor-pointer ${
                    activePage === 'admin' ? 'text-accent-green' : 'text-zinc-300'
                  }`}
                >
                  Admin Panel
                </button>
              )}
            </div>

            {/* Desktop Right Panel (Cart & Auth) */}
            <div className="hidden md:flex items-center space-x-5">
              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-accent-green hover:border-accent-green/30 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      key={cartCount}
                      className="absolute -top-1.5 -right-1.5 w-5.5 h-5.5 rounded-full bg-accent-green text-black font-extrabold text-[10px] flex items-center justify-center border-2 border-[#070707]"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Auth Buttons */}
              {user ? (
                <div 
                  id="nav-profile" // Binding ID for tutorial spotlights
                  className="flex items-center gap-4 bg-zinc-900/60 border border-border-dark px-4 py-2 rounded-xl"
                >
                  <div
                    onClick={() => onNavigate('profile')}
                    className="flex items-center gap-2 text-zinc-300 text-sm font-semibold max-w-[150px] truncate cursor-pointer hover:text-accent-green transition-colors"
                    title="View Profile"
                  >
                    <User className="w-4 h-4 text-accent-green" />
                    <span>{user.name || user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      onNavigate('home');
                    }}
                    className="p-1.5 rounded-md text-zinc-500 hover:text-red-500 hover:bg-zinc-800/40 transition-all cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onNavigate('login')}
                    className="text-sm font-extrabold text-zinc-300 hover:text-white px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => onNavigate('signup')}
                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center gap-3.5">
              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 transition-all cursor-pointer"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent-green text-black font-extrabold text-[9px] flex items-center justify-center border border-[#070707]">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <Menu className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Fixed Bottom Navigation Bar for Mobile viewports - Magnified Controls */}
      <div className="fixed bottom-0 left-0 right-0 h-18 bg-black border-t border-zinc-900 md:hidden flex justify-around items-center z-45 shadow-2xl">
        
        {/* Home */}
        <button
          id="mobile-nav-home"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center gap-1.5 w-16 h-full transition-colors cursor-pointer ${
            activePage === 'home' ? 'text-accent-green' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Home className="w-5.5 h-5.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </button>

        {/* Shop */}
        <button
          id="mobile-nav-shop" // Binding ID for tutorial spotlights
          onClick={() => onNavigate('shop')}
          className={`flex flex-col items-center justify-center gap-1.5 w-16 h-full transition-colors cursor-pointer ${
            activePage === 'shop' ? 'text-accent-green' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Search className="w-5.5 h-5.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Shop</span>
        </button>

        {/* Support Chat */}
        <button
          id="mobile-nav-chat" // Binding ID for tutorial spotlights
          onClick={() => onNavigate(user ? 'contact' : 'login')}
          className={`relative flex flex-col items-center justify-center gap-1.5 w-16 h-full transition-colors cursor-pointer ${
            activePage === 'contact' ? 'text-accent-green' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <MessageSquare className="w-5.5 h-5.5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-3 w-4.5 h-4.5 rounded-full bg-accent-green text-black font-extrabold text-[8px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider">Chat</span>
        </button>

        {/* Profile */}
        <button
          id="mobile-nav-profile" // Binding ID for tutorial spotlights
          onClick={() => onNavigate(user ? 'profile' : 'login')}
          className={`flex flex-col items-center justify-center gap-1.5 w-16 h-full transition-colors cursor-pointer ${
            activePage === 'profile' || activePage === 'login' || activePage === 'signup'
              ? 'text-accent-green'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <User className="w-5.5 h-5.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </button>

      </div>
    </>
  );
}
