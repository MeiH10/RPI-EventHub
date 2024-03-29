// Banner.js
import React from 'react';
import './Banner.css';

function Banner() {
    return (
        <div className="banner">
            <h1>ALL EVENTS</h1>
            <div className="search-container">
                <input type="text" placeholder="Search for an event!" />
                <button>Search</button>
            </div>
        </div>
    );
}

export default Banner;
