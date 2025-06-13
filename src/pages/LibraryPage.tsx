import { useUser } from '../context/UserProvider';
import PodcastCard from '../components/PodcastCard';
import { SectionHeader } from '../components/SectionHeader';

export default function LibraryPage() {
  const { followedPodcasts } = useUser();
  return (
    <div className="p-8">
      <SectionHeader title="Your Library" />
      {followedPodcasts.length === 0 ? (
        <p className="text-text-secondary">You haven't followed any podcasts yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {followedPodcasts.map(podcast => (
            <PodcastCard
              key={podcast.id}
              id={podcast.id}
              image={podcast.image}
              title={'title' in podcast ? podcast.title : podcast.title_original}
              publisher={'publisher' in podcast ? podcast.publisher : podcast.publisher_original}
            />
          ))}
        </div>
      )}
    </div>
  );
}

