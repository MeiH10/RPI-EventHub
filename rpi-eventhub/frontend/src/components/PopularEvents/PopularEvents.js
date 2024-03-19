import React from 'react';
import './PopularEvents.css';
import EventCard from '../EventCard/EventCard';

// Sample data for popular events
const events = [
    {
        id: 1,
        title: 'RPI Osu! Club Tournament',
        posterSrc: 'https://via.placeholder.com/304x494',
        description: 'Join us for the ultimate Osu! showdown on July 27th, 2024; from 6pm to 8pm at the McKinney Room, Union.',
    },

];

function PopularEvents() {
    return (
        <div className="popular-events">
            <h2>Popular Events</h2>
            <div className="events-container">
                <div className="event-navigation previous">&#8592;</div>
                {events.map(event => (
                    <EventCard
                        key={event.id}
                        title={event.title}
                        posterSrc={event.posterSrc}
                        description={event.description}
                    />
                ))}
                <div className="event-navigation next">&#8594;</div>
            </div>
        </div>
    );
}

export default PopularEvents;
