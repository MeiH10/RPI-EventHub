import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import Footer from '../../components/Footer/Footer';
import styles from './EventDetails.module.css';
import { useEvents } from '../../context/EventsContext';
import RsvpButton from '../../components/rsvp-button/RsvpButton';
import { format } from 'date-fns';

const formatTime = (timeString) => {
    let [hours, minutes] = timeString.split(':');
    hours = parseInt(hours, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes} ${ampm}`;
};

const formatDateAsEST = (utcDate) => {
    const date = new Date(utcDate);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const estDate = new Date(year, month, day);
    return estDate;
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

    // Call the formatDateAsEST function
    const eventDate = format(formatDateAsEST(event.date), 'MMMM do, yyyy');

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
                        <p><strong>Date:</strong> {eventDate}</p>
                        <p><strong>Time:</strong> {event.time && formatTime(event.time)}</p>
                        <p><strong>Location:</strong> {event.location}</p>
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
