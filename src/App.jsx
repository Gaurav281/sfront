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
import { useAuthStore } from './store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  
  const { user } = useAuthStore();
  const isAdmin = user && user.role === 'admin';

  const handleNavigate = (page) => {
    // Front-end route guard: redirect to home if non-admin tries to access admin
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

  // Helper to render pages based on routing state
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
      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      {/* Main Content Area with Page Change Animations */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 pb-20 md:pb-8">
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
    </div>
  );
}
