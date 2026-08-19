import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, HelpCircle, X } from 'lucide-react';

export default function Tutorial({ activePage, onNavigate, user, onComplete }) {
  const [step, setStep] = useState(0);
  const [coords, setCoords] = useState(null);
  const [initialDelay, setInitialDelay] = useState(true);

  const steps = [
    {
      targetId: { desktop: 'nav-home', mobile: 'mobile-nav-home' },
      text: "Home: Visit our main page to view featured deals.",
      page: 'home',
      requiresLogin: false,
    },
    {
      targetId: { desktop: 'hero-section', mobile: 'hero-section' },
      text: "Deals: Buy verified Instagram pages and YT Premium at cheap prices.",
      page: 'home',
      requiresLogin: false,
    },
    {
      targetId: { desktop: 'nav-shop', mobile: 'mobile-nav-shop' },
      text: "Shop: Browse our full catalog of Instagram pages and premium plans.",
      page: 'home',
      requiresLogin: false,
    },
    {
      targetId: { desktop: 'shop-categories', mobile: 'shop-categories' },
      text: "Filters: Quickly filter the shop by category to find what you want.",
      page: 'shop',
      requiresLogin: false,
    },
    {
      targetId: { desktop: 'nav-chat', mobile: 'mobile-nav-chat' },
      text: "Support Chat: Message our team to coordinate secure handovers.",
      page: 'shop',
      requiresLogin: false,
    },
    {
      targetId: { desktop: 'chat-box', mobile: 'chat-box' },
      text: "Live Support Box: Real-time messaging with operators to transfer details safely.",
      page: 'contact',
      requiresLogin: true,
    }
  ];

  // 0.5-second initial delay on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialDelay(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const currentStepData = steps[step];

  const isMobile = () => window.innerWidth < 768;

  // Auto-navigate to correct page when step changes
  useEffect(() => {
    if (initialDelay || !currentStepData) return;
    
    if (currentStepData.requiresLogin && !user) {
      handleNext();
      return;
    }

    if (activePage !== currentStepData.page) {
      onNavigate(currentStepData.page);
    }
  }, [step, user, initialDelay]);

  // Track coordinates of target element
  useEffect(() => {
    const updatePosition = () => {
      if (initialDelay || !currentStepData) return;
      
      // Check if target is a generic string (e.g. desktop/mobile key selector)
      const targetKey = isMobile() ? currentStepData.targetId.mobile : currentStepData.targetId.desktop;
      const el = document.getElementById(targetKey);
      
      if (el) {
        const rect = el.getBoundingClientRect();
        setCoords({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
          bottom: rect.bottom,
        });
      } else {
        setCoords(null);
      }
    };

    const delay = setTimeout(updatePosition, 400);
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      clearTimeout(delay);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [step, activePage, initialDelay]);

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

  if (initialDelay || !currentStepData) return null;

  // Calculate layout-aware prompt position (above or below targeted element)
  const getPromptPositionStyle = () => {
    if (!coords) {
      // Fallback: center of viewport
      return {
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
      };
    }

    const viewportHeight = window.innerHeight;
    const isTargetNearTop = coords.top < viewportHeight / 2;

    if (isTargetNearTop) {
      // Place prompt card below highlighted element
      return {
        top: `${coords.top + coords.height + 16}px`,
        left: '50%',
        transform: 'translateX(-50%)',
      };
    } else {
      // Place prompt card above highlighted element
      return {
        bottom: `${viewportHeight - coords.top + 16}px`,
        left: '50%',
        transform: 'translateX(-50%)',
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 pointer-events-auto cursor-pointer"
        onClick={handleNext}
      />

      {/* Target spotlight highlighting rings */}
      {coords && (
        <>
          {/* Animated shrinking target ring focusing on the button */}
          <motion.div
            key={`shrinking-ring-${step}`}
            initial={{ scale: 2.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, duration: 0.6 }}
            className="absolute border-[3px] border-accent-green rounded-xl z-50"
            style={{
              top: coords.top - 6,
              left: coords.left - 6,
              width: coords.width + 12,
              height: coords.height + 12,
            }}
          />

          {/* Core spotlight ring */}
          <div
            className="absolute border border-accent-green rounded-xl shadow-[0_0_15px_rgba(0,223,130,0.6)] z-50"
            style={{
              top: coords.top - 6,
              left: coords.left - 6,
              width: coords.width + 12,
              height: coords.height + 12,
            }}
          />
        </>
      )}

      {/* Layout-aware central prompts instructions card */}
      <div className="absolute z-50 transition-all duration-300" style={getPromptPositionStyle()}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-[90vw] max-w-[340px] bg-zinc-950 border border-zinc-800 p-5 rounded-2xl shadow-2xl space-y-4 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-accent-green">
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-wider">Onboarding Guide</span>
            </div>
            <button
              onClick={handleClose}
              className="text-zinc-500 hover:text-white p-0.5 rounded transition-colors"
              title="Skip Guide"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Description text */}
          <p className="text-zinc-300 text-xs font-semibold leading-relaxed">
            {currentStepData.text}
          </p>

          {/* Prompt card action buttons */}
          <div className="flex justify-between items-center pt-1 text-[10px]">
            <button
              onClick={handleClose}
              className="text-zinc-500 hover:text-red-400 font-bold transition-colors cursor-pointer"
            >
              Skip
            </button>
            
            <button
              onClick={handleNext}
              className="bg-accent-green hover:bg-accent-green-hover text-black font-extrabold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              <span>{step === steps.length - 1 ? 'Finish' : 'Next'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
