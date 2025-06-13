export interface ApplePodcast {
  wrapperType: string;
  kind: string;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName:string;
  artworkUrl100: string;
  artworkUrl600: string;
  releaseDate: string;
  country: string;
  primaryGenreName: string;
  feedUrl: string;
}

// For the RSS feed data from rss2json
export interface RssEpisode {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: {
    link: string; // This is the audio URL
    type: string;
    length: number;
    duration: number;
  };
  categories: string[];
}

export interface RssFeed {
  status: string;
  feed: {
    url: string;
    title: string;
    link: string;
    author: string;
    description: string;
    image: string;
  };
  items: RssEpisode[];
}

// For our internal player state
export interface PlayerEpisode {
  guid: string; // Use GUID as the unique ID for episodes
  title: string;
  audio: string; 
  image?: string;
  podcastTitle?: string;
}

export type FollowedPodcast = ApplePodcast;