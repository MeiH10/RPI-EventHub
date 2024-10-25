// src/pages/Admin/AdminPage.js
import React, { useState } from 'react';
import AdminSearchBar from '../../components/SearchBar/AdminSearchBar.jsx'; // Change the path to .jsx
import './AdminPage.css'; // Add any custom styles here

const AdminPage = () => {
    const [results, setResults] = useState([]); // Store the search results

    return (
        <div className="admin-page">
            <h1>Admin: Manage Users</h1>
            <AdminSearchBar setResults={setResults} />
            
            <div className="search-results">
                {results.length > 0 ? (
                    <ul>
                        {results.map(user => (
                            <li key={user._id}>
                                <span>{user.name} ({user.rcsId})</span>
                                <button className="promote-btn">Promote</button>
                                <button className="ban-btn">Ban</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No users found</p>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
