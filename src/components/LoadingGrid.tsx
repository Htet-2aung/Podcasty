// src/components/LoadingGrid.tsx

import React from 'react';
import PodcastCardSkeleton from './PodcastCardSkeleton';

const LoadingGrid: React.FC = () => {
  // Create an array to map over, rendering multiple skeletons
  const skeletonCount = 12; // You can adjust how many you want to show
  const skeletons = Array.from({ length: skeletonCount });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {skeletons.map((_, index) => (
        <PodcastCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default LoadingGrid;