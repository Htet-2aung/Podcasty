import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { podcastApi } from '../lib/podcast-api';
import PodcastCard from '../components/PodcastCard';
import { Podcast } from '../types';
import Search from '../components/Search';
import CategoryBrowser from '../components/CategoryBrowser';
import LoadingGrid from '../components/LoadingGrid';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
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
  }, [query]);

  return (
    <div className="search-page">
      <Search />
      
      {isLoading ? (
        <LoadingGrid />
      ) : query ? (
        <div>
          <h2 className="text-2xl font-bold my-6">Search Results for "{query}"</h2>
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
      ) : (
        <CategoryBrowser /> 
      )}
    </div>
  );
};

export default SearchPage;
