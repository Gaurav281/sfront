import React from 'react';
import { ShieldCheck, ArrowLeft, Plus, Trash, Clock, User, Sparkles, AlertCircle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAlertStore } from '../store/useAlertStore';

export default function ItemDetail({ listing, onNavigate }) {
  const { addToCart, items, removeFromCart } = useCartStore();
  const addToast = useAlertStore((state) => state.addToast);

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center select-none space-y-4">
        <div className="bg-card-dark border border-zinc-700/80 p-8 rounded-2xl space-y-4 shadow-xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Item Not Found</h2>
          <p className="text-zinc-400 text-xs">This listing may have been sold or removed from the catalog.</p>
          <button
            onClick={() => onNavigate('shop')}
            className="w-full bg-accent-green hover:bg-accent-green-hover text-black font-extrabold text-xs py-2.5 rounded-xl transition-all"
          >
            Back to Shop
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

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-6 select-none space-y-6 animate-fade-in">
      {/* Back link button */}
      <div>
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </button>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Listing details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card-dark border border-zinc-700/80 p-6 rounded-2xl space-y-5 shadow-xl">
            {/* Tag / Category details */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-accent-green bg-accent-green/5 border border-accent-green/10 px-3 py-1 rounded-full">
                {listing.category}
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                {listing.platform}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-white leading-normal">
              {listing.title}
            </h1>

            {/* Author / Date info line */}
            <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold border-b border-zinc-900 pb-4 flex-wrap">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-zinc-600" />
                <span>{listing.sellerInfo}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-600" />
                <span>Listed: {new Date(listing.createdAt || Date.now()).toLocaleDateString([], { dateStyle: 'medium' })}</span>
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-zinc-300 font-extrabold text-xs uppercase tracking-widest">Asset Details</h4>
              <p className="text-zinc-400 text-xs leading-relaxed whitespace-pre-line bg-zinc-950/60 p-4 rounded-xl border border-zinc-900/60">
                {listing.description}
              </p>
            </div>

            {/* Dynamic Specs list */}
            {listing.specs && Object.keys(listing.specs).length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-zinc-300 font-extrabold text-xs uppercase tracking-widest">Specifications</h4>
                <div className="grid grid-cols-2 gap-3 bg-zinc-950/20 border border-zinc-900/40 p-4 rounded-xl">
                  {Object.entries(listing.specs).map(([key, value]) => {
                    if (value === undefined || value === null || value === '') return null;
                    
                    // Simplify keys into user-friendly names
                    let displayKey = key;
                    if (key === 'age') displayKey = 'validity';
                    if (key === 'deliveryTime') displayKey = 'delivery speed';
                    if (key === 'monetized') displayKey = 'monetized';
                    if (key === 'followers') displayKey = 'volume';
                    if (key === 'revisionCount') displayKey = 'revisions';

                    // Convert boolean value to Yes/No
                    let displayVal = value;
                    if (typeof value === 'boolean') {
                      displayVal = value ? 'Approved / Active' : 'No';
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

          {/* Simple English Security CTA section */}
          <div className="bg-zinc-950 border border-zinc-700/80 p-5 rounded-2xl flex items-start gap-4 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-accent-green/5 border border-accent-green/10 flex items-center justify-center shrink-0 text-accent-green">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-white uppercase tracking-widest">Safe Pay Lock active</h4>
              <p className="text-zinc-400 text-xs leading-normal">
                Your money is safe. We release the payment only after you receive the credentials. Refund is instant if delivery fails.
              </p>
            </div>
          </div>

        </div>

        {/* Right Side: Price Box & CTA button */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card-dark border border-zinc-700/80 p-6 rounded-2xl space-y-6 shadow-xl">
            
            {/* Price display block */}
            <div className="border-b border-zinc-900 pb-4">
              <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest block">Checkout Price</span>
              <div className="flex items-baseline gap-2 mt-1">
                {hasDiscount && (
                  <span className="text-zinc-500 line-through text-sm font-semibold">
                    ₹{listing.price}
                  </span>
                )}
                <span className="text-3xl font-black text-accent-green">
                  ₹{finalPrice}
                </span>
                {hasDiscount && (
                  <span className="text-[10px] font-black text-black bg-accent-green px-2 py-0.5 rounded shadow">
                    -{listing.discount}% OFF
                  </span>
                )}
              </div>
              <p className="text-[9px] text-zinc-500 mt-2 font-medium">
                Tax & instant credentials delivery are covered in checkout.
              </p>
            </div>

            {/* Delivery speed preview */}
            <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-900/60 p-3 rounded-xl text-xs">
              <Sparkles className="w-4 h-4 text-accent-green shrink-0 animate-pulse" />
              <div>
                <p className="font-bold text-white">Expected Handovers</p>
                <p className="text-zinc-500 text-[10px]">Within {listing.specs?.deliveryTime || '24 Hours'}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3.5">
              <button
                onClick={handleCheckoutNow}
                className="w-full bg-accent-green hover:bg-accent-green-hover text-black font-black text-xs py-3.5 rounded-xl transition-all cursor-pointer text-center uppercase tracking-wider"
              >
                Checkout Now
              </button>

              <button
                onClick={handleCartAction}
                className={`w-full font-bold text-xs py-3.5 rounded-xl transition-all border cursor-pointer text-center ${
                  isInCart
                    ? 'bg-zinc-900 border-red-900/50 hover:bg-red-950/20 text-red-400'
                    : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900 text-white'
                }`}
              >
                {isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
