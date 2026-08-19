import React from 'react';
import { Search, ShieldAlert, Users, CheckCircle, RotateCcw } from 'lucide-react';

export default function AboutUs() {
  const steps = [
    {
      num: '1',
      title: 'Select Asset',
      desc: 'Find your verified social page, streaming plan, or service in the shop.',
      icon: <Search className="w-5 h-5 text-pink-500" />,
    },
    {
      num: '2',
      title: 'Lock Payment',
      desc: 'Pay using GPay, Paytm, or PhonePe. Money is locked safely in our system.',
      icon: <ShieldAlert className="w-5 h-5 text-accent-green" />,
    },
    {
      num: '3',
      title: 'Coordinated Delivery',
      desc: 'Our support team chats with you on Discord/Telegram to hand over logins.',
      icon: <Users className="w-5 h-5 text-blue-400" />,
    },
    {
      num: '4',
      title: 'Verify & Release',
      desc: 'Log in, check details, change passwords, and click confirm to complete.',
      icon: <CheckCircle className="w-5 h-5 text-purple-400" />,
    },
    {
      num: '5',
      title: 'Refund Protection',
      desc: 'If delivery fails or issues arise, get a 100% money-back refund instantly.',
      icon: <RotateCcw className="w-5 h-5 text-orange-400" />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 select-none space-y-12 animate-fade-in">
      
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          How <span className="text-accent-green">Digital Service Pro</span> Works
        </h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          We ensure safe digital trades. Here is our direct 5-step protection process.
        </p>
      </div>

      {/* Transaction flow step-by-step cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div
            key={step.num}
            className="bg-card-dark border border-border-dark p-6 rounded-2xl flex flex-col justify-between space-y-5 relative overflow-hidden"
          >
            {/* Absolute card number */}
            <span className="absolute top-2 right-4 text-4xl font-black text-zinc-900/30 select-none">
              0{step.num}
            </span>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                {step.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">{step.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed font-medium">{step.desc}</p>
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
      <div className="bg-zinc-950 border border-border-dark p-6 rounded-2xl text-center shadow-lg">
        <p className="text-sm font-bold text-white leading-normal">
          Aapka Paisa Safe Lock Me Rahega. Payment is released only after you check the account logins.
        </p>
      </div>

    </div>
  );
}
