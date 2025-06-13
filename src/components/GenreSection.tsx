import { useState, useEffect } from 'react';
// FIX: Import the main 'podcastApi' object
import { podcastApi } from '../lib/podcast-api';
import { SectionHeader } from './SectionHeader';
import PodcastCard from './PodcastCard';

const PodcastCardSkeleton = () => (
  <div className="bg-[--surface]/50 p-4 rounded-lg animate-pulse">
    <div className="w-full h-auto aspect-square rounded-md bg-[--text-secondary]/20"></div>
    <div className="h-4 w-3/4 mt-3 rounded bg-[--text-secondary]/20"></div>
    <div className="h-3 w-1/2 mt-2 rounded bg-[--text-secondary]/20"></div>
  </div>
);

interface GenreSectionProps {
  title: string;
  genreId: number;
}

export const GenreSection = ({ title, genreId }: GenreSectionProps) => {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenrePodcasts = async () => {
      setLoading(true);
      setError(null);
      try {
        // FIX: Call the function as a method
        const data = await podcastApi.getPodcastsByGenre(genreId);
        setPodcasts(data.podcasts);
      } catch (err) {
        console.error(`Error fetching genre ${title}:`, err);
        setError('Could not load this section.');
      } finally {
        setLoading(false);
      }
    };
    fetchGenrePodcasts();
  }, [genreId, title]);

  return (
    <section className="mb-12">
      <SectionHeader title={title} />
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <PodcastCardSkeleton key={i} />)
        ) : (
          podcasts.map(podcast => (
            <PodcastCard
              key={podcast.id}
              id={podcast.id}
              image={podcast.image}
              title={podcast.title}
              publisher={podcast.publisher}
            />
          ))
        )}
      </div>
    </section>
  );
};