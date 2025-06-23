import { useState } from 'react';
import { useUser } from '../context/UserProvider';
import PodcastCard from '../components/PodcastCard';
import { SectionHeader } from '../components/SectionHeader';
import { useAudioPlayer } from '../context/AudioProvider';

export default function LibraryPage() {
  const { followedPodcasts, favoriteEpisodes } = useUser();
  const { playEpisode } = useAudioPlayer();
  const [activeTab, setActiveTab] = useState('podcasts');

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <SectionHeader title="Your Library" />

      {/* Tabs for switching between Podcasts and Episodes */}
      <div className="flex border-b border-overlay mb-6">
        <button 
          onClick={() => setActiveTab('podcasts')} 
          className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'podcasts' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
        >
          Podcasts ({followedPodcasts.length})
        </button>
        <button 
          onClick={() => setActiveTab('episodes')} 
          className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'episodes' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
        >
          Favorites ({favoriteEpisodes.length})
        </button>
      </div>

      {/* Conditional content based on active tab */}
      {activeTab === 'podcasts' && (
        <div>
          {followedPodcasts.length === 0 ? (
            <p className="text-text-secondary">You haven't followed any podcasts yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {followedPodcasts.map(podcast => (
                <PodcastCard key={podcast.id} podcast={podcast} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'episodes' && (
        <div>
          {favoriteEpisodes.length === 0 ? (
            <p className="text-text-secondary">You haven't favorited any episodes yet.</p>
          ) : (
            <ul className="space-y-2">
              {favoriteEpisodes.map(episode => (
                <li 
                  key={episode.guid}
                  onClick={() => playEpisode(episode, favoriteEpisodes)}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-overlay transition-colors cursor-pointer group"
                >
                  <img src={episode.image} alt={episode.title} className="w-16 h-16 rounded-md object-cover flex-shrink-0"/>
                  <div className="flex-1">
                    <p className="font-semibold text-text-main group-hover:text-primary transition-colors">{episode.title}</p>
                    <p className="text-sm text-text-secondary">{episode.podcastTitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
