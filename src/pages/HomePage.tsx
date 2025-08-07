
import React, { useState, useEffect } from 'react';
import { podcastApi } from '../lib/podcast-api';
import PodcastCard from '../components/PodcastCard';
import { Podcast } from '../types';
import LoadingGrid from '../components/LoadingGrid';

// The shuffle function can remain if you like the random recommendations
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const HomePage = () => {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopPodcasts = async () => {
      try {
        setIsLoading(true);
        const topPodcasts = await podcastApi.getTopPodcasts();
        if (Array.isArray(topPodcasts)) {
          const shuffledPodcasts = shuffleArray(topPodcasts);
          setPodcasts(shuffledPodcasts.slice(0, 18));
        } else {
          setPodcasts([]);
        }
      } catch (error) {
        console.error("Failed to fetch top podcasts:", error);
        setPodcasts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopPodcasts();
  }, []);

  if (isLoading) {
    return <LoadingGrid />;
  }
  
  return (
    // --- THIS IS THE FIX ---
    // Replace "podcasts-grid" with explicit responsive grid classes from Tailwind CSS.
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {podcasts?.map(podcast => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
};

export default HomePage;
