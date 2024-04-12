import React from 'react';
import './EventPoster.css';

const EventPoster = ({ posterSrc, title, description }) => {
    return (
        <div className="event-poster-container">
            <img src={posterSrc} alt={title} className="event-poster-img"/>
            <div className="event-poster-details">
                <h2 className="event-poster-title">{title}</h2>
                <p className="event-poster-description">{description}</p>
            </div>
        </div>
    );
};

export default EventPoster;
