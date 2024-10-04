import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import Footer from '../../components/Footer/Footer';
import styles from './EventDetails.module.css';
import { useEvents } from '../../context/EventsContext';
import RsvpButton from '../../components/rsvp-button/RsvpButton';
import { DateTime } from 'luxon';

const timeZone = 'America/New_York';

const formatTime = (utcDateString) => {
    if (!utcDateString) return 'Unavailable';

    const dateTime = DateTime.fromISO(utcDateString, { zone: 'utc' }).setZone(timeZone);
    
    return dateTime.toFormat('h:mm a');
};

const formatDateAsEST = (utcDateString) => {
    if (!utcDateString) return 'Unavailable';

    const dateTime = DateTime.fromISO(utcDateString, { zone: 'utc' }).setZone(timeZone);
    
    return dateTime.toFormat('MMMM dd, yyyy');
};

const EventDetails = () => {
    const { eventId } = useParams();
    const { events, fetchEvents } = useEvents();

    useEffect(() => {
        if (events.length === 0) {
            fetchEvents();
        }
    }, [events, fetchEvents]);

    const event = events.find(event => event._id === eventId);

    if (!event) {
        return <p>Event not found.</p>;
    }

    const eventStartDateTime = event.startDateTime ? formatDateAsEST(event.startDateTime) : formatDateAsEST(event.date);
    const eventEndDateTime = event.endDateTime ? formatDateAsEST(event.endDateTime) : (event.endDate ? formatDateAsEST(event.endDate) : null);
    const eventStartTime = event.startDateTime ? formatTime(event.startDateTime) : formatTime(event.time);
    const eventEndTime = event.endDateTime ? formatTime(event.endDateTime) : formatTime(event.endTime);

    return (
        <div className='outterContainer'>
            <Navbar />
            <div className={`${styles.eventsDisplayContainer} containerFluid container-fluid`}>
                <div className={styles.container}>
                    <div className={styles.eventPoster}>
                        <img src={event.image || 'https://via.placeholder.com/300x450'} alt={event.title} />
                    </div>
                    <div className={styles.eventInfo}>
                        <h1>{event.title}</h1>
                        <p><strong>About:</strong> {event.description}</p>
                        <p><strong>Club/Organization:</strong> {event.club}</p>
                        <p><strong>Start:</strong> {eventStartDateTime} @ {eventStartTime}</p>
                        {eventEndDateTime && <p><strong>End:</strong> {`${eventEndDateTime} @ ${eventEndTime}`}</p>}
                        <p><strong>Location:</strong> {event.location || 'Location Unavailable'}</p>
                        {event.tags && event.tags.length > 0 && (
                            <p><strong>Tags:</strong> {event.tags.join(', ')}</p>
                        )}
                        {event.rsvp && <RsvpButton rsvp={event.rsvp} />}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EventDetails;
