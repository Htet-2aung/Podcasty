// src/components/PodcastCardSkeleton.tsx

import React from 'react';

const PodcastCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface rounded-lg shadow-md animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full aspect-square bg-overlay rounded-t-lg"></div>
      
      <div className="p-4">
        {/* Title Placeholder */}
        <div className="h-4 bg-overlay rounded w-3/4 mb-2"></div>
        {/* Author Placeholder */}
        <div className="h-3 bg-overlay rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default PodcastCardSkeleton;