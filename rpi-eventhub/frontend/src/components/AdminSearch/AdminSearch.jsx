import React, { useState, useContext } from 'react';
import adminSearchCSS from './AdminSearch.module.css';
import { DarkModeToggle } from "../DarkMode/DarkMode";
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';

// Mock data list of users
const mockRcsIds = [
  { rcsId: 'caravl', name: 'Leema Caravan', email: 'caravl@rpi.edu', role: 2 },
  { rcsId: 'harim', name: 'Hari M', email: 'harim@rpi.edu', role: 2 },
  { rcsId: 'eoinob', name: 'Eoin O’Brien', email: 'eoinob@rpi.edu', role: 1 },
  { rcsId: 'fakel', name: 'Fake L', email: 'fakel@rpi.edu', role: 3 },
  { rcsId: 'lastf', name: 'Last F', email: 'lastf@rpi.edu', role: 0 },
];

const AdminSearch = () => {
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();

  const [users, setUsers] = useState(mockRcsIds);
  const [searchTerm, setSearchTerm] = useState('');
  const [changesMade, setChangesMade] = useState(false); // Track if changes have been made

  // Filter users for autocomplete suggestions based on search term
  const filteredSuggestions = users.filter(user =>
    user.rcsId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to handle rank change
  const handleRankChange = (rcsId, newRole) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.rcsId === rcsId ? { ...user, role: newRole } : user
      )
    );
    setChangesMade(true); // Mark changes as made
  };

  // Function to handle banning/unbanning a user
  const handleBan = (rcsId) => {
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.rcsId === rcsId) {
          // Toggle between 0 (banned) and previous role based on current role
          if (user.role === 0) {
            return { ...user, role: user.role === 1 ? 1 : 2 }; // If unbanned, set to 1 (unverified) or 2 (verified)
          } else {
            return { ...user, role: 0 }; // Set to 0 (banned)
          }
        }
        return user;
      })
    );
    setChangesMade(true); // Mark changes as made
  };

  // Function to save changes (could involve an API call in a real app)
  const handleSave = () => {
    console.log('Changes saved:', users);
    setChangesMade(false); // Reset changes made flag
    alert('Changes have been saved.');
  };

  return (
    <div className={`${adminSearchCSS.searchContainer} ${isDark ? adminSearchCSS.DarkSearchContainer : ''}`}>
      <input
        className={`${adminSearchCSS.searchInput} ${isDark ? adminSearchCSS.DarkSearchInput : ''}`}
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
          {(searchTerm ? filteredSuggestions : users).map((user, index) => (
            <li key={index} className={adminSearchCSS.userResult}>
              <p>
              <strong>RCS ID:</strong> {user.rcsId} <br />
              <strong>Name:</strong> {user.name} <br />
              <strong>Email:</strong> {user.email}</p>

              {/* Dropdown for setting rank */}
              <label className={adminSearchCSS.roleControl}>
                <strong>Role Level: </strong>
                <select
                  className={`${adminSearchCSS.rankDropdown} ${isDark ? adminSearchCSS.DarkRankDropdown : ''}`}
                  value={user.role}
                  onChange={(e) => handleRankChange(user.rcsId, Number(e.target.value))}
                >
                  {[0, 1, 2, 3].map(rank => (
                    <option key={rank} value={rank}>
                      {rank}
                    </option>
                  ))}
                </select>
              </label>

              {/* Ban button with toggle functionality */}
              <button
                className={user.role === 0 ? adminSearchCSS.unbanButton : adminSearchCSS.banButton}
                onClick={() => handleBan(user.rcsId)}
              >
                {user.role === 0 ? 'Unban' : 'Ban'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Save button */}
      {changesMade && (
        <button
          className={adminSearchCSS.saveButton}
          onClick={handleSave}
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default AdminSearch;