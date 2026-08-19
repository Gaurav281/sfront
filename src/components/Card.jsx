import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Tv, Search, Palette, Plus, Eye } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAlertStore } from '../store/useAlertStore';

export default function Card({ listing, onViewDetails }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const addToast = useAlertStore((state) => state.addToast);

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
        return <Instagram className="w-4.5 h-4.5 text-pink-500" />;
      case 'youtube':
        return <Youtube className="w-4.5 h-4.5 text-red-500" />;
      case 'tiktok':
        return (
          <svg className="w-4.5 h-4.5 text-cyan-400 fill-current" viewBox="0 0 24 24">
            <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.88 2.85 2.1 3.59.83.5 1.78.73 2.73.74v3.29c-1.34 0-2.62-.38-3.72-1.11-.29-.19-.55-.41-.79-.65v7.02c0 3.76-2.3 7.12-6 8.04-3.7.92-7.61-1.01-9-4.55C.42 12.83 2.1 8.7 5.75 7.55c.78-.25 1.6-.33 2.42-.25v3.39c-.83-.22-1.72-.08-2.46.4-.95.62-1.48 1.71-1.38 2.83.1 1.13.8 2.1 1.83 2.53.97.4 2.1.2 2.87-.5.53-.48.77-1.16.76-1.87.01-2.58.01-9.98.01-12.55.59-.44 1.17-.9 1.73-1.53z" />
          </svg>
        );
      case 'netflix':
      case 'spotify':
      case 'streaming':
        return <Tv className="w-4.5 h-4.5 text-emerald-400" />;
      case 'google seo':
      case 'website seo':
      case 'seo':
        return <Search className="w-4.5 h-4.5 text-blue-400" />;
      case 'design':
      case 'graphics':
        return <Palette className="w-4.5 h-4.5 text-purple-400" />;
      default:
        return <Tv className="w-4.5 h-4.5 text-zinc-400" />;
    }
  };

  // Helper to extract brand aesthetic specifications
  const getBrandStyles = (platform) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) {
      return {
        hoverBorder: 'hover:border-pink-500 hover:shadow-pink-500/10',
        textHighlight: 'group-hover:text-pink-400',
        badge: 'bg-pink-500/5 text-pink-400 border-pink-500/15',
        gradientStrip: 'bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500',
        priceColor: 'text-pink-400',
      };
    }
    if (p.includes('youtube')) {
      return {
        hoverBorder: 'hover:border-red-500 hover:shadow-red-500/10',
        textHighlight: 'group-hover:text-red-400',
        badge: 'bg-red-500/5 text-red-400 border-red-500/15',
        gradientStrip: 'bg-gradient-to-r from-red-600 to-red-400',
        priceColor: 'text-red-400',
      };
    }
    if (p.includes('tiktok')) {
      return {
        hoverBorder: 'hover:border-cyan-400 hover:shadow-cyan-400/10',
        textHighlight: 'group-hover:text-cyan-400',
        badge: 'bg-cyan-400/5 text-cyan-400 border-cyan-400/15',
        gradientStrip: 'bg-gradient-to-r from-cyan-400 to-blue-500',
        priceColor: 'text-cyan-400',
      };
    }
    if (p.includes('netflix') || p.includes('spotify') || p.includes('streaming')) {
      return {
        hoverBorder: 'hover:border-emerald-400 hover:shadow-emerald-400/10',
        textHighlight: 'group-hover:text-emerald-400',
        badge: 'bg-emerald-500/5 text-emerald-400 border-emerald-500/15',
        gradientStrip: 'bg-gradient-to-r from-emerald-500 via-accent-green to-teal-400',
        priceColor: 'text-accent-green',
      };
    }
    if (p.includes('seo') || p.includes('google')) {
      return {
        hoverBorder: 'hover:border-blue-400 hover:shadow-blue-400/10',
        textHighlight: 'group-hover:text-blue-400',
        badge: 'bg-blue-500/5 text-blue-400 border-blue-500/15',
        gradientStrip: 'bg-gradient-to-r from-blue-600 to-sky-400',
        priceColor: 'text-blue-400',
      };
    }
    if (p.includes('design') || p.includes('graphics')) {
      return {
        hoverBorder: 'hover:border-purple-400 hover:shadow-purple-400/10',
        textHighlight: 'group-hover:text-purple-400',
        badge: 'bg-purple-500/5 text-purple-400 border-purple-500/15',
        gradientStrip: 'bg-gradient-to-r from-purple-600 to-fuchsia-400',
        priceColor: 'text-purple-400',
      };
    }
    return {
      hoverBorder: 'hover:border-accent-green hover:shadow-accent-green/10',
      textHighlight: 'group-hover:text-accent-green',
      badge: 'bg-zinc-900 border-zinc-800 text-zinc-300',
      gradientStrip: 'bg-gradient-to-r from-zinc-700 to-zinc-500',
      priceColor: 'text-accent-green',
    };
  };

  const brand = getBrandStyles(listing.platform);

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
      addToast(result.message, 'error');
    } else {
      addToast('Added to cart successfully!', 'success');
    }
  };

  const followersSpec = listing.specs?.followers;
  const nicheSpec = listing.specs?.niche;
  const deliverySpec = listing.specs?.deliveryTime;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={() => onViewDetails(listing)}
      className={`bg-[#0c0c0d] border border-zinc-700/80 rounded-2xl p-5 pt-7 flex flex-col justify-between h-[360px] cursor-pointer group select-none transition-all duration-300 relative overflow-hidden shadow-lg shadow-black/35 hover:bg-zinc-900/10 ${brand.hoverBorder}`}
    >
      {/* Brand accent gradient strip at top of card */}
      <div className={`h-1 w-full absolute top-0 left-0 ${brand.gradientStrip}`} />

      {/* Top Left Discount % Badge */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-lg shadow-orange-500/25 z-10 animate-pulse">
          {listing.discount}% OFF
        </div>
      )}

      <div>
        {/* Header row: Icon & Price */}
        <div className="flex justify-between items-center mb-3">
          {/* Spacer if discount badge is present, otherwise display platform */}
          {hasDiscount ? (
            <div className="w-16" /> // spacer to prevent overlap
          ) : (
            <div className={`flex items-center gap-1.5 border px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${brand.badge}`}>
              {getPlatformIcon(listing.platform)}
              <span>{listing.platform}</span>
            </div>
          )}
          
          <div className="flex flex-col items-end">
            {hasDiscount && (
              <span className="text-[10px] text-zinc-500 line-through">
                ₹{listing.price}
              </span>
            )}
            <span className={`text-lg font-black tracking-tight ${brand.priceColor}`}>
              ₹{finalPrice}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-xs md:text-sm font-black text-white mb-2 transition-colors line-clamp-2 leading-relaxed ${brand.textHighlight}`}>
          {listing.title}
        </h3>

        {/* Description */}
        <p className="text-zinc-400 text-[11px] leading-relaxed line-clamp-3 mb-4 font-medium">
          {listing.description}
        </p>
      </div>

      {/* Specs / CTA section */}
      <div>
        {/* Platform tag display when discount is active (to keep icons visible) */}
        {hasDiscount && (
          <div className={`inline-flex items-center gap-1.5 border px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 ${brand.badge}`}>
            {getPlatformIcon(listing.platform)}
            <span>{listing.platform}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {followersSpec && (
            <span className="bg-zinc-950/80 border border-zinc-800/80 text-zinc-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
              {followersSpec}
            </span>
          )}
          {nicheSpec && (
            <span className="bg-zinc-950/80 border border-zinc-800/80 text-zinc-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
              {nicheSpec}
            </span>
          )}
          {deliverySpec && (
            <span className="bg-zinc-950/80 border border-zinc-800/80 text-zinc-300 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
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
            className="flex items-center justify-center gap-1.5 flex-1 bg-zinc-900/60 hover:bg-zinc-800/60 text-white text-[11px] font-bold py-2.5 px-3 rounded-xl transition-colors border border-zinc-800 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
          
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1.5 flex-1 bg-accent-green hover:bg-accent-green-hover text-black text-[11px] font-black py-2.5 px-3 rounded-xl transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3px]" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
