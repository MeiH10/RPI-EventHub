import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventsContext';
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
    <div
      className={`
        flex flex-col md:flex-row items-center gap-2 w-full max-w-[600px] mx-auto p-2
      `}
    >
      <input
        type="text"
        className={`
          flex-1 h-10 px-4 border border-[#e5f0e2] rounded-md bg-white text-[#2c1a1c]
          font-[Afacad] 
        `}
        placeholder="Search for an event!"
        onChange={handleSearchInputChange}
        onKeyDown={handleKeyPress}
        style={{ color: isDark ? 'black' : undefined }}
      />
      <button
        className={`
          px-4 py-2 bg-[#AB2328] text-white font-semibold rounded-md border-0 cursor-pointer 
          transition-colors duration-200 font-[Afacad] hover:bg-red-600
        `}
        onClick={handleSearchClick}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
