import { PodcastDetails, PodcastSearchResult } from '../types';
const PROXY_URL = 'https://api.allorigins.win/raw?url=';
// src/lib/podcast-api.ts

// This function now calls our local proxy, not a remote server
const fetchJsonFromProxy = async (path: string) => {
  const response = await fetch(path); // e.g., fetch('/api/lookup?id=123')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const rss2jsonApi = async (rssUrl: string) => {
  const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=500`);
  if (!response.ok) {
    throw new Error('Failed to parse RSS feed via rss2json.');
  }
  return response.json();
};

export const podcastApi = {
  getTopPodcasts: async () => {
    try {
      // FIXED: Use the local proxy
      const data = await fetchJsonFromProxy('/api/us/rss/toppodcasts/limit=100/genre=1310/json');
      if (!data?.feed?.entry) return [];
      return data.feed.entry.map((p: any) => ({
        id: p.id.attributes['im:id'],
        title: p['im:name'].label,
        author: p['im:artist'].label,
       image: p['im:image'][p['im:image'].length - 1].label,
      }));
    } catch (error) {
      console.error("Error fetching top podcasts:", error);
      return [];
    }
  },

  getPodcastDetails: async (podcastId: string) => {
    try {
      // FIXED: Use the local proxy
      const data = await fetchJsonFromProxy(`/api/lookup?id=${podcastId}`);
      if (data.resultCount === 0) throw new Error('Podcast not found.');
      const podcast = data.results[0];
      return {
        id: podcast.trackId,
        title: podcast.trackName,
        author: podcast.artistName,
        image: podcast.artworkUrl600,
        description: podcast.trackName,
        rssUrl: podcast.feedUrl,
      };
    } catch (error) {
      console.error(`Error fetching details for podcast ${podcastId}:`, error);
      throw error;
    }
  },

  getPodcastsByGenre: async (genreId: string) => {
    try {
      const url = `/api/us/rss/toppodcasts/limit=50/genre=${genreId}/json`;
      const data = await fetchJsonFromProxy(url);
      if (!data?.feed?.entry) return [];
      return data.feed.entry.map((p: any) => ({
        id: p.id.attributes['im:id'],
        title: p['im:name'].label,
        author: p['im:artist'].label,
        image: p['im:image'][2].label,
      }));
    } catch (error) {
      console.error(`Error fetching podcasts for genre ${genreId}:`, error);
      return [];
    }
  },

  getEpisodesFromRss: async (rssUrl: string) => {
    try {
      const data = await rss2jsonApi(rssUrl);
      
      // Prevent crash if feed items are missing
      if (!Array.isArray(data.items)) {
        console.warn("RSS feed items are not an array.", { rssUrl, data });
        return [];
      }
      
      return data.items
        .map((episode: any) => ({
          guid: episode.guid,
          title: episode.title || 'Untitled Episode',
          // Safely access audio link
          audio: episode.enclosure?.link,
          duration: episode.itunes_duration || null,
          published: episode.pubDate,
          description: episode.description || '',
        }))
        // Ensure we only return episodes that are playable
        .filter(episode => episode.audio);
    } catch (error) {
      console.error(`Error fetching episodes from RSS feed:`, error);
      throw error; // Propagate error to be handled in the UI
    }
  },

  searchPodcasts: async (query: string) => {
    try {
        // FIXED: Use the local proxy
        const data = await fetchJsonFromProxy(`/api/search?term=${query}&media=podcast&entity=podcast`);
        return data.results.map((p: any) => ({
            id: p.trackId.toString(),
            title: p.trackName,
            author: p.artistName,
            image: p.artworkUrl100,
        }));
    } catch (error) { 
        console.error("Error searching podcasts:", error);
        return [];
    }
  },
};
