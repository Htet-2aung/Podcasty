// src/pages/HomePage.tsx

import React, { useState, useEffect } from 'react';
import { podcastApi } from '../lib/podcast-api';
import PodcastCard from '../components/PodcastCard';
import { Podcast } from '../types';
import LoadingGrid from '../components/LoadingGrid';

// --- NEW: Add a utility function to shuffle an array ---
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
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
          // --- CHANGE: Shuffle the array and take a slice ---
          const shuffledPodcasts = shuffleArray(topPodcasts);
          setPodcasts(shuffledPodcasts.slice(0, 18)); // Display 18 random podcasts
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
    <div className="podcasts-grid">
      {podcasts?.map(podcast => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
};

export default HomePage;
