import React, { useState, useEffect } from 'react';
import SearchBarCSS from './SearchBar.module.css'; // Adjust the import path if necessary


const SearchBar = ({ searchTerm,onSearchClick, onSearchInputChange }) => {
    return (
        <div className={SearchBarCSS.searchBarContainer}>
            <input
                className={SearchBarCSS.searchInput}
                type="text"
                value={searchTerm}
                placeholder="Search for an event!"
                onChange={onSearchInputChange}
            />
            <button className={SearchBarCSS.searchButton} onClick={onSearchClick}>Search</button>
        </div>
    );
};
export default SearchBar