import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SidebarCart from './components/SidebarCart';
import ListingDetailModal from './components/ListingDetailModal';
import Home from './pages/Home';
import CategoryList from './pages/CategoryList';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import TermsConditions from './pages/TermsConditions';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Tutorial from './components/Tutorial'; // Imported tutorial system
import { useAuthStore } from './store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, LogOut } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from './api/apiClient';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  
  // Mobile drawer state managed at root level
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tutorial Tour State (active if not completed before)
  const [tutorialActive, setTutorialActive] = useState(localStorage.getItem('tutorialCompleted') !== 'true');
  
  const { user, logout } = useAuthStore();
  const isAdmin = user && user.role === 'admin';

  // React Query to fetch unread support chat count for mobile drawer notification
  const { data: unreadData } = useQuery({
    queryKey: ['chatUnreadCount', user?._id],
    queryFn: async () => {
      const res = await apiClient.get('/chat/unread');
      return res.data;
    },
    enabled: !!user && !isAdmin,
    refetchInterval: 8000,
  });

  const unreadCount = unreadData?.unreadCount || 0;

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Shop', id: 'shop' },
    { name: 'About Us', id: 'about' },
    { name: 'Support Chat', id: 'contact' },
    { name: 'Terms & Conditions', id: 'terms' },
  ];

  const handleNavigate = (page) => {
    if (page === 'admin' && !isAdmin) {
      setActivePage('home');
    } else if (page === 'profile' && !user) {
      setActivePage('login');
    } else {
      setActivePage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleViewDetails = (listing) => {
    setSelectedListing(listing);
  };

  const handleMobileNavClick = (pageId) => {
    setMobileMenuOpen(false);
    handleNavigate(pageId);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home
            onNavigate={handleNavigate}
            onFilterCategory={handleFilterCategory}
            onViewDetails={handleViewDetails}
          />
        );
      case 'shop':
        return (
          <CategoryList
            selectedCategory={selectedCategory}
            onFilterCategory={handleFilterCategory}
            onViewDetails={handleViewDetails}
          />
        );
      case 'about':
        return <AboutUs />;
      case 'contact':
        return <ContactUs />;
      case 'terms':
        return <TermsConditions />;
      case 'checkout':
        return <Checkout onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'signup':
        return <Signup onNavigate={handleNavigate} />;
      case 'profile':
        return user ? <Profile /> : <Login onNavigate={handleNavigate} />;
      case 'admin':
        return isAdmin ? <AdminDashboard /> : <Home onNavigate={handleNavigate} onFilterCategory={handleFilterCategory} onViewDetails={handleViewDetails} />;
      default:
        return (
          <Home
            onNavigate={handleNavigate}
            onFilterCategory={handleFilterCategory}
            onViewDetails={handleViewDetails}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#070707] text-white">
      {/* Navigation Header */}
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-2 pb-20 md:py-8 md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Slide-out Sidebar Cart Drawer */}
      <SidebarCart onCheckoutNavigate={() => handleNavigate('checkout')} />

      {/* Listing details view modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}

      {/* Mobile Drawer Menu - Rendered at Root Level for Proper Stacking Context */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 cursor-pointer"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
            />

            {/* Sidebar menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.25 }}
              className="relative w-full max-w-[280px] h-full flex flex-col justify-between p-6 shadow-2xl z-10"
              style={{ backgroundColor: '#070707', borderLeft: '1px solid #1E1E1E' }}
            >
              <div>
                {/* Header of Mobile Drawer */}
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

              {/* Mobile Auth footer */}
              <div className="pt-6 border-t border-zinc-900">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <span className="text-zinc-400 text-xs truncate flex items-center gap-1.5 font-medium">
                      <User className="w-4 h-4 text-accent-green shrink-0" />
                      <span className="truncate">{user.name || user.email}</span>
                    </span>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                        handleNavigate('home');
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
                      className="text-center bg-accent-green text-black font-bold py-2 rounded-xl text-xs"
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

      {/* Onboarding tour tutorial overlay */}
      {tutorialActive && (
        <Tutorial
          activePage={activePage}
          onNavigate={handleNavigate}
          user={user}
          onComplete={() => setTutorialActive(false)}
        />
      )}

    </div>
  );
}
