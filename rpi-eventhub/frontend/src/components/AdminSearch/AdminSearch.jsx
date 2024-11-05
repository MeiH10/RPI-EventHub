import React, { useEffect, useState } from 'react';
import adminSearchCSS from './AdminSearch.module.css';

const AdminSearch = () => {
  const [rcsIds, setRcsIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all RCS IDs when component mounts
    const fetchRcsIds = async () => {
      try {
        const response = await fetch('/api/admin/rcs-ids');
        const data = await response.json();
        setRcsIds(data);
      } catch (error) {
        console.error('Error fetching RCS IDs:', error);
      }
    };

    fetchRcsIds();
  }, []);

  const handleSearchClick = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter an RCS ID.");
      return;
    }

    try {
      const response = await fetch(`/api/admin/search/user?rcsId=${searchTerm}`);
      if (!response.ok) {
        throw new Error("User not found.");
      }
      const userData = await response.json();
      setSearchResults(userData);
      setError('');
    } catch (err) {
      setError(err.message);
      setSearchResults(null);
    }
  };

  return (
    <div className={adminSearchCSS.searchContainer}>
      <input
        className={adminSearchCSS.searchInput}
        type="text"
        placeholder="Enter RCS ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className={adminSearchCSS.searchButton} onClick={handleSearchClick}>
        Search
      </button>

      {error && <p className={adminSearchCSS.error}>{error}</p>}

      {searchResults && (
        <div className={adminSearchCSS.resultsContainer}>
          <h4>User Details</h4>
          <p><strong>RCS ID:</strong> {searchResults.rcs_id}</p>
          <p><strong>Name:</strong> {searchResults.name}</p>
          <p><strong>Email:</strong> {searchResults.email}</p>
        </div>
      )}

      <div className={adminSearchCSS.rcsList}>
        <h4>All RCS IDs:</h4>
        <ul>
          {rcsIds.map((rcsId, index) => (
            <li key={index}>{rcsId}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSearch;
