import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import apiClient from '../api/apiClient';
import Card from '../components/Card';
import SkeletonLoader from '../components/SkeletonLoader';

export default function CategoryList({ selectedCategory, onFilterCategory, onViewDetails }) {
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Hardcoded main categories for instant loading
  const categories = [
    { name: 'All Assets', value: '' },
    { name: 'Instagram Accounts', value: 'Instagram Accounts' },
    { name: 'YouTube Channels', value: 'YouTube Channels' },
    { name: 'TikTok Accounts', value: 'TikTok Accounts' },
    { name: 'Streaming Accounts', value: 'Streaming Accounts' },
    { name: 'SEO Services', value: 'SEO Services' },
    { name: 'Graphics & Design', value: 'Graphics & Design' },
  ];

  // Tanstack Query to pull filtered listings dynamically
  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ['listings', selectedCategory, search, minPrice, maxPrice],
    queryFn: async () => {
      let url = '/listings';
      const params = [];
      if (selectedCategory) params.push(`category=${encodeURIComponent(selectedCategory)}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (minPrice) params.push(`minPrice=${minPrice}`);
      if (maxPrice) params.push(`maxPrice=${maxPrice}`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await apiClient.get(url);
      return res.data;
    },
  });

  const handleResetFilters = () => {
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    onFilterCategory('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 select-none">
      
      {/* Search and category filtering panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-dark pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Marketplace Catalog</h1>
          <p className="text-zinc-500 text-xs mt-0.5">Explore active verified listings</p>
        </div>

        {/* Search bar & filter toggle */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search title, spec or niche..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-accent-green/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
              showFilters
                ? 'bg-accent-green border-accent-green text-black'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Horizontal categories list (instant loading) */}
      <div id="shop-categories" className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-zinc-900">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onFilterCategory(cat.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === cat.value
                ? 'bg-zinc-900 text-accent-green border-accent-green/30'
                : 'bg-transparent text-zinc-400 border-transparent hover:text-white hover:border-zinc-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Expandable filters panel (pricing) */}
      {showFilters && (
        <div className="bg-card-dark border border-border-dark p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">Min Price</label>
              <input
                type="number"
                placeholder="$ Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-xs w-28 focus:outline-none focus:border-accent-green/30"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-widest text-zinc-500 block">Max Price</label>
              <input
                type="number"
                placeholder="$ Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-white rounded-lg px-3 py-2 text-xs w-28 focus:outline-none focus:border-accent-green/30"
              />
            </div>

            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-zinc-400 hover:text-white mt-4 border border-zinc-800 hover:bg-zinc-900 px-3 py-2 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>

          <div className="text-[10px] text-zinc-500">
            Showing all listings within filters parameters
          </div>
        </div>
      )}

      {/* Grid displaying cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <SkeletonLoader count={6} />
        ) : listings && listings.length > 0 ? (
          listings.map((listing) => (
            <Card
              key={listing._id}
              listing={listing}
              onViewDetails={onViewDetails}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center space-y-3">
            <div className="text-zinc-500 text-xs">No listings found matching the query.</div>
            <button
              onClick={handleResetFilters}
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold px-4 py-2 rounded-xl border border-zinc-800 transition-colors"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
