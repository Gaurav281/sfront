import React from 'react';

export default function SkeletonLoader({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-card-dark border border-border-dark rounded-xl p-6 flex flex-col justify-between h-[340px] animate-pulse"
        >
          <div>
            {/* Top row platform logo & price shimmer */}
            <div className="flex justify-between items-start mb-4">
              <div className="h-8 w-24 bg-zinc-800 rounded-lg"></div>
              <div className="h-6 w-16 bg-zinc-800 rounded-lg"></div>
            </div>
            
            {/* Title shimmer */}
            <div className="h-6 bg-zinc-800 rounded-md w-3/4 mb-3"></div>
            
            {/* Description shimmer */}
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-zinc-800 rounded-md w-full"></div>
              <div className="h-4 bg-zinc-800 rounded-md w-5/6"></div>
              <div className="h-4 bg-zinc-800 rounded-md w-2/3"></div>
            </div>
          </div>

          {/* Specs / Info Row shimmer */}
          <div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-20 bg-zinc-800 rounded-full"></div>
              <div className="h-6 w-24 bg-zinc-800 rounded-full"></div>
            </div>
            
            {/* Button shimmer */}
            <div className="h-10 bg-zinc-800 rounded-lg w-full"></div>
          </div>
        </div>
      ))}
    </>
  );
}
