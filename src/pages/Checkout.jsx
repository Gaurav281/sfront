import React, { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldCheck, CheckCircle, CreditCard, ArrowRight, Smartphone, QrCode, Check } from 'lucide-react';
import apiClient from '../api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';

export default function Checkout({ onNavigate }) {
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { user, updateUserProfileState } = useAuthStore();

  const [email, setEmail] = useState(user?.email || '');
  const [fullName, setFullName] = useState(user?.name || '');
  const [discordOrTelegram, setDiscordOrTelegram] = useState(user?.discordOrTelegram || '');
  
  // UPI-specific states
  const [paymentOption, setPaymentOption] = useState('app'); // 'app' or 'qr'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay'); // 'gpay', 'paytm', 'phonepe'
  const [upiId, setUpiId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Autofill if user profile loads later
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name || '');
      if (!email) setEmail(user.email || '');
      if (!discordOrTelegram) setDiscordOrTelegram(user.discordOrTelegram || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    // Custom validation
    if (paymentOption === 'app' && !upiId) {
      setError('Please enter your UPI ID');
      return;
    }
    if (paymentOption === 'qr' && !utrNumber) {
      setError('Please enter the 12-digit UTR/Transaction Reference Number');
      return;
    }
    if (paymentOption === 'qr' && utrNumber.length < 6) {
      setError('Invalid UTR Number. Must enter a valid transaction reference.');
      return;
    }

    setLoading(true);
    setError(null);

    const orderPayload = {
      email,
      billingDetails: {
        fullName,
        discordOrTelegram,
        paymentMethod: `UPI: ${paymentOption === 'app' ? selectedUpiApp.toUpperCase() + ' (' + upiId + ')' : 'QR Code (UTR: ' + utrNumber + ')'}`,
      },
      items: items.map((item) => ({
        listing: item._id,
        title: item.title,
        price: item.price,
        category: item.category,
      })),
      totalAmount: getTotalPrice(),
    };

    try {
      // Simulate verification spinner
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const response = await apiClient.post('/orders', orderPayload);
      if (response.data.success) {
        setOrderSuccess(response.data.order);
        
        // Auto-save handle if changed or empty in user profile
        if (user && (discordOrTelegram !== user.discordOrTelegram || fullName !== user.name)) {
          try {
            const profileRes = await apiClient.put('/auth/profile', {
              name: fullName,
              discordOrTelegram: discordOrTelegram
            });
            updateUserProfileState(profileRes.data);
          } catch (profileErr) {
            console.error('Failed to auto-save handle:', profileErr);
          }
        }

        clearCart();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center select-none">
        <div className="bg-card-dark border border-border-dark p-8 rounded-2xl space-y-6 shadow-xl flex flex-col items-center">
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1.2, 0.9, 1], opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 rounded-full bg-emerald-500/10 border border-accent-green/30 flex items-center justify-center text-accent-green"
          >
            <CheckCircle className="w-12 h-12 stroke-[2]" />
          </motion.div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">UPI Payment Successful</h2>
            <p className="text-accent-green font-bold text-xs uppercase tracking-widest">Transaction Verified</p>
            <p className="text-zinc-500 text-[10px]">UTR/Ref: {orderSuccess._id?.substring(16).toUpperCase()}</p>
            
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mx-auto pt-2">
              Thank you! Your payment is safe in our **Secure Pay Lock**. Our delivery team will contact you on <span className="text-white font-bold">{orderSuccess.billingDetails?.discordOrTelegram}</span> within 1-2 hours to hand over the login details.
            </p>
          </div>

          <div className="w-full bg-zinc-950 border border-zinc-900/60 p-4 rounded-xl text-left space-y-2 text-xs">
            <div className="flex justify-between items-center text-zinc-500">
              <span>Paid to</span>
              <span className="text-zinc-300 font-bold">Digital Service Pro Protection Hub</span>
            </div>
            <div className="flex justify-between items-center text-zinc-500">
              <span>Delivery Handle</span>
              <span className="text-zinc-300 font-semibold">{orderSuccess.billingDetails?.discordOrTelegram}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-500 border-t border-zinc-900 pt-2 mt-2">
              <span className="font-bold text-white">Amount Paid</span>
              <span className="text-accent-green font-extrabold text-sm">${orderSuccess.totalAmount}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-accent-green hover:bg-accent-green-hover text-black font-extrabold text-xs py-3 rounded-xl transition-all cursor-pointer mt-4"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 select-none">
      <h1 className="text-2xl md:text-3xl font-black text-white mb-8 text-center">
        Secure Delivery <span className="text-accent-green">Checkout</span>
      </h1>

      {items.length === 0 ? (
        <div className="bg-card-dark border border-border-dark p-12 rounded-2xl text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-zinc-900/80 border border-border-dark flex items-center justify-center text-zinc-500 mx-auto">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <p className="font-semibold text-white">Your checkout is empty</p>
            <p className="text-zinc-500 text-xs mt-1">Add items to proceed.</p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-accent-green hover:bg-accent-green-hover text-black text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
          >
            Go to Shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header block */}
            <div className="bg-card-dark border border-border-dark p-6 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-accent-green text-xs">
                  DSP
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Paying Merchant</p>
                  <h2 className="text-sm font-bold text-white">Digital Service Pro Secured Payments</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Total Bill</p>
                <h3 className="text-xl font-black text-accent-green">${getTotalPrice()}</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-card-dark border border-border-dark p-6 sm:p-8 rounded-2xl space-y-6">
              
              {/* Delivery Inputs */}
              <div className="space-y-4">
                <h3 className="text-white font-extrabold text-xs uppercase tracking-wider pb-2 border-b border-zinc-900">
                  1. Delivery Details
                </h3>
                
                {error && (
                  <div className="bg-red-950/40 border border-red-900/50 text-red-400 text-xs p-3 rounded-xl font-medium">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent-green/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent-green/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">Discord / Telegram username</label>
                  <input
                    type="text"
                    required
                    value={discordOrTelegram}
                    onChange={(e) => setDiscordOrTelegram(e.target.value)}
                    placeholder="e.g. @tele_handle or DiscordName#1234"
                    className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent-green/50"
                  />
                  <span className="text-[9px] text-zinc-500 block leading-normal pt-1">
                    Enter details carefully. Our dispatchers will contact you here to securely deliver account details.
                  </span>
                </div>
              </div>

              {/* UPI Payment Gateway Selector */}
              <div className="space-y-4 pt-2">
                <h3 className="text-white font-extrabold text-xs uppercase tracking-wider pb-2 border-b border-zinc-900">
                  2. Select UPI Payment Route
                </h3>

                {/* Toggle App or QR */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentOption('app')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      paymentOption === 'app'
                        ? 'bg-accent-green/10 border-accent-green text-accent-green'
                        : 'bg-zinc-950 border-border-dark text-zinc-400 hover:border-zinc-800'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Pay via UPI App</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentOption('qr')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      paymentOption === 'qr'
                        ? 'bg-accent-green/10 border-accent-green text-accent-green'
                        : 'bg-zinc-950 border-border-dark text-zinc-400 hover:border-zinc-800'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Scan QR Code</span>
                  </button>
                </div>

                {/* Form options conditionally rendered */}
                <AnimatePresence mode="wait">
                  {paymentOption === 'app' ? (
                    <motion.div
                      key="app"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4 pt-2"
                    >
                      {/* App selectors */}
                      <div className="grid grid-cols-3 gap-3">
                        <div
                          onClick={() => setSelectedUpiApp('gpay')}
                          className={`border p-3.5 rounded-xl cursor-pointer flex flex-col items-center gap-2 transition-all ${
                            selectedUpiApp === 'gpay'
                              ? 'border-blue-500 bg-blue-500/5 text-white'
                              : 'border-border-dark bg-zinc-950/40 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-[#1A73E8] flex items-center justify-center text-white font-extrabold text-[10px] tracking-wider shadow">
                            G Pay
                          </div>
                          <span className="text-[10px] font-bold">Google Pay</span>
                        </div>

                        <div
                          onClick={() => setSelectedUpiApp('paytm')}
                          className={`border p-3.5 rounded-xl cursor-pointer flex flex-col items-center gap-2 transition-all ${
                            selectedUpiApp === 'paytm'
                              ? 'border-cyan-500 bg-cyan-500/5 text-white'
                              : 'border-border-dark bg-zinc-950/40 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-[#00B9F5] flex items-center justify-center text-white font-black text-xs shadow">
                            Paytm
                          </div>
                          <span className="text-[10px] font-bold">Paytm</span>
                        </div>

                        <div
                          onClick={() => setSelectedUpiApp('phonepe')}
                          className={`border p-3.5 rounded-xl cursor-pointer flex flex-col items-center gap-2 transition-all ${
                            selectedUpiApp === 'phonepe'
                              ? 'border-purple-500 bg-purple-500/5 text-white'
                              : 'border-border-dark bg-zinc-950/40 text-zinc-500 hover:border-zinc-800'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-[#5F259F] flex items-center justify-center text-white font-black text-xs shadow">
                            Pe
                          </div>
                          <span className="text-[10px] font-bold">PhonePe</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">
                          Enter UPI ID / VPA
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile-number@ybl or name@okaxis"
                          className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent-green/50"
                        />
                        <span className="text-[9px] text-zinc-500 block leading-normal pt-1">
                          We will send a payment request to your selected UPI app. Please verify and pay inside the app.
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="qr"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="flex flex-col sm:flex-row items-center gap-5 bg-zinc-950 border border-border-dark p-4 rounded-xl">
                        <img
                          src="/mock_qr_code.jpg"
                          alt="UPI Payment QR Code"
                          className="w-36 h-36 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0"
                        />
                        <div className="space-y-2 text-xs leading-relaxed">
                          <p className="font-bold text-white flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green text-[10px] flex items-center justify-center font-bold">
                              1
                            </span>
                            Scan QR Code to Pay
                          </p>
                          <p className="text-zinc-400 text-[11px]">
                            Scan the QR code using any UPI app (Google Pay, Paytm, PhonePe, Bhim, or banking apps).
                          </p>
                          <p className="text-zinc-400 text-[11px] font-bold text-white">
                            Amount: ${getTotalPrice()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-400">
                          12-Digit Transaction ID / UTR Reference
                        </label>
                        <input
                          type="text"
                          value={utrNumber}
                          onChange={(e) => setUtrNumber(e.target.value)}
                          placeholder="Enter UTR / Ref Number"
                          className="w-full bg-zinc-950 border border-border-dark text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-accent-green/50"
                        />
                        <span className="text-[9px] text-zinc-500 block leading-normal pt-1">
                          Copy the Ref/UTR code from your UPI app receipt to confirm pay verification.
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-accent-green hover:bg-accent-green-hover disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-extrabold text-xs py-3.5 rounded-xl transition-all cursor-pointer mt-4"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Verifying UPI Transaction...</span>
                  </div>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3px]" />
                    <span>Submit Payment Verification</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Cart items list */}
          <div className="lg:col-span-5 bg-card-dark border border-border-dark p-6 rounded-2xl space-y-6">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-wider pb-3 border-b border-border-dark">
              Order Summary
            </h3>

            <div className="divide-y divide-border-dark overflow-y-auto max-h-[220px] pr-2 space-y-3">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between items-center text-xs pt-3 first:pt-0">
                  <div>
                    <span className="text-[9px] text-accent-green font-bold bg-accent-green/5 border border-accent-green/10 px-1.5 py-0.5 rounded">
                      {item.platform}
                    </span>
                    <p className="font-semibold text-white mt-1.5 max-w-[200px] truncate">{item.title}</p>
                    <p className="text-[10px] text-zinc-500">{item.category}</p>
                  </div>
                  <span className="text-zinc-300 font-bold">${item.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border-dark pt-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-semibold">Total Price</span>
                <span className="text-md font-extrabold text-white">${getTotalPrice()}</span>
              </div>
            </div>

            {/* Secure transaction info */}
            <div className="bg-zinc-950 border border-zinc-900/60 p-4 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
              <div className="text-[10px] text-zinc-500 space-y-1.5 leading-normal">
                <p className="font-bold text-white uppercase tracking-wider">UPI Safe Lock Guarantee</p>
                <p>
                  **Aapka paisa safe rahega.** Payment will only release to the seller once you confirm credentials delivery. Refund is instant if the seller fails to deliver within the window.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
