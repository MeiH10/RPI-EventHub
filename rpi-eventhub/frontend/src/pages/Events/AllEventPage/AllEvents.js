import React, { useEffect } from 'react';
import './AllEvents.css';
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import EventPoster from "../../../components/EventPosterOnly/EventPoster";
import { useEvents } from '../../../context/EventsContext';

function AllEvents() {
    const { events, fetchEvents } = useEvents(); // Use events and fetchEvents from context

    useEffect(() => {
        fetchEvents(); // Call fetchEvents from context on component mount
    }, [fetchEvents]); // Dependency array to prevent unnecessary re-renders

  
    return (
        <div className="all-events">
            <Navbar />
            <div className="events-display-container">
                {events.sort((a, b) => new Date(b.date) - new Date(a.date)).map(event => (
                    <EventPoster
                        key={event._id}
                        title={event.title}
                        posterSrc={event.image || 'https://via.placeholder.com/300x450'} // Placeholder if no image URL
                        description={event.description}
                        width={300}  // Fake width for now
                        height={450}  // Fake height for now
                    />
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default AllEvents;
