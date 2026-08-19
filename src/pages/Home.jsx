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

  // Hardcoded main categories as requested for instant loading
  const categories = [
    {
      name: 'Instagram Accounts',
      description: 'Niche specific pages with real, highly active followers.',
      icon: <Instagram className="w-6 h-6 text-pink-500" />,
      tag: 'Instagram Accounts',
    },
    {
      name: 'YouTube Channels',
      description: 'Monetized partnership channels with active subscriber bases.',
      icon: <Youtube className="w-6 h-6 text-red-600" />,
      tag: 'YouTube Channels',
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
    },
    {
      name: 'Streaming Accounts',
      description: 'Private Netflix UHD, Spotify, and premium entertainment keys.',
      icon: <Tv className="w-6 h-6 text-emerald-400" />,
      tag: 'Streaming Accounts',
    },
    {
      name: 'SEO Services',
      description: 'White-hat backlink guest posts, content setups, and audits.',
      icon: <Search className="w-6 h-6 text-blue-400" />,
      tag: 'SEO Services',
    },
    {
      name: 'Graphics & Design',
      description: 'Esports clan vectors, social media kits, and customized branding.',
      icon: <Palette className="w-6 h-6 text-purple-400" />,
      tag: 'Graphics & Design',
    },
  ];

  const handleCategoryClick = (categoryTag) => {
    onFilterCategory(categoryTag);
    onNavigate('shop');
  };

  return (
    <div className="space-y-16 pb-16 select-none">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 border-b border-border-dark bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,223,130,0.06),rgba(255,255,255,0))]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-3.5 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-accent-green" />
            <span>Secure Moderated Handover Escrow Protection</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Acquire Premium <span className="text-accent-green">Digital Assets</span> & Accounts
          </h1>
          
          <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            The trusted marketplace to securely buy verified Instagram pages, monetized YouTube channels, streaming subscriptions, and expert white-hat digital services.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('shop')}
              className="bg-accent-green hover:bg-accent-green-hover text-black font-extrabold text-xs py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Open Shop</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs py-3 px-6 rounded-xl border border-zinc-800 transition-colors cursor-pointer"
            >
              How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Main Categories Section (Hardcoded for instant rendering) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white">Browse Categories</h2>
          <p className="text-zinc-500 text-xs">Instantly loaded catalog categories</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => handleCategoryClick(cat.tag)}
              className="bg-card-dark border border-border-dark hover:border-accent-green/50 p-6 rounded-xl cursor-pointer group hover:bg-zinc-900/20 transition-all select-none flex items-start gap-4"
            >
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-accent-green/20 group-hover:bg-accent-green/5 transition-all">
                {cat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white group-hover:text-accent-green transition-colors">
                  {cat.name}
                </h3>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured / Recent listings section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b border-border-dark pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Recently Listed</h2>
            <p className="text-zinc-500 text-xs mt-0.5">Vetted accounts and services recently uploaded to catalog</p>
          </div>
          <button
            onClick={() => {
              onFilterCategory('');
              onNavigate('shop');
            }}
            className="text-xs font-bold text-accent-green hover:underline flex items-center gap-1"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <SkeletonLoader count={3} />
          ) : listings && listings.length > 0 ? (
            listings.map((listing) => (
              <Card
                key={listing._id}
                listing={listing}
                onViewDetails={onViewDetails}
              />
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-zinc-500 text-xs">
              No recent listings found in database.
            </div>
          )}
        </div>
      </section>

      {/* Security CTA section */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-zinc-950 border border-border-dark p-8 sm:p-10 rounded-2xl flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-white font-extrabold text-lg">Safe escrow trade environment</h3>
            <p className="text-zinc-400 text-xs max-w-md leading-relaxed">
              We protect both transacting parties. Sellers get guaranteed payouts, and buyers get verified assets or immediate refunds.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs py-3 px-5 rounded-xl border border-zinc-800 transition-colors shrink-0 whitespace-nowrap cursor-pointer"
          >
            Contact Support Desk
          </button>
        </div>
      </section>

    </div>
  );
}
