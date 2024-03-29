import React from 'react';
import './SearchBar.module.css'; 

const SearchBar = () => {
    return (
        <form className="search-bar">
            <input
                type="text"
                placeholder="Search..."
                className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
        </form>
    );
};

export default SearchBar;