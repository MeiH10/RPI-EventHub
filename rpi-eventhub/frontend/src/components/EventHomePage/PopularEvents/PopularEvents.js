import React from 'react';
import EventCard from '../EventCard/EventCard';
import style from './PopularEvents.module.css'

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
        <div className={style.popularEvents}>
            <h2 className={style.headers}>Popular Events</h2>
            <div className={style.eventsContainer}>
                <div className={`${style.eventNavigation} ${style.previous}`}>&#8592;</div>
                {events.map(event => (
                    <EventCard
                        key={event.id}
                        title={event.title}
                        posterSrc={event.posterSrc}
                        description={event.description}
                    />
                ))}
                <div className={`${style.eventNavigation} ${style.next}`}>&#8594;</div>
            </div>
        </div>
    );
}

export default PopularEvents;
