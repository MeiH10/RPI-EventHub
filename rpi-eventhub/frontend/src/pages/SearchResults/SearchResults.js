import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useEvents } from '../../context/EventsContext'; // Adjust the import path if necessary
import EventPoster from '../../components/EventPosterOnly/EventPoster'; // Adjust the import path if necessary
import './SearchResults.css';


import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
//import EventPoster from "../../../components/EventPosterOnly/EventPoster";
//import { useEvents } from '../../../context/EventsContext';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
    const { events, fetchEvents } = useEvents();
    const [filteredEvents, setFilteredEvents] = useState([]);
    const query = useQuery();
    const searchTerm = query.get('query');

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        if (searchTerm) {
            const searchWords = searchTerm.toLowerCase().split(' ');
            const filtered = events.filter(event => {
                const eventWords = event.title.toLowerCase().split(' ');
                return searchWords.some(word => eventWords.includes(word));
            });
            const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            setFilteredEvents(sorted);
        }
    }, [events, searchTerm]);
    return (
        <div>
        <h1>Search Results</h1>
        <div className="events-display-container">
            {filteredEvents.length > 0 ? (
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
            ) : (
                <p>No events match your search.</p>
            )}
        </div>
    </div>
    );
}

export default SearchResults;





















// const useQuery = () => {
//     return new URLSearchParams(useLocation().search);
// };

// const SearchResults = () => {
//     const { events, fetchEvents } = useEvents();
//     const [filteredEvents, setFilteredEvents] = useState([]);
//     const query = useQuery();
//     const searchTerm = query.get('query');

//     useEffect(() => {
//         fetchEvents();
//     }, [fetchEvents]);

//     useEffect(() => {
//         if (searchTerm) {
//             const searchWords = searchTerm.toLowerCase().split(' ');
//             const filtered = events.filter(event => {
//                 const eventWords = event.title.toLowerCase().split(' ');
//                 return searchWords.some(word => eventWords.includes(word));
//             });
//             const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
//             setFilteredEvents(sorted);
//         }
//     }, [events, searchTerm]);

//     return (
        // <div>
        //     <h1>Search Results</h1>
        //     <div className="events-display-container">
        //         {filteredEvents.length > 0 ? (
        //             filteredEvents.map(event => (
        //                 <EventPoster
        //                     key={event._id}
        //                     title={event.title}
        //                     posterSrc={event.image || 'https://via.placeholder.com/300x450'}
        //                     description={event.description}
        //                     width={300}
        //                     height={450}
        //                 />
        //             ))
        //         ) : (
        //             <p>No events match your search.</p>
        //         )}
        //     </div>
        // </div>
//     );
// };

// export default SearchResults;
