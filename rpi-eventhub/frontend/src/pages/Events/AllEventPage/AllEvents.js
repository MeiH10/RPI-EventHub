import React, { useEffect, useState } from 'react';
import styles from './AllEvents.module.css';
import Navbar from "../../../components/Navbar/Navbar";
import FilterBar from '../../../components/FilterBar/FilterBar';
import Footer from "../../../components/Footer/Footer";
import EventPoster from "../../../components/EventPosterOnly/EventPoster";

import { useEvents } from '../../../context/EventsContext';
import { Skeleton } from '@mui/material';

function AllEvents() {
    const { events, fetchEvents, deleteEvent } = useEvents(); // Use deleteEvent from context
    const [isLoading, setIsLoading] = useState(true); // Add a loading state
    const [sortMethod, setSortMethod] = useState('date'); // Default sorting method
    const [sortOrder, setSortOrder] = useState('desc'); // Default sorting order
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [availableTags, setAvailableTags] = useState([]); 

    useEffect(() => {
        const fetchData = async () => {
            await fetchEvents(); // Call fetchEvents from context
            setIsLoading(false);
        };

        fetchData();
    }, [fetchEvents]); // Dependency array to prevent unnecessary re-renders

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
            <div className={styles.sortContainer}>
                <label htmlFor="sortMethod">Sort by: </label>
                <select
                    id="sortMethod"
                    value={sortMethod}
                    onChange={(e) => setSortMethod(e.target.value)}
                >
                    <option value="date">Date</option>
                    <option value="likes">Likes</option>
                    <option value="title">Title</option>
                </select>
                <label htmlFor="sortOrder">Order: </label>
                <select
                    id="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
            <div className="container-fluid" style={{ display: 'flex' }}>
                <FilterBar 
                    tags={availableTags} 
                    onFilterChange={handleFilterChange} 
                    filteredCount={filteredEvents.length} 
                />

                <div className={`${styles.eventsDisplayContainer}`} style={{ marginLeft: '270px', flex: 1 }}>

                {isLoading ? (
                    Array.from(new Array(10)).map((_, index) => (
                        <div key={index} className={styles.skeletonWrapper}>
                            <Skeleton variant="rectangular" width={400} height={533} />
                            <Skeleton variant="text" width={200} />
                            <Skeleton variant="text" width={150} />
                        </div>
                    ))
                ) : (
                    sortEvents(filteredEvents, sortMethod, sortOrder).map((event) => (
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
            </div>
            <Footer></Footer>
        </div>
    );
}



export default AllEvents;
