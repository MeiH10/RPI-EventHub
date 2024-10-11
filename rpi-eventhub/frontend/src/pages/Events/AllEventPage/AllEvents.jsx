import React, { useEffect, useState, useCallback } from 'react';
import styles from './AllEvents.module.css';
import Navbar from "../../../components/Navbar/Navbar";
import FilterBar from '../../../components/FilterBar/FilterBar';
import Footer from "../../../components/Footer/Footer";
import EventCard from '../../../components/EventCard/EventCard';
import { useEvents } from '../../../context/EventsContext';
import EventList from '../../../pages/Events/AllEventList/EventsList';
import { Skeleton } from '@mui/material';
import Masonry from 'react-masonry-css';
import axios from 'axios';

function AllEvents() {
    const { events, fetchEvents, deleteEvent } = useEvents();
    const [isLoading, setIsLoading] = useState(true);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [sortMethod, setSortMethod] = useState('likes');
    const [sortOrder, setSortOrder] = useState('desc');
    const [isListView, setIsListView] = useState(false);
    const [liked, setLiked] = useState([]) //Array of ids

    useEffect(() => {
        const fetchData = async () => {
            await fetchEvents();
            await getLikedEvents()
            setIsLoading(false);
        };

        const getLikedEvents = async () => {
            // Fetch user information or check user data to determine if the event is liked
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get(`http://localhost:5000/events/like/status`, {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                })
                setLiked(response.data); // Update the liked state based on the server response
            } catch (err) {
                console.error("Error fetching like status:", err);
            }
          };

        getLikedEvents()
        fetchData();
    }, [fetchEvents]);

    useEffect(() => {
        setFilteredEvents(events);
        const tags = [...new Set(events.flatMap(event => event.tags || []))];
        setAvailableTags(tags);
    }, [events]);

    const handleFilterChange = useCallback((filters) => {
        let filtered = events;
        if (filters.tags.length > 0) {
            filtered = filtered.filter(event =>
                filters.tags.every(tag => event.tags?.includes(tag))
            );
        }
        const now = new Date();
        if (filters.time.length > 0) {
            let timeFiltered = [];
            if (filters.time.includes('past')) {
                timeFiltered = timeFiltered.concat(
                    filtered.filter(event => new Date(event.startDateTime || event.date) < now)
                );
            }
            if (filters.time.includes('upcoming')) {
                timeFiltered = timeFiltered.concat(
                    filtered.filter(event => new Date(event.startDateTime || event.date) >= now)
                );
            }
            if (filters.time.includes('today')) {
                const todayStart = new Date();
                todayStart.setHours(0, 0, 0, 0);
                const todayEnd = new Date();
                todayEnd.setHours(23, 59, 59, 999);
                timeFiltered = timeFiltered.concat(
                    filtered.filter(event => {
                        const eventDate = new Date(event.startDateTime || event.date);
                        return eventDate >= todayStart && eventDate <= todayEnd;
                    })
                );
            }
            const uniqueTimeFiltered = [];
            const seenIds = new Set();
            timeFiltered.forEach(event => {
                if (!seenIds.has(event._id)) {
                    seenIds.add(event._id);
                    uniqueTimeFiltered.push(event);
                }
            });
            filtered = uniqueTimeFiltered;
        }
        setSortMethod(filters.sortMethod);
        setSortOrder(filters.sortOrder);
        setFilteredEvents(filtered);
    }, [events]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchEvents();
            setIsLoading(false);
        };

        fetchData();
    }, [fetchEvents]);

    useEffect(() => {
        const tags = [...new Set(events.flatMap(event => event.tags || []))];
        setAvailableTags(tags);

        const defaultFilters = {
            tags: [],
            time: ['upcoming', 'today'],
            sortMethod: 'likes',
            sortOrder: 'desc'
        };

        handleFilterChange(defaultFilters);
    }, [events, handleFilterChange]);

    const sortEvents = (events, sortMethod, sortOrder) => {
        const sortedEvents = [...events];
        switch (sortMethod) {
            case 'date':
                return sortedEvents.sort((a, b) => sortOrder === 'asc' 
                    ? new Date(a.startDateTime || a.date) - new Date(b.startDateTime || b.date) 
                    : new Date(b.startDateTime || b.date) - new Date(a.startDateTime || a.date));
            case 'likes':
                return sortedEvents.sort((a, b) => sortOrder === 'asc' ? a.likes - b.likes : b.likes - a.likes);
            case 'title':
                return sortedEvents.sort((a, b) => sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
            default:
                return sortedEvents;
        }
    };

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };

    const changeView = () => {
        setIsListView(!isListView);
    }

    return (
        <div className={styles.allEvents}>
            <Navbar />
            <div className="container-fluid"
                 style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
                <div className={styles.filterContainer}>
                    <FilterBar
                        tags={availableTags}
                        onFilterChange={handleFilterChange}
                        filteredCount={filteredEvents.length}
                        changeView={changeView}
                    />
                </div>
                {
                    isListView ?
                    (
                        <div className={styles.eventsDisplayContainer}>
                            <EventList
                                events={sortEvents(filteredEvents, sortMethod, sortOrder)}
                            />
                        </div>
                    ):(
                        <div className={styles.eventsDisplayContainer}>
                            {isLoading ? (
                                Array.from(new Array(10)).map((_, index) => (
                                    <div key={index} className={styles.skeletonWrapper}>
                                        <Skeleton variant="rectangular" width={400} height={533}/>
                                        <Skeleton variant="text" width={200}/>
                                        <Skeleton variant="text" width={150}/>
                                    </div>
                                ))
                            ) : (
                                <Masonry
                                    breakpointCols={breakpointColumnsObj}
                                    className={styles.myMasonryGrid}
                                    columnClassName={styles.myMasonryGridColumn}
                                >
                                    {sortEvents(filteredEvents, sortMethod, sortOrder).map((event) => (
                                        <EventCard isLiked={liked.includes(event._id.toString())} key={event._id} event={event}/>
                                    ))}
                                </Masonry>
                            )}
                        </div>
                    )
                }
            </div>
            <Footer />
        </div>
    );
}

export default AllEvents;
