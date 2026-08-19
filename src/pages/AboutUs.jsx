import React from 'react';
import { Search, ShieldAlert, Users, CheckCircle, RotateCcw } from 'lucide-react';

export default function AboutUs() {
  const steps = [
    {
      num: '1',
      title: 'Select Your Asset',
      desc: 'Browse through our catalog of verified Instagram accounts, YouTube channels, streaming subscriptions, or graphics services. Choose the one that fits your need.',
      icon: <Search className="w-5 h-5 text-pink-500" />,
    },
    {
      num: '2',
      title: 'Lock Payment Securely',
      desc: 'Pay using Google Pay, Paytm, or PhonePe. Your money is safely locked by Digital Service Pro. It is NOT given to the seller until you verify the details.',
      icon: <ShieldAlert className="w-5 h-5 text-accent-green" />,
    },
    {
      num: '3',
      title: 'Coordinate Delivery',
      desc: 'Our support agents will contact you on Discord or Telegram to deliver the original email, password, and security codes for the account.',
      icon: <Users className="w-5 h-5 text-blue-400" />,
    },
    {
      num: '4',
      title: 'Verify & Release',
      desc: 'Log in, check the account, and change the security credentials. Once you are satisfied that everything is correct, click confirm to release the payment to the seller.',
      icon: <CheckCircle className="w-5 h-5 text-purple-400" />,
    },
    {
      num: '5',
      title: 'Scam Protection Guarantee',
      desc: 'If the seller fails to deliver within 24 hours, or tries to recover the account later, the deal is cancelled and you get a 100% instant refund.',
      icon: <RotateCcw className="w-5 h-5 text-orange-400" />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 select-none space-y-12">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          How <span className="text-accent-green">Digital Service Pro</span> Works
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
          We make buying and selling digital assets safe and simple. Here is the step-by-step process of how we protect your money and ensure successful transfers.
        </p>
      </div>

      {/* Transaction flow step-by-step cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div
            key={step.num}
            className="bg-card-dark border border-border-dark p-6 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden"
          >
            {/* Absolute card number in corner */}
            <span className="absolute top-2 right-4 text-4xl font-black text-zinc-900/40 select-none">
              0{step.num}
            </span>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                {step.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{step.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>

            <div className="pt-2 text-[10px] text-accent-green font-semibold uppercase tracking-wider flex items-center gap-1.5 border-t border-zinc-900">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span>
              <span>Protected Step</span>
            </div>
          </div>
        ))}
      </div>

      {/* Security seal block */}
      <div className="bg-zinc-950 border border-border-dark p-8 rounded-2xl text-center space-y-3">
        <p className="text-sm font-semibold text-white">
          Aapka Paisa Safe Hai. We keep your payments locked until you receive what you paid for.
        </p>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
          Digital Service Pro Protection Policy
        </p>
      </div>

    </div>
  );
}
