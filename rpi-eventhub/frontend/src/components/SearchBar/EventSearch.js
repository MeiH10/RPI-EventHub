import { useEvents } from '../../context/EventsContext'; // Adjust the import path if necessary
import EventPoster from '../EventPosterOnly/EventPoster'; // Adjust the import path if necessary
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar.js'; 
const EventSearch = () => {
    const { events, fetchEvents } = useEvents();
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchPerformed, setSearchPerformed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        if (searchPerformed) {
            const searchWords = searchTerm.toLowerCase().split(' ');
            const filtered = events.filter(event => {
                const eventWords = event.title.toLowerCase().split(' ');
                return searchWords.some(word => eventWords.includes(word));
            });
            const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            setFilteredEvents(sorted);
        }
    }, [events, searchTerm, searchPerformed]);

    const handleSearchClick = () => {
        navigate.push(`/search-results?query=${encodeURIComponent(searchTerm)}`);
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            <h1>Event Search</h1>
            <SearchBar onSearchClick={handleSearchClick} onSearchInputChange={handleSearchInputChange} searchTerm={searchTerm}/>
            <div className="events-display-container">
                {searchPerformed && filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <EventPoster
                            key={event._id}
                            title={event.title}
                            posterSrc={event.image || 'https://via.placeholder.com/300x450'}
                            description={event.description}
                            width={300}
                            height={450}
                        />
                    ))
                ) : searchPerformed ? (
                    <p>No events match your search.</p>
                ) : (
                    <p>Enter a search term to find events.</p>
                )}
            </div>
        </div>
    );
};

export default EventSearch;
