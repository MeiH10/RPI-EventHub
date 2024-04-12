import React from 'react';
import './EventPoster.css';

const EventPoster = ({ title, posterSrc, description, width, height }) => {
    return (
        <div className="event-poster-container" style={{ width: width, height: height }}>
            <img src={posterSrc} alt={title} className="event-poster-img" style={{ width: '100%', height: '100%' }}/>
            <div className="event-poster-details">
                <h2 className="event-poster-title">{title}</h2>
                <p className="event-poster-description">{description}</p>
            </div>
        </div>
    );
};

export default EventPoster;
