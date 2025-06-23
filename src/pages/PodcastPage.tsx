// src/pages/PodcastPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { podcastApi } from '../lib/podcast-api';
import { useAudioPlayer } from '../context/AudioProvider';
import { PodcastDetails, PlayerEpisode, Podcast } from '../types';
import { useUser } from '../context/UserProvider';

const PodcastPage = () => {
  const { podcastId } = useParams<{ podcastId: string }>();
  const location = useLocation();
  const initialData = location.state?.podcast as Podcast;
  
  const [podcast, setPodcast] = useState<PodcastDetails | Podcast | null>(initialData);
  const [episodes, setEpisodes] = useState<PlayerEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { playEpisode } = useAudioPlayer();
  const { followPodcast, unfollowPodcast, isFollowing } = useUser();

  const isCurrentlyFollowing = podcast ? isFollowing(podcast.id) : false;

  const handleFollowToggle = () => {
    if (!podcast) return;
    
    if (isCurrentlyFollowing) {
      unfollowPodcast(podcast.id);
    } else {
      const simplePodcast: Podcast = {
        id: podcast.id,
        title: podcast.title,
        author: podcast.author,
        image: podcast.image,
      };
      followPodcast(simplePodcast);
    }
  };


  useEffect(() => {
    const fetchDetailsAndEpisodes = async () => {
      if (!podcastId) {
        setError("No podcast ID provided.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(!initialData);
        setError(null);

        const details = await podcastApi.getPodcastDetails(podcastId);
        setPodcast(details);

        if (details.rssUrl) {
          const episodeData = await podcastApi.getEpisodesFromRss(details.rssUrl);
          const episodesWithArt = episodeData.map(episode => ({
            ...episode,
            image: details.image, // Use the main podcast image for each episode
          }));
          setEpisodes(episodesWithArt);
        } else {
          setEpisodes([]);
        }

      } catch (err) {
        console.error("Failed to fetch podcast data:", err);
        setError("Could not load podcast data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailsAndEpisodes();
  }, [podcastId, initialData]);

  if (isLoading && !podcast) {
    return <div className="text-center p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!podcast) {
    return <div className="text-center p-10">Podcast not found.</div>;
  }

  return (
    <div className="podcast-detail-page">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
        <img src={podcast.image} alt={podcast.title} className="w-full md:w-48 h-auto rounded-lg shadow-lg flex-shrink-0" />
        <div className="flex-grow">
          <h1 className="text-4xl font-bold">{podcast.title}</h1>
          <p className="text-xl text-text-secondary mt-1">{podcast.author}</p>
          {podcast.description && <p className="mt-4 text-text-secondary">{podcast.description}</p>}
          <button
            onClick={handleFollowToggle}
            className={`mt-6 px-6 py-2 font-bold rounded-full transition-colors ${
              isCurrentlyFollowing
                ? 'bg-overlay text-text-main'
                : 'bg-primary text-white hover:opacity-90'
            }`}
          >
            {isCurrentlyFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>
      
      <hr className="my-8 border-overlay" />

      <h2 className="text-2xl font-bold mb-4">Episodes ({episodes.length})</h2>
      
      {/* New Episode List Layout */}
      <ul className="space-y-2">
        {episodes.map((episode) => (
          <li 
            key={episode.guid}
            onClick={() => playEpisode(episode, episodes)} 
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-overlay transition-colors cursor-pointer group"
          >
            <img 
              src={episode.image} 
              alt={episode.title} 
              className="w-16 h-16 rounded-md object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <p className="font-semibold text-text-main group-hover:text-primary transition-colors">{episode.title}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PodcastPage;
