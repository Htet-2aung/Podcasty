// src/pages/CategoryPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { podcastApi } from '../lib/podcast-api';
import { categories } from '../lib/categories';
import PodcastCard from '../components/PodcastCard';
import LoadingGrid from '../components/LoadingGrid';
import { Podcast } from '../types';

const CategoryPage = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Find the category name from our hardcoded list
  const category = categories.find(c => c.id === genreId);

  useEffect(() => {
    if (!genreId) return;

    const fetchPodcastsByGenre = async () => {
      setIsLoading(true);
      const genrePodcasts = await podcastApi.getPodcastsByGenre(genreId);
      setPodcasts(genrePodcasts);
      setIsLoading(false);
    };

    fetchPodcastsByGenre();
  }, [genreId]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Top Podcasts in <span className="text-primary">{category?.name || 'Category'}</span>
      </h1>
      
      {isLoading ? (
        <LoadingGrid />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {podcasts?.map(podcast => (
            <PodcastCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;