// src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import { podcastApi } from '../lib/podcast-api';
import PodcastCard from '../components/PodcastCard';
import { Podcast } from '../types';
import LoadingGrid from '../components/LoadingGrid'; // 1. Import the new component


const HomePage = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopPodcasts = async () => {
      try {
        // We set loading to true at the start of the try block
        setIsLoading(true);
        const topPodcasts = await podcastApi.getTopPodcasts();
        
        // FIXED: Ensure the API response is an array before setting state.
        // This prevents setting state to 'undefined' if the API fails.
        if (Array.isArray(topPodcasts)) {
          setPodcasts(topPodcasts);
        } else {
          // If the API returns something unexpected, default to an empty array.
          setPodcasts([]);
        }
      } catch (error) {
        console.error("Failed to fetch top podcasts:", error);
        // Also default to an empty array in case of an error
        setPodcasts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopPodcasts();
  }, []);
 // 2. This is the only part that changes
  if (isLoading) {
    return <LoadingGrid />;
  }
  return (
    <div className="podcasts-grid">
      {/* FIXED: Added optional chaining ('?').
        This tells React: "Only call .map() if 'podcasts' is not null or undefined."
        This is the simplest way to prevent this specific crash.
      */}
      {podcasts?.map(podcast => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
};

export default HomePage;