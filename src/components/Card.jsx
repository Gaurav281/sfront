import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Tv, Search, Palette, Plus, Eye } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function Card({ listing, onViewDetails }) {
  const addToCart = useCartStore((state) => state.addToCart);

  // Helper to calculate discounted price
  const getDiscountedPrice = (price, discount) => {
    if (!discount || discount <= 0) return price;
    return Math.round(price - (price * discount) / 100);
  };

  const hasDiscount = listing.discount > 0;
  const finalPrice = getDiscountedPrice(listing.price, listing.discount);

  // Helper to render platform icons
  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-600" />;
      case 'tiktok':
        return (
          <svg className="w-5 h-5 text-cyan-400 fill-current" viewBox="0 0 24 24">
            <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.88 2.85 2.1 3.59.83.5 1.78.73 2.73.74v3.29c-1.34 0-2.62-.38-3.72-1.11-.29-.19-.55-.41-.79-.65v7.02c0 3.76-2.3 7.12-6 8.04-3.7.92-7.61-1.01-9-4.55C.42 12.83 2.1 8.7 5.75 7.55c.78-.25 1.6-.33 2.42-.25v3.39c-.83-.22-1.72-.08-2.46.4-.95.62-1.48 1.71-1.38 2.83.1 1.13.8 2.1 1.83 2.53.97.4 2.1.2 2.87-.5.53-.48.77-1.16.76-1.87.01-2.58.01-9.98.01-12.55.59-.44 1.17-.9 1.73-1.53z" />
          </svg>
        );
      case 'netflix':
      case 'spotify':
      case 'streaming':
        return <Tv className="w-5 h-5 text-emerald-400" />;
      case 'google seo':
      case 'website seo':
      case 'seo':
        return <Search className="w-5 h-5 text-blue-400" />;
      case 'design':
      case 'graphics':
        return <Palette className="w-5 h-5 text-purple-400" />;
      default:
        return <Tv className="w-5 h-5 text-zinc-400" />;
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const result = addToCart({
      listing: listing._id,
      _id: listing._id,
      title: listing.title,
      price: finalPrice, // Push the final discounted price
      category: listing.category,
      platform: listing.platform,
    });
    if (result && !result.success) {
      alert(result.message);
    }
  };

  const followersSpec = listing.specs?.followers;
  const nicheSpec = listing.specs?.niche;
  const deliverySpec = listing.specs?.deliveryTime;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, borderColor: '#00DF82' }}
      transition={{ duration: 0.25 }}
      onClick={() => onViewDetails(listing)}
      className="bg-card-dark border border-border-dark rounded-xl p-5 flex flex-col justify-between h-[360px] cursor-pointer group select-none transition-colors relative overflow-hidden"
    >
      {/* Top Left Discount % Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 bg-accent-green text-black font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded shadow-lg z-10 animate-pulse">
          {listing.discount}% OFF
        </div>
      )}

      <div>
        {/* Header row: Icon & Price */}
        <div className="flex justify-between items-center mb-4">
          {/* Spacer if discount badge is present, otherwise display platform */}
          {hasDiscount ? (
            <div className="w-16" /> // spacer to prevent overlap
          ) : (
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full text-xs font-semibold uppercase text-zinc-300">
              {getPlatformIcon(listing.platform)}
              <span>{listing.platform}</span>
            </div>
          )}
          
          <div className="flex flex-col items-end">
            {hasDiscount && (
              <span className="text-[10px] text-zinc-500 line-through">
                ${listing.price}
              </span>
            )}
            <span className="text-xl font-bold text-accent-green">
              ${finalPrice}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-md font-semibold text-white group-hover:text-accent-green mb-2 transition-colors line-clamp-2">
          {listing.title}
        </h3>

        {/* Description */}
        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 mb-4">
          {listing.description}
        </p>
      </div>

      {/* Specs / CTA section */}
      <div>
        {/* Platform tag display when discount is active (to keep icons visible) */}
        {hasDiscount && (
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-zinc-500 mb-2">
            {getPlatformIcon(listing.platform)}
            <span>{listing.platform}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {followersSpec && (
            <span className="bg-zinc-900/60 border border-zinc-800 text-zinc-300 text-[10px] px-2 py-0.5 rounded-full font-medium">
              {followersSpec}
            </span>
          )}
          {nicheSpec && (
            <span className="bg-zinc-900/60 border border-zinc-800 text-zinc-300 text-[10px] px-2 py-0.5 rounded-full font-medium">
              {nicheSpec}
            </span>
          )}
          {deliverySpec && (
            <span className="bg-zinc-900/60 border border-zinc-800 text-zinc-300 text-[10px] px-2 py-0.5 rounded-full font-medium">
              Delivery: {deliverySpec}
            </span>
          )}
        </div>

        {/* Card Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(listing);
            }}
            className="flex items-center justify-center gap-1.5 flex-1 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors border border-zinc-800"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
          
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1.5 flex-1 bg-accent-green hover:bg-accent-green-hover text-black text-xs font-bold py-2 px-3 rounded-lg transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3px]" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
