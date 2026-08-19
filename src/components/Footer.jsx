import React from 'react';
import { ShieldAlert, CreditCard, Clock, CheckCircle } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-zinc-950 border-t border-border-dark py-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Triple trust factor badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-border-dark">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent-green shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Verified Assets</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Strict platform quality audits</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent-green shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Safe Pay Hold</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Payment safe lock or money back</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent-green shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Swift Delivery</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Typically done in &lt;24 hours</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-accent-green shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Easy UPI Transfer</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">Google Pay, Paytm, PhonePe support</p>
            </div>
          </div>
        </div>

        {/* Lower Links & Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-accent-green flex items-center justify-center font-black text-black text-sm">
              Ω
            </div>
            <span className="text-white font-extrabold text-sm tracking-wider uppercase">
              DIGITAL<span className="text-accent-green"> SERVICE PRO</span>
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-zinc-500">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">Shop</button>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About Us</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Support Chat</button>
            <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">Terms of Service</button>
          </div>

          <p className="text-[10px] text-zinc-600">
            © {new Date().getFullYear()} Digital Service Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
