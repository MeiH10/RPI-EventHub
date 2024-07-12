import React, { useEffect, useState } from 'react';
import styles from './AllEvents.module.css';

import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import EventPoster from "../../../components/EventPosterOnly/EventPoster";
import { useEvents } from '../../../context/EventsContext';
import { Skeleton } from '@mui/material';

function AllEvents() {
    const { events, fetchEvents, deleteEvent } = useEvents(); // Use deleteEvent from context
    const [isLoading, setIsLoading] = useState(true); // Add a loading state

    useEffect(() => {
        const fetchData = async () => {
            await fetchEvents(); // Call fetchEvents from context
            setIsLoading(false);
        };

        fetchData();
    }, [fetchEvents]); // Dependency array to prevent unnecessary re-renders

    return (
        <div className="allEvents">
            <Navbar />
            <div className={`${styles.eventsDisplayContainer} containerFluid container-fluid`}>
                {isLoading ? (
                    Array.from(new Array(10)).map((_, index) => (
                        <div key={index} className={styles.skeletonWrapper}>
                            <Skeleton variant="rectangular" width={400} height={533} />
                            <Skeleton variant="text" width={200} />
                            <Skeleton variant="text" width={150} />
                        </div>
                    ))
                ) : (
                    events.sort((a, b) => new Date(b.date) - new Date(a.date)).map(event => (
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
                    ))
                )}
            </div>
            <Footer></Footer>
        </div>
    );
}

export default AllEvents;
