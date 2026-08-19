import React from 'react';

export default function TermsConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 select-none">
      <h1 className="text-3xl font-extrabold text-white mb-4 text-center">
        Terms & <span className="text-accent-green">Conditions</span>
      </h1>
      <p className="text-zinc-500 text-xs mb-8 text-center">Last Updated: August 2026</p>

      <div className="bg-card-dark border border-border-dark p-6 sm:p-8 rounded-xl space-y-6 text-zinc-300 text-xs leading-relaxed">
        
        {/* Term 1 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            1. Secure Payments Lock (Aapka Paisa Safe Hai)
          </h3>
          <p>
            Humara platform **Secure Payment Hold System** use karta hai. Jab aap checkout karte hain aur payment pay karte hain, toh aapka paisa DigiVault ke safe vault me lock ho jata hai. 
          </p>
          <p>
            Payment seller ko tabhi milti hai jab aapko product (social media page details, streaming key ya service deliverables) mil jaye aur aap use inspect karke satisfaction confirm karein.
          </p>
        </section>

        {/* Term 2 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            2. Swift Handovers & Delivery Guarantee (24 Hours Rules)
          </h3>
          <p>
            Order complete hote hi, seller ko **24 Hours** ke andar credentials ya service complete karke handover karna padega. 
          </p>
          <p>
            Humare support executives transfer process coordinate karenge. Agar seller 24 hours me details transfer nahi karta, toh order cancel ho jayega aur aapko **100% Full Refund** directly aapke original UPI payment bank account me mil jayega.
          </p>
        </section>

        {/* Term 3 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            3. Protection Against Recovery Scams (No Fake Accounts)
          </h3>
          <p>
            Hum duplicate ya bot-followers wale social accounts ban karte hain. Agar koi seller account deliver karne ke baad use recover (pull-back) karne ki koshish karta hai, toh uski payment cancel kar di jayegi aur account hamesha ke liye block ho jayega.
          </p>
        </section>

        {/* Term 4 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            4. Simple Refunds Policy
          </h3>
          <p>
            Agar verification fail hoti hai ya credentials delivery complete nahi hoti, toh refunds instant start kiye jaate hain. Refund transactions aapke UPI ID or net banking router se hotey hue 1-2 business days me return ho jaate hain.
          </p>
        </section>

        {/* Term 5 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            5. Support & Contact
          </h3>
          <p>
            Kisi bhi trade issue, dispute ya verification code delivery ke liye, aap direct humare **Support Chat** desk par message kar sakte hain. Humari team aapko help karne ke liye available hai.
          </p>
        </section>

      </div>
    </div>
  );
}
