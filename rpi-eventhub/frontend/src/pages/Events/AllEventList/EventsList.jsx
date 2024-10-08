import React from "react";
import { useEvents } from '../../../context/EventsContext';
import styles from './EventsList.module.css';
import {Link} from "react-router-dom";

function EventsListCard( {event} ) {
    return (
        <Link to={`/events/${event._id}`}>
            <div className={styles.eventCard}>
                <div className={styles.eventCardContainer}>
                    <h3>
                        {event.title}

                        <small className={styles.tags}>
                            {event.tags.map(tag => (
                                <span key={tag} className={styles.tag}>{tag}</span>
                            ))}
                        </small>
                    </h3>
                    <p>{event.description}</p>
                </div>
            </div>
        </Link>

    )
}


function EventsList({events}) {

    return (
        <div className={styles.eventListView}>
            {events.map((event) => (
                <EventsListCard key={event._id} event={event}/>
            ))}
        </div>
    )
}

export default EventsList;