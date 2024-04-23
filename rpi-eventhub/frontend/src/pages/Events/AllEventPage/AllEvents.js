import React, { useState, useEffect } from 'react';
import './AllEvents.css';
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import EventPoster from "../../../components/EventPosterOnly/EventPoster";
import axios from 'axios';

function AllEvents() {
    const [events, setEvents] = useState([]); // State to hold events data

    useEffect(() => {
        // Fetch events from the database
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/events'); // Ensure this matches your actual API endpoint
                setEvents(response.data); // Set fetched events to state
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="all-events">
            <Navbar />
            <div className="events-display-container">
                {events.map(event => (
                    <EventPoster
                        key={event._id} 
                        title={event.title}
                        posterSrc={event.image || 'https://via.placeholder.com/300x450'} // Placeholder if no image URL
                        description={event.description}
                        width={300}  // Fake width for now, doesn't matter. defined in css
                        height={450}  // Fake height for now, doesn't matter. defined in css
                    />
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default AllEvents;
