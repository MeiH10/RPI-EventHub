import React from 'react';
import './EventCard.css';

const EventCard = ({ title, posterSrc, description }) => {
    return (
        <div className="event-card">
            <div className="event-content">

                <div>
                    <h2 className="event-title">{title}</h2>
                    <img src={posterSrc} alt="Event Poster" className="event-poster"/>
                    <p className="event-description">{description}</p>
                </div>

            </div>
        </div>
    );
};

export default EventCard;
