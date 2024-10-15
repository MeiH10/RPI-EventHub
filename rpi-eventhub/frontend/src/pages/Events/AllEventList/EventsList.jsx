import React, { useContext } from "react";
import { useEvents } from '../../../context/EventsContext';
import styles from './EventsList.module.css';
import { Link } from "react-router-dom";
import { ThemeContext } from '../../../context/ThemeContext';
import { useColorScheme } from '../../../hooks/useColorScheme';

function EventsListCard({ event }) {
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
    );
}

function EventsList({ events }) {
    const { theme } = useContext(ThemeContext);
    const { isDark } = useColorScheme();

    const pageStyles = {
        background: isDark
            ? '#120451'
            : `linear-gradient(
                217deg,
                rgba(255, 101, 101, 0.8),
                rgb(255 0 0 / 0%) 70.71%
              ), linear-gradient(127deg, rgba(255, 248, 108, 0.8), rgb(0 255 0 / 0%) 70.71%),
              linear-gradient(336deg, rgba(66, 66, 255, 0.8), rgb(0 0 255 / 0%) 70.71%)`,
        color: isDark ? '#fff' : '#000',
    };

    return (
        <div className={styles.eventListView} style={pageStyles} data-theme={theme}>
            {events.map((event) => (
                <EventsListCard key={event._id} event={event} />
            ))}
        </div>
    );
}

export default EventsList;