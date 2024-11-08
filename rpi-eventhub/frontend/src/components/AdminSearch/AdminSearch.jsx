import React, { useState } from 'react';
import adminSearchCSS from './AdminSearch.module.css';

// Mock data list of users
const mockRcsIds = [
  { rcsId: 'caravl', name: 'Leema Caravan', email: 'caravl@rpi.edu' },
  { rcsId: 'harim', name: 'Hari M', email: 'harim@rpi.edu' },
  { rcsId: 'eoinob', name: 'Eoin O’Brien', email: 'eoinob@rpi.edu' },
  { rcsId: 'fakel', name: 'Fake L', email: 'fakel@rpi.edu' },
  { rcsId: 'lastf', name: 'Last F', email: 'lastf@rpi.edu' },
  // Add more mock users as needed
];

const AdminSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users for autocomplete suggestions based on search term
  const filteredSuggestions = mockRcsIds.filter(user =>
    user.rcsId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={adminSearchCSS.searchContainer}>
      <input
        className={adminSearchCSS.searchInput}
        type="text"
        placeholder="Enter RCS ID, First Name, or Last Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      {/* Dropdown for autocomplete results placed directly below the input field */}
      {searchTerm && (
        <ul className={adminSearchCSS.dropdown}>
          {filteredSuggestions.map((user, index) => (
            <li
              key={index}
              className={adminSearchCSS.dropdownItem}
              onClick={() => setSearchTerm(user.rcsId)}
            >
              {user.name} ({user.rcsId})
            </li>
          ))}
          {filteredSuggestions.length === 0 && <li className={adminSearchCSS.noResult}>No results found</li>}
        </ul>
      )}

      {/* Display all users or filtered list */}
      <div className={adminSearchCSS.resultsContainer}>
        <h4>User List</h4>
        <ul>
          {(searchTerm ? filteredSuggestions : mockRcsIds).map((user, index) => (
            <li key={index} className={adminSearchCSS.userResult}>
              <p><strong>RCS ID:</strong> {user.rcsId}</p>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <button className={adminSearchCSS.promoteButton}>Promote</button>
              <button className={adminSearchCSS.banButton}>Ban</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminSearch;
