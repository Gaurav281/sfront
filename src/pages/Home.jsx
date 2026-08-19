import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, ArrowRight, Instagram, Youtube, Tv, Search, Palette } from 'lucide-react';
import apiClient from '../api/apiClient';
import Card from '../components/Card';
import SkeletonLoader from '../components/SkeletonLoader';

export default function Home({ onNavigate, onFilterCategory, onViewDetails }) {
  // Tanstack Query to pull recent 3 listings
  const { data: listings, isLoading } = useQuery({
    queryKey: ['recentListings'],
    queryFn: async () => {
      const res = await apiClient.get('/listings?limit=3');
      // Limit to 3 items
      return res.data.slice(0, 3);
    },
  });

  // Hardcoded main categories configured with brand-themed hover color classes
  const categories = [
    {
      name: 'Instagram Accounts',
      description: 'Niche specific pages with real, highly active followers.',
      icon: <Instagram className="w-6 h-6 text-pink-500" />,
      tag: 'Instagram Accounts',
      hoverBorder: 'hover:border-pink-500/60 hover:shadow-pink-500/10 group-hover:text-pink-400',
      iconBg: 'group-hover:bg-pink-500/10 group-hover:border-pink-500/20',
      textColor: 'group-hover:text-pink-400'
    },
    {
      name: 'YouTube Channels',
      description: 'Monetized partnership channels with active subscriber bases.',
      icon: <Youtube className="w-6 h-6 text-red-500" />,
      tag: 'YouTube Channels',
      hoverBorder: 'hover:border-red-500/60 hover:shadow-red-500/10 group-hover:text-red-400',
      iconBg: 'group-hover:bg-red-500/10 group-hover:border-red-500/20',
      textColor: 'group-hover:text-red-400'
    },
    {
      name: 'TikTok Accounts',
      description: 'Viral gaming, lifestyle, and dancing profiles with creator fund.',
      icon: (
        <svg className="w-6 h-6 text-cyan-400 fill-current" viewBox="0 0 24 24">
          <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.88 2.85 2.1 3.59.83.5 1.78.73 2.73.74v3.29c-1.34 0-2.62-.38-3.72-1.11-.29-.19-.55-.41-.79-.65v7.02c0 3.76-2.3 7.12-6 8.04-3.7.92-7.61-1.01-9-4.55C.42 12.83 2.1 8.7 5.75 7.55c.78-.25 1.6-.33 2.42-.25v3.39c-.83-.22-1.72-.08-2.46.4-.95.62-1.48 1.71-1.38 2.83.1 1.13.8 2.1 1.83 2.53.97.4 2.1.2 2.87-.5.53-.48.77-1.16.76-1.87.01-2.58.01-9.98.01-12.55.59-.44 1.17-.9 1.73-1.53z" />
        </svg>
      ),
      tag: 'TikTok Accounts',
      hoverBorder: 'hover:border-cyan-400/60 hover:shadow-cyan-400/10 group-hover:text-cyan-400',
      iconBg: 'group-hover:bg-cyan-400/10 group-hover:border-cyan-400/20',
      textColor: 'group-hover:text-cyan-400'
    },
    {
      name: 'Streaming Accounts',
      description: 'Private Netflix UHD, Spotify, and premium entertainment keys.',
      icon: <Tv className="w-6 h-6 text-emerald-400" />,
      tag: 'Streaming Accounts',
      hoverBorder: 'hover:border-emerald-400/60 hover:shadow-emerald-400/10 group-hover:text-emerald-400',
      iconBg: 'group-hover:bg-emerald-400/10 group-hover:border-emerald-400/20',
      textColor: 'group-hover:text-emerald-400'
    },
    {
      name: 'SEO Services',
      description: 'White-hat backlink guest posts, content setups, and audits.',
      icon: <Search className="w-6 h-6 text-blue-400" />,
      tag: 'SEO Services',
      hoverBorder: 'hover:border-blue-400/60 hover:shadow-blue-400/10 group-hover:text-blue-400',
      iconBg: 'group-hover:bg-blue-400/10 group-hover:border-blue-400/20',
      textColor: 'group-hover:text-blue-400'
    },
    {
      name: 'Graphics & Design',
      description: 'Esports clan vectors, social media kits, and customized branding.',
      icon: <Palette className="w-6 h-6 text-purple-400" />,
      tag: 'Graphics & Design',
      hoverBorder: 'hover:border-purple-400/60 hover:shadow-purple-400/10 group-hover:text-purple-400',
      iconBg: 'group-hover:bg-purple-500/10 group-hover:border-purple-500/20',
      textColor: 'group-hover:text-purple-400'
    },
  ];

  const handleCategoryClick = (categoryTag) => {
    onFilterCategory(categoryTag);
    onNavigate('shop');
  };

  return (
    <div className="space-y-16 pb-16 select-none relative overflow-hidden">
      
      {/* Hero Section with Ambient Lights */}
      <section id="hero-section" className="relative overflow-hidden py-14 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-900 rounded-3xl bg-zinc-950/20 shadow-inner">
        {/* Glow ambient backdrops */}
        <div className="absolute top-0 left-10 w-80 h-80 bg-accent-green/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-5000" />
        
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] uppercase font-black tracking-widest px-4 py-2 rounded-full shadow-lg">
            <ShieldCheck className="w-4 h-4 text-accent-green" />
            <span>Secure Safe Pay Hold Protection</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Buy <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400">Social Accounts</span> & <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-green via-emerald-400 to-cyan-400">YT Premium</span> Cheap
          </h1>
          
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-semibold">
            Get active Instagram profiles, YouTube Premium keys, streaming subscriptions, and expert services at low prices. Safe 24-hour handover.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('shop')}
              className="bg-accent-green hover:bg-accent-green-hover text-black font-extrabold text-xs py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent-green/20 hover:scale-[1.02]"
            >
              <span>Open Shop</span>
              <ArrowRight className="w-4 h-4 stroke-[3px]" />
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs py-4 px-8 rounded-xl border border-zinc-800 transition-colors cursor-pointer"
            >
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Main Categories Section (Hardcoded for instant rendering) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">Browse Categories</h2>
          <p className="text-zinc-500 text-xs">Instantly loaded catalog categories</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.tag)}
              className={`bg-card-dark border border-zinc-700/80 p-6 rounded-2xl cursor-pointer group hover:bg-zinc-900/30 hover:scale-[1.01] transition-all duration-300 select-none flex items-start gap-4 shadow-lg shadow-black/35 ${cat.hoverBorder}`}
            >
              <div className={`p-3 rounded-xl bg-zinc-900 border border-zinc-700/60 transition-all ${cat.iconBg}`}>
                {cat.icon}
              </div>
              <div className="space-y-1">
                <h3 className={`text-sm font-bold text-white transition-colors ${cat.textColor}`}>
                  {cat.name}
                </h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed font-medium">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured / Recent listings section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">Recently Listed</h2>
            <p className="text-zinc-500 text-xs mt-0.5">Vetted accounts and services recently uploaded to catalog</p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-extrabold text-accent-green hover:underline cursor-pointer"
          >
            See All Items
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        ) : listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <Card
                key={item._id}
                listing={item}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card-dark border border-zinc-800 p-12 text-center text-zinc-500 text-xs rounded-xl shadow-lg">
            No recent listings found in database.
          </div>
        )}
      </section>

      {/* Security CTA section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-zinc-950 border border-zinc-700/80 p-8 sm:p-10 rounded-2xl flex flex-col sm:flex-row items-center gap-6 justify-between shadow-lg">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-white font-extrabold text-lg">Safe Pay Lock: 100% Protection</h3>
            <p className="text-zinc-400 text-xs max-w-md leading-relaxed font-semibold">
              Your money is safe with us. We pay the seller only after you get the login credentials. Get an instant refund if delivery fails.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs py-3.5 px-6 rounded-xl border border-zinc-800 transition-colors shrink-0 whitespace-nowrap cursor-pointer"
          >
            Contact Support Desk
          </button>
        </div>
      </section>

    </div>
  );
}
