export interface PodcastSearchResult {
  id: string;
  image: string;
  title_original: string;
  publisher_original: string;
}

export interface Episode {
  id: string;
  link: string;
  audio: string;
  image: string;
  title: string;
  thumbnail: string;
  description: string;
  pub_date_ms: number;
  audio_length_sec: number;
}

export interface PodcastDetails {
  id: string;
  image: string;
  title: string;
  country: string;
  episodes: Episode[];
  language: string;
  publisher: string;
  description: string;
  total_episodes: number;
  explicit_content: boolean;
}

export interface PlayerEpisode extends Partial<Episode> {
  id: string;
  title: string;
  audio: string;
  image: string;
  podcastTitle?: string;
}