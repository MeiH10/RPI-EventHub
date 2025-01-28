import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBarCSS from './SearchBar.module.css'; // Adjust the import path if necessary
import { useEvents } from '../../context/EventsContext'; // Adjust the import path if necessary
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';

import cosineSimilarity from 'cosine-similarity';
const SearchBar = () => {
  const navigate = useNavigate();
  const { events, fetchEvents } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearchClick = () => {
    const searchWords = searchTerm.toLowerCase().split(' ');

    const filtered = events.filter(event => {
      const eventWords = event.title.toLowerCase().split(' ');
      const eventTags = event.tags.map(tag => tag.toLowerCase());
      const eventDate = new Date(event.startDateTime);
      const currentDate = new Date();

      const eventText = [...eventWords, ...eventTags].join(' ');
      const textToVector = (text) => {
        const characters = text.split('');
        const vector = {};
        characters.forEach(char => {
          vector[char] = (vector[char] || 0) + 1;
        });
        return vector;
      };
      const vectorA = textToVector(searchWords.join(' '));
      const eventWordsArray = eventText.split(' ');
      let maxSimilarity = 0;
      searchWords.forEach(searchWord => {
        const vectorSearchWord = textToVector(searchWord);
        eventWordsArray.forEach(word => {
          const vectorB = textToVector(word);
          const similarity = cosineSimilarity(vectorSearchWord, vectorB);
          
          if (similarity > maxSimilarity) {
            
            maxSimilarity = similarity;
          }
        });
      });
      return maxSimilarity > 0.78 && eventDate >= currentDate;
    });

    const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));;

    navigate('/search', { state: { results: sorted } });
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className={`${SearchBarCSS.searchBarContainer} flex flex-col md:flex-row w-full min-w-40 sm:min-w-96 justify-center items-center gap-2 p-2`}>
      <input
        type="text"
        className={`${SearchBarCSS.searchInput} bg-white rounded shadow w-full p-2`}
        placeholder="Search for an event!"
        onChange={handleSearchInputChange}
        onKeyDown={handleKeyPress}
        style={{ color: isDark ? 'black' : 'inherit' }}
      />
      <button
        className={`${SearchBarCSS.searchButton} bg-red-500 text-white font-bold py-2 px-4 rounded shadow-sm whitespace-nowrap`}
        onClick={handleSearchClick}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;