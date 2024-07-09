// src/pages/EventDetails/EventDetails.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import Footer from '../../components/Footer/Footer';
import styles from './EventDetails.module.css';

const EventDetails = ({ events }) => {
    const { eventId } = useParams();
    const event = events.find(event => event._id === eventId);

    if (!event) {
        return <p>Event not found.</p>;
    }

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.eventPoster}>
                    <img src={event.image || 'https://via.placeholder.com/300x450'} alt={event.title} />
                </div>
                <div className={styles.eventInfo}>
                    <h1>{event.title}</h1>
                    <p>{event.description}</p>
                    <p><strong>Author:</strong> {event.poster}</p>
                    <p><strong>Tags:</strong> {event.tags.join(', ')}</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EventDetails;
