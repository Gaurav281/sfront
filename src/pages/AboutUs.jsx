import React from 'react';
import { ShieldCheck, Users, BadgeCheck, FileText } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 select-none">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          About <span className="text-accent-green">DigiVault</span>
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto leading-relaxed">
          India's trusted secure store to buy verified Instagram accounts, YouTube channels, streaming subscriptions, and expert digital services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Value 1 */}
        <div className="bg-card-dark border border-border-dark p-6 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-accent-green/10 border border-accent-green/20 flex items-center justify-center text-accent-green">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Secure Payment Lock (Paisa Safe Rahega)</h3>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Humara Safe Pay Lock ensure karta hai ki aapka paisa secure rahe. Jab tak aap login details check karke confirm nahi karte ki sab sahi hai, tab tak seller ko payment nahi jaati. Agar delivery nahi milti toh full refund instantly mil jayega.
          </p>
        </div>

        {/* Value 2 */}
        <div className="bg-card-dark border border-border-dark p-6 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-accent-green/10 border border-accent-green/20 flex items-center justify-center text-accent-green">
            <BadgeCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Strict Quality Verification</h3>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Platform par listed har social page ya service ki quality ko manually verify kiya jata hai. Real followers history, page health, copyright claims aur active adsense eligibility ko check karne ke baad hi catalog me add karte hain.
          </p>
        </div>

        {/* Value 3 */}
        <div className="bg-card-dark border border-border-dark p-6 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-accent-green/10 border border-accent-green/20 flex items-center justify-center text-accent-green">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Swift Handovers Support</h3>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Orders complete karne ke liye humari team khud support provide karti hai. Purchase ke baad humare operators telegram/discord par coordinate karke original email aur login safety code share karate hain.
          </p>
        </div>

        {/* Value 4 */}
        <div className="bg-card-dark border border-border-dark p-6 rounded-xl space-y-3">
          <div className="w-10 h-10 rounded-lg bg-accent-green/10 border border-accent-green/20 flex items-center justify-center text-accent-green">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Transparent Prices (No Extra Charges)</h3>
          <p className="text-zinc-400 text-xs leading-relaxed">
            Koi hidden transaction cost nahi hai. Jo price card par dikhta hai, aapko wahi amount pay karni hoti hai. We maintain complete transparency on all deals.
          </p>
        </div>
      </div>

      <div className="bg-zinc-950 border border-border-dark p-8 rounded-xl text-center space-y-3">
        <p className="text-sm font-semibold text-white italic">
          "Indian creators aur digital businesses ke liye humne sabse safe system banaya hai taaki scams aur recovery frauds ko khatam kiya ja sake."
        </p>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
          - DigiVault India Team
        </p>
      </div>
    </div>
  );
}
