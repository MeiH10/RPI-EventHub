import React, { useState, useEffect } from 'react';
import SearchBarCSS from './SearchBar.module.css'; // Adjust the import path if necessary
import { useEvents } from '../../context/EventsContext'; // Adjust the import path if necessary
import EventPoster from '../EventPosterOnly/EventPoster'; // Adjust the import path if necessary

const SearchBar = ({ onSearchClick, onSearchInputChange }) => {
    return (
        <div className={SearchBarCSS.searchBarContainer}>
            <input
                className={SearchBarCSS.searchInput}
                type="text"
                placeholder="Search for an event!"
                onChange={onSearchInputChange}
            />
            <button className={SearchBarCSS.searchButton} onClick={onSearchClick}>Search</button>
        </div>
    );
};

const EventSearch = () => {
    const { events, fetchEvents } = useEvents(); // Destructure events and fetchEvents from the context
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchPerformed, setSearchPerformed] = useState(false);

    useEffect(() => {
        fetchEvents(); // Fetch events on component mount
    }, [fetchEvents]);

    useEffect(() => {
        if (searchPerformed) {
            // Split the search term into an array of words
            const searchWords = searchTerm.toLowerCase().split(' ');

            // Filter and sort events
            const filtered = events.filter(event => {
                const eventWords = event.title.toLowerCase().split(' ');
                // Check if any word in the search term matches any word in the event title
                return searchWords.some(word => eventWords.includes(word));
            });
            const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            setFilteredEvents(sorted);
        }
    }, [events, searchTerm, searchPerformed]);

    const handleSearchClick = () => {
        setSearchPerformed(true);
        console.log('Search button clicked with term:', searchTerm);
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            <h1>Event Search</h1>
            <SearchBar onSearchClick={handleSearchClick} onSearchInputChange={handleSearchInputChange} />
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
