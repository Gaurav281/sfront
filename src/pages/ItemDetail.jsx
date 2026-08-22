import React from 'react';
import { ShieldCheck, ArrowLeft, Plus, Trash, Clock, User, Sparkles, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAlertStore } from '../store/useAlertStore';
import { useAuthStore } from '../store/useAuthStore';

export default function ItemDetail({ listing, onNavigate }) {
  const { addToCart, items, removeFromCart } = useCartStore();
  const addToast = useAlertStore((state) => state.addToast);
  const user = useAuthStore((state) => state.user);

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center select-none space-y-4 animate-fade-in">
        <div className="bg-card-dark border border-zinc-800 p-8 rounded-2xl space-y-4 shadow-xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-black text-white">Item Not Found</h2>
          <p className="text-zinc-400 text-xs">This listing may have been sold or removed.</p>
          <button
            onClick={() => onNavigate('shop')}
            className="w-full bg-accent-green hover:bg-accent-green-hover text-black font-extrabold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const hasDiscount = listing.discount > 0;
  const finalPrice = hasDiscount
    ? Math.round(listing.price - (listing.price * listing.discount) / 100)
    : listing.price;

  const isInCart = items.some((item) => item._id === listing._id);

  const handleCartAction = () => {
    if (!user) {
      addToast('Please login to edit your cart.', 'info');
      onNavigate('login');
      return;
    }
    if (isInCart) {
      removeFromCart(listing._id);
      addToast('Removed from cart', 'info');
    } else {
      const result = addToCart({
        listing: listing._id,
        _id: listing._id,
        title: listing.title,
        price: finalPrice,
        category: listing.category,
        platform: listing.platform,
      });
      if (result && !result.success) {
        addToast(result.message, 'error');
      } else {
        addToast('Added to cart successfully!', 'success');
      }
    }
  };

  const handleCheckoutNow = () => {
    if (!user) {
      addToast('Please login to complete your checkout.', 'info');
      onNavigate('login');
      return;
    }
    if (!isInCart) {
      addToCart({
        listing: listing._id,
        _id: listing._id,
        title: listing.title,
        price: finalPrice,
        category: listing.category,
        platform: listing.platform,
      });
    }
    onNavigate('checkout');
  };

  // Helper to determine platform-themed backgrounds and glows
  const getPlatformBrandStyles = (platform) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) {
      return {
        bannerBg: 'bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-500',
        textColor: 'text-pink-400',
        borderColor: 'border-pink-500/30',
        badgeBg: 'bg-pink-500/10 text-pink-400',
        glowShadow: 'shadow-pink-500/10'
      };
    }
    if (p.includes('youtube')) {
      return {
        bannerBg: 'bg-gradient-to-r from-red-700 to-red-500',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30',
        badgeBg: 'bg-red-500/10 text-red-400',
        glowShadow: 'shadow-red-500/10'
      };
    }
    if (p.includes('tiktok')) {
      return {
        bannerBg: 'bg-gradient-to-r from-cyan-500 via-zinc-900 to-pink-500',
        textColor: 'text-cyan-400',
        borderColor: 'border-cyan-500/30',
        badgeBg: 'bg-cyan-500/10 text-cyan-400',
        glowShadow: 'shadow-cyan-500/10'
      };
    }
    if (p.includes('netflix') || p.includes('spotify') || p.includes('streaming')) {
      return {
        bannerBg: 'bg-gradient-to-r from-emerald-600 via-accent-green to-teal-500',
        textColor: 'text-accent-green',
        borderColor: 'border-accent-green/30',
        badgeBg: 'bg-accent-green/10 text-accent-green',
        glowShadow: 'shadow-accent-green/10'
      };
    }
    if (p.includes('seo') || p.includes('google')) {
      return {
        bannerBg: 'bg-gradient-to-r from-blue-600 to-sky-400',
        textColor: 'text-blue-400',
        borderColor: 'border-blue-500/30',
        badgeBg: 'bg-blue-500/10 text-blue-400',
        glowShadow: 'shadow-blue-500/10'
      };
    }
    return {
      bannerBg: 'bg-gradient-to-r from-purple-600 to-indigo-500',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/30',
      badgeBg: 'bg-purple-500/10 text-purple-400',
      glowShadow: 'shadow-purple-500/10'
    };
  };

  const brand = getPlatformBrandStyles(listing.platform);

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 select-none space-y-6 animate-fade-in">
      {/* Back link button */}
      <div>
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-2 text-xs font-black text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-xl cursor-pointer shadow"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: High Visual Platform Banner & Listing Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Visual Platform Banner */}
          <div className={`${brand.bannerBg} rounded-2xl p-8 flex flex-col justify-end min-h-[160px] relative overflow-hidden shadow-2xl ${brand.glowShadow}`}>
            {/* Dark gradient mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 text-white px-3 py-1 rounded-full border border-white/20">
                {listing.platform} Verification Pass
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white leading-tight uppercase tracking-wide drop-shadow-md">
                {listing.category} catalog item
              </h2>
            </div>
          </div>

          <div className="bg-[#0c0c0d] border border-zinc-800 p-6 rounded-2xl space-y-5 shadow-xl">
            {/* Category / Platform badges */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-accent-green bg-accent-green/5 border border-accent-green/10 px-3.5 py-1 rounded-full">
                {listing.category}
              </span>
              <span className={`text-[9px] font-black uppercase tracking-wider ${brand.badgeBg} border ${brand.borderColor} px-3.5 py-1 rounded-full`}>
                {listing.platform}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-white leading-relaxed">
              {listing.title}
            </h1>

            {/* Author / Date info line */}
            <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold border-b border-zinc-900 pb-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-650" />
                <span className="text-zinc-400">{listing.sellerInfo}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-655" />
                <span>Listed: {new Date(listing.createdAt || Date.now()).toLocaleDateString([], { dateStyle: 'medium' })}</span>
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-zinc-300 font-extrabold text-[10px] uppercase tracking-widest">Asset Details</h4>
              <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-line bg-zinc-950/60 p-4 rounded-xl border border-zinc-900/60 font-semibold">
                {listing.description}
              </p>
            </div>

            {/* Dynamic Specs details list */}
            {listing.specs && Object.keys(listing.specs).length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-zinc-300 font-extrabold text-[10px] uppercase tracking-widest">Specifications</h4>
                <div className="grid grid-cols-2 gap-4 bg-zinc-950/30 border border-zinc-900/60 p-4 rounded-xl">
                  {Object.entries(listing.specs).map(([key, value]) => {
                    if (value === undefined || value === null || value === '') return null;
                    
                    // User friendly spec mappings
                    let displayKey = key;
                    if (key === 'age') displayKey = 'validity';
                    if (key === 'deliveryTime') displayKey = 'delivery speed';
                    if (key === 'monetized') displayKey = 'monetization status';
                    if (key === 'followers') displayKey = 'stats / volume';
                    if (key === 'revisionCount') displayKey = 'revision count';

                    let displayVal = value;
                    if (typeof value === 'boolean') {
                      displayVal = value ? 'Approved / Active Adsense' : 'Inactive';
                    }

                    // Format links inside specifications
                    if (key === 'profileLink' && typeof value === 'string') {
                      return (
                        <div key={key} className="col-span-2 space-y-1 bg-zinc-950 border border-zinc-900 p-2.5 rounded-lg mt-1">
                          <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-black block">Profile Redirect URL Link</span>
                          <a
                            href={value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs font-extrabold ${brand.textColor} hover:underline inline-flex items-center gap-1 cursor-pointer`}
                          >
                            <span>Open URL Link: {value}</span>
                          </a>
                        </div>
                      );
                    }

                    return (
                      <div key={key} className="space-y-0.5">
                        <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-black block">{displayKey}</span>
                        <span className="text-xs font-bold text-white capitalize">{displayVal}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Safe Pay trust shield card */}
          <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl flex items-start gap-4 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-accent-green/5 border border-accent-green/10 flex items-center justify-center shrink-0 text-accent-green shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Safe Pay Lock Protection Active</h4>
              <p className="text-zinc-500 text-[11px] leading-normal font-semibold">
                Your money is protected. We release the payment to the seller only after you verify and confirm the login credentials. Refund is instant if the handover fails.
              </p>
            </div>
          </div>

        </div>

        {/* Right Side: Sticky Checkout Box & High-Conversion Trust Points */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0c0c0d] border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-xl sticky top-6">
            
            {/* Price section */}
            <div className="border-b border-zinc-900 pb-5">
              <span className="text-zinc-500 text-[9px] uppercase font-black tracking-widest block">Handover Price</span>
              <div className="flex items-baseline gap-2 mt-1">
                {hasDiscount && (
                  <span className="text-zinc-550 line-through text-xs font-semibold">
                    ₹{listing.price}
                  </span>
                )}
                <span className={`text-3xl font-black ${brand.textColor}`}>
                  ₹{finalPrice}
                </span>
                {hasDiscount && (
                  <span className="text-[9px] font-black text-black bg-accent-green px-2 py-0.5 rounded shadow animate-pulse">
                    -{listing.discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-[9px] text-zinc-500 mt-2 font-semibold">
                No hidden fees. Safe Pay protection coverage is included.
              </p>
            </div>

            {/* expected handovers */}
            <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-900/60 p-3.5 rounded-xl text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-accent-green shrink-0 animate-pulse" />
              <div>
                <p className="text-white text-[11px]">Guaranteed Handover Speed</p>
                <p className="text-zinc-500 text-[10px]">Within {listing.specs?.deliveryTime || '24 Hours'}</p>
              </div>
            </div>

            {/* Checkouts CTA triggers */}
            <div className="space-y-3 shrink-0">
              <button
                onClick={handleCheckoutNow}
                className="w-full bg-accent-green hover:bg-accent-green-hover text-black font-black text-xs py-4 rounded-xl transition-all cursor-pointer text-center uppercase tracking-widest shadow-lg shadow-accent-green/10"
              >
                Checkout Now
              </button>

              <button
                onClick={handleCartAction}
                className={`w-full font-extrabold text-xs py-4 rounded-xl transition-all border cursor-pointer text-center ${
                  isInCart
                    ? 'bg-red-950/10 border-red-900/40 hover:bg-red-950/20 text-red-400'
                    : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white'
                }`}
              >
                {isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </button>
            </div>

            {/* Buyer Conversion Trust Checklist */}
            <div className="bg-zinc-950/40 border border-zinc-900/60 p-4 rounded-xl space-y-2.5">
              <h5 className="text-[9px] uppercase tracking-widest text-zinc-400 font-extrabold">Why Purchase Here?</h5>
              <ul className="space-y-2 text-[10px] text-zinc-500 font-bold">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-accent-green shrink-0" />
                  <span>100% Verified Credentials Guarantee</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-accent-green shrink-0" />
                  <span>Safe Pay hold protection active</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-accent-green shrink-0" />
                  <span>Expert verified transfer handles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-accent-green shrink-0" />
                  <span>Instant refund if transfer fails</span>
                </li>
              </ul>
            </div>

            {/* Chat Help redirection link */}
            <div className="pt-2">
              <button
                onClick={() => onNavigate('contact')}
                className="w-full py-2.5 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 text-zinc-400 hover:text-white transition-all text-[11px] font-black uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-accent-green" />
                <span>Ask Operator a Question</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
