import { PodcastDetails, PodcastSearchResult } from '../types';

// Using a CORS proxy to fetch feeds directly
const PROXY_URL = 'https://api.allorigins.win/raw?url=';

const fetchJsonFromProxy = async (path: string) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const podcastApi = {
  getTopPodcasts: async () => {
    try {
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
      const response = await fetch(`${PROXY_URL}${encodeURIComponent(rssUrl)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed. Status: ${response.status}`);
      }
      const str = await response.text();
      const data = new window.DOMParser().parseFromString(str, "text/xml");
  
      const items = data.querySelectorAll("item");
      const episodes = [];
  
      items.forEach(item => {
        const guid = item.querySelector("guid")?.textContent || '';
        const title = item.querySelector("title")?.textContent || 'Untitled Episode';
        const enclosure = item.querySelector("enclosure");
        const audio = enclosure?.getAttribute("url") || '';
        const duration = item.querySelector("itunes\\:duration")?.textContent || null;
        const published = item.querySelector("pubDate")?.textContent || '';
        const description = item.querySelector("description")?.textContent || '';
        
        if (audio) { // Only add if it's a playable episode
            episodes.push({
              guid,
              title,
              audio,
              duration,
              published,
              description,
            });
        }
      });
  
      return episodes;
  
    } catch (error) {
      console.error(`Error fetching or parsing episodes from RSS feed:`, error);
      throw error;
    }
  },

  searchPodcasts: async (query: string) => {
    try {
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
