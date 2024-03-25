//import React, { useState } from 'react';
//import './SearchBar.css'; // Import the CSS file

const SearchBar = ({ onSearch }) => {
 const [query, setQuery] = useState('');

 const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
 };

 return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <button type="submit" className="search-button">Search</button>
    </form>
 );
};

export default SearchBar;