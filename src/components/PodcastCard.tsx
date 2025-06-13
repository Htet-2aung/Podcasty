// src/components/PodcastCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Podcast } from '../types';

interface PodcastCardProps {
  podcast: Podcast | undefined;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => {
  if (!podcast) {
    return null;
  }

  return (
    // FIXED: Added the 'state' prop to the Link.
    // This passes the podcast object along with the navigation.
    <Link to={`/podcast/${podcast.id}`} state={{ podcast }} className="podcast-card">
      <div className="podcast-card-image">
        <img src={podcast.image} alt={podcast.title} />
      </div>
      <div className="podcast-card-info">
        <h3 className="podcast-title">{podcast.title}</h3>
        <p className="podcast-author">{podcast.author}</p>
      </div>
    </Link>
  );
};

export default PodcastCard;