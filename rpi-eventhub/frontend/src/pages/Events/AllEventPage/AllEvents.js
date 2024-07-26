import React, { useEffect, useState } from 'react';
import styles from './AllEvents.module.css';
import Navbar from "../../../components/Navbar/Navbar";
import FilterBar from '../../../components/FilterBar/FilterBar';
import Footer from "../../../components/Footer/Footer";
import { useEvents } from '../../../context/EventsContext';
import { Skeleton } from '@mui/material';
import Masonry from 'react-masonry-css';

function AllEvents() {
    const { events, fetchEvents, deleteEvent } = useEvents();
    const [isLoading, setIsLoading] = useState(true);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchEvents();
            setIsLoading(false);
        };

        fetchData();
    }, [fetchEvents]);

    useEffect(() => {
        setFilteredEvents(events);
        const tags = [...new Set(events.flatMap(event => event.tags))];
        setAvailableTags(tags);
    }, [events]);

    const handleFilterChange = (filters) => {
        let filtered = events;
        if (filters.tags.length > 0) {
            filtered = filtered.filter(event =>
                filters.tags.every(tag => event.tags.includes(tag))
            );
        }
        const now = new Date();
        if (filters.time.length > 0) {
            if (filters.time.includes('past')) {
                filtered = filtered.filter(event => new Date(event.date) < now);
            }
            if (filters.time.includes('upcoming')) {
                filtered = filtered.filter(event => new Date(event.date) >= now);
            }
            if (filters.time.includes('today')) {
                const todayStart = new Date(now.setHours(0, 0, 0, 0));
                const todayEnd = new Date(now.setHours(23, 59, 59, 999));
                filtered = filtered.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate >= todayStart && eventDate <= todayEnd;
                });
            }
        }
        setFilteredEvents(filtered);
    };

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    return (
        <div className={styles.allEvents}>
            <Navbar />
            <div className="container-fluid" style={{ display: 'flex' }}>
                <FilterBar 
                    tags={availableTags} 
                    onFilterChange={handleFilterChange} 
                    filteredCount={filteredEvents.length} 
                />

                <div className={styles.eventsDisplayContainer}>
                    {isLoading ? (
                        Array.from(new Array(10)).map((_, index) => (
                            <div key={index} className={styles.skeletonWrapper}>
                                <Skeleton variant="rectangular" width={400} height={533} />
                                <Skeleton variant="text" width={200} />
                                <Skeleton variant="text" width={150} />
                            </div>
                        ))
                    ) : (
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className={styles.myMasonryGrid}
                            columnClassName={styles.myMasonryGridColumn}
                        >
                            {filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date)).map(event => (
                                <div key={event._id} className={styles.eventWrapper}>
                                    <img
                                        src={event.image || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'}
                                        loading="lazy"
                                    />
                                    <div className={styles.eventDetails}>
                                        <h2>{event.title}</h2>
                                        <p>{event.description}</p>
                                        <div className={styles.tags}>
                                            {event.tags.map(tag => (
                                                <span key={tag} className={styles.tag}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Masonry>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AllEvents;