import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, User, Clock, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function ListingDetailModal({ listing, onClose }) {
  const addToCart = useCartStore((state) => state.addToCart);

  if (!listing) return null;

  // Helper to calculate discounted price
  const getDiscountedPrice = (price, discount) => {
    if (!discount || discount <= 0) return price;
    return Math.round(price - (price * discount) / 100);
  };

  const hasDiscount = listing.discount > 0;
  const finalPrice = getDiscountedPrice(listing.price, listing.discount);

  const handleAddToCart = () => {
    const result = addToCart({
      listing: listing._id,
      _id: listing._id,
      title: listing.title,
      price: finalPrice, // Push final price
      category: listing.category,
      platform: listing.platform,
    });
    if (result && !result.success) {
      alert(result.message);
    } else {
      onClose(); // close modal to let cart drawer slide out
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[#0D0D0D] border border-border-dark rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col"
        >
          {/* Header section */}
          <div className="flex justify-between items-center border-b border-border-dark px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-green bg-accent-green/10 px-3 py-1 rounded-full border border-accent-green/20">
                {listing.category}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body contents */}
          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{listing.title}</h2>
              <div className="flex items-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>{listing.sellerInfo}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Listed {new Date(listing.createdAt || Date.now()).toLocaleDateString()}</span>
                </span>
              </div>
            </div>

            {/* Price tag block */}
            <div className="flex items-center justify-between bg-zinc-900/40 border border-border-dark p-4 rounded-xl">
              <div>
                <span className="text-zinc-400 text-xs uppercase font-medium tracking-wider">Total Price</span>
                <div className="flex items-baseline gap-2">
                  {hasDiscount && (
                    <span className="text-sm text-zinc-500 line-through">
                      ${listing.price}
                    </span>
                  )}
                  <div className="text-2xl md:text-3xl font-black text-white">${finalPrice}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-accent-green bg-accent-green/10 px-3 py-2 rounded-lg border border-accent-green/20">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span className="font-semibold">Safe Lock Protection Active</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-zinc-300 font-semibold mb-2 text-sm uppercase tracking-wider">Description</h4>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line bg-zinc-950/60 p-4 rounded-xl border border-zinc-900">
                {listing.description}
              </p>
            </div>

            {/* Specs Grid */}
            <div>
              <h4 className="text-zinc-300 font-semibold mb-3 text-sm uppercase tracking-wider">Technical Specifications</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-zinc-900/60 border border-border-dark p-3 rounded-lg flex flex-col justify-center">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Platform</span>
                  <span className="text-sm font-bold text-white mt-1">{listing.platform}</span>
                </div>
                {listing.specs?.followers && (
                  <div className="bg-zinc-900/60 border border-border-dark p-3 rounded-lg flex flex-col justify-center">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Audience / Reach</span>
                    <span className="text-sm font-bold text-white mt-1">{listing.specs.followers}</span>
                  </div>
                )}
                {listing.specs?.niche && (
                  <div className="bg-zinc-900/60 border border-border-dark p-3 rounded-lg flex flex-col justify-center">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Category Niche</span>
                    <span className="text-sm font-bold text-white mt-1">{listing.specs.niche}</span>
                  </div>
                )}
                {listing.specs?.age && (
                  <div className="bg-zinc-900/60 border border-border-dark p-3 rounded-lg flex flex-col justify-center">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Asset Age</span>
                    <span className="text-sm font-bold text-white mt-1">{listing.specs.age}</span>
                  </div>
                )}
                {listing.specs?.deliveryTime && (
                  <div className="bg-zinc-900/60 border border-border-dark p-3 rounded-lg flex flex-col justify-center">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Delivery Window</span>
                    <span className="text-sm font-bold text-white mt-1">{listing.specs.deliveryTime}</span>
                  </div>
                )}
                {listing.specs?.domainAuthority && (
                  <div className="bg-zinc-900/60 border border-border-dark p-3 rounded-lg flex flex-col justify-center">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Domain Authority</span>
                    <span className="text-sm font-bold text-white mt-1">{listing.specs.domainAuthority}</span>
                  </div>
                )}
                {listing.specs?.revisionCount && (
                  <div className="bg-zinc-900/60 border border-border-dark p-3 rounded-lg flex flex-col justify-center">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Revisions</span>
                    <span className="text-sm font-bold text-white mt-1">{listing.specs.revisionCount}</span>
                  </div>
                )}
                <div className="bg-zinc-900/60 border border-border-dark p-3 rounded-lg flex flex-col justify-center">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Monetized</span>
                  <span className="text-sm font-bold text-white mt-1">
                    {listing.specs?.monetized ? 'Yes (AdSense Approved)' : 'No / N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Buyer Protection Guidelines */}
            <div className="bg-zinc-950 border border-border-dark p-4 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-400 space-y-1">
                <p className="font-semibold text-white">100% Safe Payment Guarantee</p>
                <p>
                  Aapka paisa safety lock me block rahega. Jab tak aap details verify nahi karte, tab tak payment complete nahi hoti. Agar details nahi milti toh full refund instantly mil jayega.
                </p>
              </div>
            </div>
          </div>

          {/* Footer controls */}
          <div className="border-t border-border-dark bg-zinc-950 px-6 py-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors border border-zinc-800"
            >
              Close
            </button>
            <button
              onClick={handleAddToCart}
              className="flex-[2] flex items-center justify-center gap-2 bg-accent-green hover:bg-accent-green-hover text-black font-bold py-3 px-4 rounded-xl transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart & Checkout</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
