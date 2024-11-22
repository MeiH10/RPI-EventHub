import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBarCSS from './SearchBar.module.css'; // Adjust the import path if necessary
import { useEvents } from '../../context/EventsContext'; // Adjust the import path if necessary
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';

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
      return searchWords.some(word => eventWords.includes(word) || eventTags.includes(word));
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
    <div className={`${SearchBarCSS.searchBarContainer} flex flex-col md:flex-row h-12 w-full min-w-40 sm:min-w-96 justify-center items-center space-x-4 space-y-4 md:space-y-0`}>
      <input
        type="text"
        className={`${SearchBarCSS.searchInput} bg-white rounded shadow w-full h-full p-4`}
        placeholder="Search for an event!"
        onChange={handleSearchInputChange}
        onKeyDown={handleKeyPress} // Replaced onKeyPress with onKeyDown
        style={{ color: isDark ? 'black' : 'inherit' }}
      />
      <button
        className={`${SearchBarCSS.searchButton} bg-red-500 text-white font-bold py-2 px-4 rounded shadow-sm`}
        onClick={handleSearchClick}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;