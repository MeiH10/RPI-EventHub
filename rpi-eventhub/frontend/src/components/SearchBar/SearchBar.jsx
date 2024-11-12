import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBarCSS from './SearchBar.module.css'; // Adjust the import path if necessary
import { useEvents } from '../../context/EventsContext'; // Adjust the import path if necessary
import cosineSimilarity from 'cosine-similarity';
const SearchBar = () => {
  const navigate = useNavigate();
  const { events, fetchEvents } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');

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
        const words = text.split(' ');
        const vector = {};
        words.forEach(word => {
          vector[word] = (vector[word] || 0) + 1;
        });
        return vector;
      };

      const vectorA = textToVector(searchWords.join(' '));
      const vectorB = textToVector(eventText);

      
      const similarity = cosineSimilarity(vectorA, vectorB);
      
      return similarity > 0.1 && eventDate >= currentDate;
    });

    const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

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
    <div className={SearchBarCSS.searchBarContainer}>
      <input
        className={SearchBarCSS.searchInput}
        type="text"
        placeholder="Search for an event!"
        onChange={handleSearchInputChange}
        onKeyPress={handleKeyPress}
      />
      <button
        className={SearchBarCSS.searchButton}
        onClick={handleSearchClick}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
