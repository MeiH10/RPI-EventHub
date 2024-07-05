import React, { useEffect } from 'react';
import styles from './AllEvents.module.css'

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import EventPoster from "../../../components/EventPosterOnly/EventPoster";
import { useEvents } from '../../../context/EventsContext';

function AllEvents() {
    const { events, fetchEvents, deleteEvent } = useEvents(); // Use deleteEvent from context

    useEffect(() => {
        fetchEvents(); // Call fetchEvents from context on component mount
    }, [fetchEvents]); // Dependency array to prevent unnecessary re-renders

    return (
        <div className="allEvents">
            <Navbar />
            <div className={`${styles.eventsDisplayContainer} containerFluid container-fluid`}>
                {events.sort((a, b) => new Date(b.date) - new Date(a.date)).map(event => (
                    <EventPoster
                        key={event._id}
                        id={event._id} // Pass event ID
                        title={event.title}
                        posterSrc={event.image || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'} // Placeholder if no image URL
                        description={event.description}
                        width={300}  // Fake width for now
                        height={450}  // Fake height for now
                        onDelete={deleteEvent} // Pass deleteEvent function
                        author={event.poster}
                        tags={event.tags}
                    />
                ))}
            </div>
            <Footer></Footer>
        </div>
    );
};

export default AllEvents;