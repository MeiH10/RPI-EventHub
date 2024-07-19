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
    const [sortMethod, setSortMethod] = useState('date'); // Default sorting method
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order

    useEffect(() => {
        const fetchData = async () => {
            await fetchEvents(); // Call fetchEvents from context
            setIsLoading(false);
        };

        fetchData();
    }, [fetchEvents]); // Dependency array to prevent unnecessary re-renders
    const sortEvents = (events, sortMethod, sortOrder) => {
        switch (sortMethod) {
            case 'date':
                return events.sort((a, b) => sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
            case 'likes':
                return events.sort((a, b) => sortOrder === 'asc' ? a.likes - b.likes : b.likes - a.likes);
            case 'title':
                return events.sort((a, b) => sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
            default:
                return events;
        }
    };
    
    return (
        <div className="outterContainer">
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
                    sortEvents(events, sortMethod, sortOrder).map(event => (
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
