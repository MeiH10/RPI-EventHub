// src/pages/EventDetails/EventDetails.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import Footer from '../../components/Footer/Footer';
import styles from './EventDetails.module.css';
import { useEvents } from '../../context/EventsContext';
import RsvpButton from '../../components/rsvp-button/RsvpButton';
import { format } from 'date-fns';


const EventDetails = () => {
    const { eventId } = useParams();
    const { events } = useEvents();
    const event = events.find(event => event._id === eventId);

    if (!event) {
        return <p>Event not found.</p>;
    }

    return (
        <div>
            <Navbar />
            <div className={`${styles.eventsDisplayContainer} containerFluid container-fluid`}>
            <div className={styles.container}>
                <div className={styles.eventPoster}>
                    <img src={event.image || 'https://via.placeholder.com/300x450'} alt={event.title} />
                </div>
                <div className={styles.eventInfo}>
                    <h1>{event.title}</h1>
                    <p><strong>About:</strong> {event.description}</p>
                    <p><strong>Club:</strong> {event.club}</p>
                    <p><strong>Date:</strong> {format(new Date(event.date), 'MMMM do, yyyy')}</p>
                    <p><strong>Time:</strong> {event.time}</p>
                    <p><strong>Tags:</strong> {event.tags.join(', ')} </p>
                    <RsvpButton />
                    
                </div>
            </div>
            </div>
            <Footer />
        </div>
    );
};

export default EventDetails;
