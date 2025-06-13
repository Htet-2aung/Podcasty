// src/pages/SearchPage.tsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { podcastApi } from '../lib/podcast-api';
import PodcastCard from '../components/PodcastCard';
import { Podcast } from '../types';
// FIXED: Import the Search component you just created
import Search from '../components/Search';
import CategoryBrowser from '../components/CategoryBrowser';
const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    // If there's no query in the URL, don't do anything.
    if (!query) {
      setSearchResults([]);
      return;
    }

    const performSearch = async () => {
      try {
        setIsLoading(true);
        const results = await podcastApi.searchPodcasts(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Failed to search for podcasts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]); // This effect runs every time the URL query changes

  return (
    <div className="search-page">
      {/* The Search component is now included here */}
      <Search />
       <CategoryBrowser />
      {isLoading ? (
        <div>Searching...</div>
      ) : (
        query && (
          <div>
            <h2>Search Results for "{query}"</h2>
            <div className="podcasts-grid">
              {searchResults.length > 0 ? (
                searchResults.map(podcast => (
                  <PodcastCard key={podcast.id} podcast={podcast} />
                ))
              ) : (
                <p>No results found.</p>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;