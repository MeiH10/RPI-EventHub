// src/components/SearchBar/AdminSearchBar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBarCSS from './SearchBar.module.css'; // Adjust the import path if necessary
import axios from 'axios'; // Assuming you'll be fetching users from the backend

const AdminSearchBar = ({ setResults }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  // Fetch all users from the backend (assuming there's an API route for that)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users'); // Adjust the API endpoint as needed
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearchClick = () => {
    const searchWords = searchTerm.toLowerCase().split(' ');

    const filtered = users.filter(user => {
      const rcsId = user.rcsId.toLowerCase();
      const name = user.name.toLowerCase();
      return searchWords.some(word => rcsId.includes(word) || name.includes(word));
    });

    setResults(filtered);
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
        placeholder="Search for a user by RCS ID!"
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

export default AdminSearchBar;
