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
  const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
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
    // This PROXY_URL is used to bypass CORS restrictions when fetching RSS feeds.
    const PROXY_URL = 'https://cors.sh/';

    try {
      // Fetch the raw XML feed through the proxy
      const response = await fetch(`${PROXY_URL}${rssUrl}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch RSS feed. Status: ${response.status}`);
      }
      const str = await response.text();
      // Use the browser's built-in DOMParser to process the XML
      const data = new window.DOMParser().parseFromString(str, "text/xml");
  
      const items = data.querySelectorAll("item");
      const episodes = [];
  
      // Loop through all <item> tags in the feed, which represent episodes
      items.forEach(item => {
        const guid = item.querySelector("guid")?.textContent || '';
        const title = item.querySelector("title")?.textContent || 'Untitled Episode';
        const enclosure = item.querySelector("enclosure");
        const audio = enclosure?.getAttribute("url") || '';
        // Note the escaped colon for the 'itunes:duration' tag
        const duration = item.querySelector("itunes\\:duration")?.textContent || null;
        const published = item.querySelector("pubDate")?.textContent || '';
        const description = item.querySelector("description")?.textContent || '';
        
        // Only add episodes that have a valid audio URL
        if (audio) {
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
