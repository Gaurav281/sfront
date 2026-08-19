import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, HelpCircle, X } from 'lucide-react';

export default function Tutorial({ activePage, onNavigate, user, onComplete }) {
  const [step, setStep] = useState(0);
  const [coords, setCoords] = useState(null);

  const steps = [
    {
      targetId: { desktop: 'nav-shop', mobile: 'mobile-nav-shop' },
      text: "Shop: Buy Instagram accounts, YouTube Premium, and digital services at cheap rates.",
      page: 'home',
    },
    {
      targetId: { desktop: 'shop-categories', mobile: 'shop-categories' },
      text: "Filters: Quickly filter the shop by platform or category to find what you want.",
      page: 'shop',
    },
    {
      targetId: { desktop: 'nav-chat', mobile: 'mobile-nav-chat' },
      text: "Support Chat: Message our team to coordinate credentials handover or ask questions.",
      page: 'shop', // start navigation from shop
    },
    {
      targetId: { desktop: 'chat-box', mobile: 'chat-box' },
      text: "Live Support Box: Real-time messaging with operators to securely transfer ownership.",
      page: 'contact',
      requiresLogin: true,
    },
    {
      targetId: { desktop: 'nav-profile', mobile: 'mobile-nav-profile' },
      text: "Profile: Manage settings, update contact handles, and view your purchase history.",
      page: 'contact',
    },
    {
      targetId: { desktop: 'profile-purchases', mobile: 'profile-purchases' },
      text: "Order Cards: Review secure order status, transacted dates, and paid UPI details.",
      page: 'profile',
      requiresLogin: true,
    }
  ];

  const currentStepData = steps[step];

  // Helper to determine if mobile layout is active
  const isMobile = () => window.innerWidth < 768;

  // Auto-navigation when changing steps
  useEffect(() => {
    if (!currentStepData) return;
    
    // Skip step if login is required but user is not logged in
    if (currentStepData.requiresLogin && !user) {
      handleNext();
      return;
    }

    if (activePage !== currentStepData.page) {
      onNavigate(currentStepData.page);
    }
  }, [step, user]);

  // Recalculate target positions
  useEffect(() => {
    const updatePosition = () => {
      if (!currentStepData) return;
      
      const targetKey = isMobile() ? currentStepData.targetId.mobile : currentStepData.targetId.desktop;
      const el = document.getElementById(targetKey);
      
      if (el) {
        const rect = el.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setCoords(null);
      }
    };

    // Delay slightly to let the page render content
    const delay = setTimeout(updatePosition, 350);
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(delay);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [step, activePage]);

  // 4-second auto-advance timer per step
  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 4500);

    return () => clearTimeout(timer);
  }, [step]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    onComplete();
  };

  if (!currentStepData) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-black/65 pointer-events-auto"
        onClick={handleNext} // Clicking backdrop advances the step
      />

      {/* Spotlight Ring Wrapper */}
      {coords && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute border-2 border-accent-green rounded-xl shadow-[0_0_20px_rgba(0,223,130,0.5)] z-50"
          style={{
            top: coords.top - 6,
            left: coords.left - 6,
            width: coords.width + 12,
            height: coords.height + 12,
          }}
        />
      )}

      {/* Central prompts instructions card */}
      <div className="absolute inset-x-4 top-1/3 md:top-1/4 flex justify-center z-50">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="w-full max-w-sm bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-2xl space-y-4 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2.5">
            <div className="flex items-center gap-1.5 text-accent-green">
              <HelpCircle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-wider">Quick Platform Tour</span>
            </div>
            <button
              onClick={handleClose}
              className="text-zinc-500 hover:text-white p-0.5 rounded transition-colors"
              title="Skip Tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description text */}
          <p className="text-zinc-300 text-xs font-semibold leading-relaxed">
            {currentStepData.text}
          </p>

          {/* Prompt card action buttons */}
          <div className="flex justify-between items-center pt-2 text-[10px]">
            <button
              onClick={handleClose}
              className="text-zinc-500 hover:text-red-400 font-bold transition-colors cursor-pointer"
            >
              Skip Tour
            </button>
            
            <button
              onClick={handleNext}
              className="flex items-center gap-1 bg-accent-green hover:bg-accent-green-hover text-black font-extrabold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              <span>{step === steps.length - 1 ? 'Finish' : 'Next'}</span>
              <ArrowRight className="w-3 h-3 stroke-[3px]" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
