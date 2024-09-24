import React from "react";
import { useEvents } from '../../../context/EventsContext';
import styles from './EventsList.module.css';

function EventsListCard( {event} ) {
    return (
        <div className={styles.eventCard}>
            <h3>{event.title}</h3>

            <p>{event.description}</p>
        </div>
    )
}


function EventsList({events}) {

    return (
        <div className={styles.eventListView}>
            {events.map((event) => (
                <EventsListCard key={event._id} event={event} />
            ))}
        </div>
    )
}

export default EventsList;