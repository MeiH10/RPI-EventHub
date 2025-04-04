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
    <div className={`${isDark ? 'flex flex-col items-center p-4' : 'flex flex-col items-center p-4'}`}>
      <input
        className={`${isDark ? 'w-4/5 p-3 text-[1.2rem] border border-gray-300 bg-[rgb(90,89,94)] rounded-md mb-4' : 'w-4/5 p-3 text-xl border border-gray-300 rounded-md mb-4'}`}
        type="text"
        placeholder="Enter RCS ID, First Name, or Last Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Dropdown for autocomplete results placed directly below the input field */}
      {searchTerm && (
        <ul className='absolute top-full left-0 w-full max-h-[200px] overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md z-10 mt-2 p-0'>
          {filteredSuggestions.map((user, index) => (
            <li
              key={index}
              className='p-3 cursor-pointer text-base border-b border-gray-200'
              onClick={() => setSearchTerm(user.rcsId)}
            >
              {user.name} ({user.rcsId})
            </li>
          ))}
          {filteredSuggestions.length === 0 && <li className='p-3 text-gray-500 text-base text-center'>No results found</li>}
        </ul>
      )}

      {/* Display all users or filtered list */}
      <div className='mt-4 text-left w-4/5'>
        <h4>User List</h4>
        <ul>
          {(searchTerm ? filteredSuggestions : users).map((user, index) => (
            <li key={index} className='flex items-center justify-evenly p-2 border-b border-gray-300'>
              <p>
              <strong>RCS ID:</strong> {user.rcsId} <br />
              <strong>Name:</strong> {user.name} <br />
              <strong>Email:</strong> {user.email}</p>

              {/* Dropdown for setting rank */}
              <label className='text-right mr-1'>
                <strong>Role Level: </strong>
                <select
                  className={`${isDark ? 'bg-[rgb(90,89,94)]' : ''}`}
                  value={user.role}
                  onChange={(e) => handleRankChange(user.rcsId, Number(e.target.value))}
                >
                  {[0, 1, 2, 3, 4].map(rank => (
                    <option key={rank} value={rank}>
                      {rank}
                    </option>
                  ))}
                </select>
              </label>

              {/* Ban button with toggle functionality */}
              <button
                className={user.role === 0 ? 'bg-[#4CAF50] text-white py-2 px-[6px] rounded cursor-pointer' : 'bg-[#f44336] text-white py-2 px-[16px] rounded cursor-pointer'}
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
          className='bg-[#029905] text-white py-3 px-6 text-base border-none rounded cursor-pointer mt-4'
          onClick={handleSave}
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default AdminSearch;