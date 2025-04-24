import React, { useState, useContext, useEffect } from 'react';
import adminSearchCSS from './AdminSearch.module.css';
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';
import { useAuth } from '../../context/AuthContext';
import config from "../../config";
import axios from "axios";

const AdminSearch = () => {
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();
  const { isLoggedIn } = useAuth();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [changesMade, setChangesMade] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setError('You must be logged in to access this feature');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${config.apiUrl}/usernames`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);

        if (error.response && error.response.status === 403) {
          setError('You do not have permission to access user data');
        } else {
          setError('Failed to load user data. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isLoggedIn]);

  // filter users for autocomplete suggestions
  const filteredSuggestions = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // handle rank change
  const handleRankChange = (username, newRole) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.username === username ? { ...user, role: newRole } : user
      )
    );
    setChangesMade(true);
  };

  // handle banning/unbanning a user
  const handleBan = (username) => {
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.username === username) {
          if (user.role === 0) {
            return { ...user, role: user.role === 1 ? 1 : 2 };
          } else {
            return { ...user, role: 0 };
          }
        }
        return user;
      })
    );
    setChangesMade(true);
  };

  const handleSave = async () => {
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('You must be logged in to save changes');
        return;
      }

      await axios.post(`${config.apiUrl}/update-users`, {
        users: users
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setChangesMade(false);
      alert('Changes have been saved.');
    } catch (error) {
      console.error('Error saving changes:', error);

      if (error.response && error.response.status === 403) {
        setError('You do not have permission to update user data');
      } else {
        setError('Failed to save changes. Please try again later.');
      }
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading user data...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className={`${isDark ? 'flex flex-col items-center p-4' : 'flex flex-col items-center p-4'}`}>
      <input
        className={`${isDark ? 'w-4/5 p-3 text-[1.2rem] border border-gray-300 bg-[rgb(90,89,94)] rounded-md mb-4' : 'w-4/5 p-3 text-xl border border-gray-300 rounded-md mb-4'}`}
        type="text"
        placeholder="Enter Username"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <ul className='absolute top-full left-0 w-full max-h-[200px] overflow-y-auto bg-white border border-gray-300 rounded-md shadow-md z-10 mt-2 p-0'>
          {filteredSuggestions.map((user, index) => (
            <li
              key={index}
              className='p-3 cursor-pointer text-base border-b border-gray-200'
              onClick={() => setSearchTerm(user.username)}
            >
              {user.name} ({user.username})
            </li>
          ))}
          {filteredSuggestions.length === 0 && <li className='p-3 text-gray-500 text-base text-center'>No results found</li>}
        </ul>
      )}

      {/* display users */}
      <div>
        <h4 className='text-left'>User List</h4>
      </div>
      <div className='mt-4 text-left w-4/5 min-h-[30rem] max-h-[30rem] border overflow-y-auto p-2 rounded-md'>
        <ul>
          {(searchTerm ? filteredSuggestions : users).map((user, index) => (
            <li key={index} className='flex items-center justify-evenly p-2 border-b border-gray-300'>
              <p>
                <strong>Username:</strong> {user.username} <br />
                <strong>RCS ID:</strong> {user.email?.split('@')[0]} <br />
                <strong>Email:</strong> {user.email}</p>

              {/* Dropdown for setting rank */}
              <label className='text-right mr-1'>
                <strong>Role Level: </strong>
                <select
                  className={`${isDark ? 'bg-[rgb(90,89,94)]' : ''}`}
                  value={user.role}
                  onChange={(e) => handleRankChange(user.username, Number(e.target.value))}
                >
                  {[0, 1, 2, 3, 4].map(rank => (
                    <option key={rank} value={rank}>
                      {rank}
                    </option>
                  ))}
                </select>
              </label>

              {/* ban button */}
              <button
                className={user.role === 0 ? 'bg-[#4CAF50] text-white py-2 px-[6px] rounded cursor-pointer' : 'bg-[#f44336] text-white py-2 px-[16px] rounded cursor-pointer'}
                onClick={() => handleBan(user.username)}
              >
                {user.role === 0 ? 'Unban' : 'Ban'}
              </button>
            </li>
          ))}
        </ul>
      </div>

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