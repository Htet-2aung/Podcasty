// src/pages/PodcastPage.tsx

import React, { useEffect, useState } from 'react';
// FIXED: Import useLocation to read the state passed from the Link
import { useParams, useLocation } from 'react-router-dom';
import { podcastApi } from '../lib/podcast-api';
import { useAudioPlayer } from '../context/AudioProvider';
import { PodcastDetails, PlayerEpisode, Podcast } from '../types';
import { useUser } from '../context/UserProvider'; // 1. Import the useUser hook

const PodcastPage = () => {
  const { podcastId } = useParams<{ podcastId: string }>();
  // FIXED: useLocation hook to get the passed state
  const location = useLocation();
  // FIXED: Initialize state with the data from the Link, if it exists
  const initialData = location.state?.podcast as Podcast;
// 2. Get follow functions and status from the UserContext
 
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
      // We need to ensure we pass the simple Podcast object, not PodcastDetails
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
        // We can set loading to false sooner if we already have initial data
        setIsLoading(!initialData);
        setError(null);

        // Fetch the full details (which includes the important rssUrl)
        const details = await podcastApi.getPodcastDetails(podcastId);
        // Set the full details, which might include more info
        setPodcast(details);

        if (details.rssUrl) {
          const episodeData = await podcastApi.getEpisodesFromRss(details.rssUrl);
          const episodesWithArt = episodeData.map(episode => ({
            ...episode,
            image: details.image,
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

  if (isLoading) {
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
      {/* This will now show the image and title instantly! */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <img src={podcast.image} alt={podcast.title} className="w-full md:w-48 h-auto rounded-lg shadow-lg" />
        <div>
          <h1 className="text-4xl font-bold">{podcast.title}</h1>
          <p className="text-xl text-text-secondary mt-1">{podcast.author}</p>
          {/* We can show a description if it exists */}
          {/* 3. Add the Follow/Unfollow Button */}
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

          {podcast.description && <p className="mt-4">{podcast.description}</p>}

        </div>
      </div>
      
      <hr className="my-8 border-overlay" />

      {/* The episode list will appear here once it's loaded */}
      <h2 className="text-2xl font-bold mb-4">Episodes ({episodes.length} most recent)</h2>
      <ul className="episode-list">
        {episodes.map(episode => (
          <li key={episode.id} onClick={() => playEpisode(episode)} className="episode-item">
            {episode.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PodcastPage;