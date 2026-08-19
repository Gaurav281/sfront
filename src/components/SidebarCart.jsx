import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useAlertStore } from '../store/useAlertStore';

export default function SidebarCart({ onCheckoutNavigate }) {
  const { items, cartOpen, setCartOpen, removeFromCart, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const addToast = useAlertStore((state) => state.addToast);

  if (!cartOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop (semi-transparent dark) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={() => setCartOpen(false)}
          className="absolute inset-0 bg-black cursor-pointer"
        />

        {/* Sidebar Container */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
          className="relative w-full max-w-[450px] h-full bg-[#0D0D0D] border-l border-border-dark flex flex-col justify-between shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-border-dark">
            <div className="flex items-center gap-2 text-white">
              <ShoppingCart className="w-5 h-5 text-accent-green" />
              <span className="font-bold text-lg">Your Cart</span>
              <span className="bg-accent-green text-black font-extrabold text-xs px-2 py-0.5 rounded-full ml-1">
                {items.length}
              </span>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-zinc-900/60 border border-border-dark flex items-center justify-center text-zinc-500">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-semibold text-white">Your cart is empty</p>
                  <p className="text-zinc-500 text-xs mt-1">Browse accounts and services to add items.</p>
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, height: 0, y: 15 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -15 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-zinc-900/40 border border-border-dark p-4 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-accent-green uppercase tracking-wide bg-accent-green/5 px-2 py-0.5 rounded border border-accent-green/10">
                          {item.platform}
                        </span>
                        <h4 className="text-sm font-semibold text-white mt-1.5 truncate">
                          {item.title}
                        </h4>
                        <span className="text-xs text-zinc-500 block mt-0.5">
                          {item.category}
                        </span>
                      </div>
                      
                      {/* Price and delete button */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-sm font-bold text-white">₹{item.price}</span>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border-dark bg-zinc-950/80 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Subtotal</span>
                <span className="text-lg font-bold text-white">₹{getTotalPrice()}</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal">
                Tax and delivery fees are calculated at checkout. Safe Payment Lock is fully active on all orders.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setCartOpen(false)}
                  className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors border border-zinc-800 text-xs text-center"
                >
                  Continue Shop
                </button>
                <button
                  onClick={() => {
                    setCartOpen(false);
                    if (!user) {
                      addToast('Please login to complete your checkout.', 'info');
                      window.location.hash = '#/login';
                    } else {
                      onCheckoutNavigate();
                    }
                  }}
                  className="flex-[2] flex items-center justify-center gap-1.5 bg-accent-green hover:bg-accent-green-hover text-black font-bold py-3 px-4 rounded-xl transition-all text-xs cursor-pointer"
                >
                  <span>Checkout Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
