import React from 'react';

export default function TermsConditions() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 select-none">
      <h1 className="text-3xl font-extrabold text-white mb-4 text-center">
        Terms of <span className="text-accent-green">Service</span>
      </h1>
      <p className="text-zinc-500 text-xs mb-8 text-center">Last Updated: August 2026</p>

      <div className="bg-card-dark border border-border-dark p-6 sm:p-8 rounded-xl space-y-6 text-zinc-300 text-xs leading-relaxed">
        
        {/* Term 1 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            1. Safe Payment Lock
          </h3>
          <p>
            When you purchase any account or digital service, your money is held safely in our platform lock. We do not release the money to the seller immediately.
          </p>
          <p>
            The seller will only get paid after you receive your login details, check everything, and click "Confirm Delivery" on the platform.
          </p>
        </section>

        {/* Term 2 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            2. 24-Hour Delivery Policy
          </h3>
          <p>
            Sellers must deliver the account access details or service deliverables within 24 hours of your purchase. 
          </p>
          <p>
            Our support agents will coordinate the transfer via your Discord or Telegram handle. If the seller fails to deliver within 24 hours, the order is cancelled.
          </p>
        </section>

        {/* Term 3 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            3. Instant Refunds
          </h3>
          <p>
            If the seller does not deliver the account, or if the account details are incorrect, the order will be cancelled immediately.
          </p>
          <p>
            In case of cancellation, you will receive a 100% refund of your money. The refund will be credited directly back to your bank account via your original payment method.
          </p>
        </section>

        {/* Term 4 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            4. Protection Against Recovery Scams
          </h3>
          <p>
            Sellers are strictly forbidden from trying to take back or recover an account after selling it. 
          </p>
          <p>
            If a seller recovers an account post-sale, their pending funds will be permanently blocked, their account will be banned, and we will assist the buyer in resolving the dispute.
          </p>
        </section>

        {/* Term 5 */}
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            5. Support Desk
          </h3>
          <p>
            If you face any issues during the delivery process or have questions before purchasing, you can message our team directly using the Support Chat tab.
          </p>
        </section>

      </div>
    </div>
  );
}
