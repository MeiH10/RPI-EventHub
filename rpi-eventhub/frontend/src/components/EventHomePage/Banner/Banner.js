// Banner.js
import React from 'react';
import './Banner.css';
import { Link } from 'react-router-dom';

function Banner() {
    return (
        <div className="banner">
            <h1>ALL EVENTS, IN ONE PLACE.</h1>
            <div className="search-bar-container">
                <input className="search-input" type="text" placeholder="Search for an event!" />
                <button className="search-button">Search</button>
            </div>
            <div>
                <h2><Link to="/all-events">See all events</Link></h2>
            </div>
        </div>
    );
}

export default Banner;
