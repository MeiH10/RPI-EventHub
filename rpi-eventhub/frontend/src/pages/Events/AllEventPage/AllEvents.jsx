import React, { useEffect, useState, useCallback } from 'react';
import styles from './AllEvents.module.css';
import Navbar from "../../../components/Navbar/Navbar";
import FilterBar from '../../../components/FilterBar/FilterBar';
import Footer from "../../../components/Footer/Footer";
import EventCard from '../../../components/EventCard/EventCard';
import { useEvents } from '../../../context/EventsContext';
import { Skeleton } from '@mui/material';
import Masonry from 'react-masonry-css';

function AllEvents() {
    const { events, fetchEvents, deleteEvent } = useEvents();
    const [isLoading, setIsLoading] = useState(true);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [sortMethod, setSortMethod] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');

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

    const handleFilterChange = useCallback((filters) => {
        let filtered = events;
        if (filters.tags.length > 0) {
            filtered = filtered.filter(event =>
                filters.tags.every(tag => event.tags.includes(tag))
            );
        }
        const now = new Date();
        if (filters.time.length > 0) {
            let timeFiltered = [];
            if (filters.time.includes('past')) {
                timeFiltered = filtered.filter(event => new Date(event.date) < now);
            }
            if (filters.time.includes('upcoming')) {
                timeFiltered = timeFiltered.concat(filtered.filter(event => new Date(event.date) >= now));
            }
            if (filters.time.includes('today')) {
                const todayStart = new Date();
                todayStart.setHours(0, 0, 0, 0);
                const todayEnd = new Date();
                todayEnd.setHours(23, 59, 59, 999);
                timeFiltered = timeFiltered.concat(filtered.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate >= todayStart && eventDate <= todayEnd;
                }));
            }
            filtered = timeFiltered;
        }
        setSortMethod(filters.sortMethod);
        setSortOrder(filters.sortOrder);
        setFilteredEvents(filtered);
    }, [events]);

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

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    return (
        <div className={styles.allEvents}>
            <Navbar />
            <div className="container-fluid" style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
                <div className={styles.filterContainer}>
                    <FilterBar
                        tags={availableTags}
                        onFilterChange={handleFilterChange}
                        filteredCount={filteredEvents.length}
                    />
                </div>
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
                            {sortEvents(filteredEvents, sortMethod, sortOrder).map((event) => (
                                <EventCard key={event._id} event={event} />
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