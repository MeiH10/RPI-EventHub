import React from 'react';
import './AllEvents.css';
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import EventPoster from "../../../components/EventPosterOnly/EventPoster";

const events = [
    {
        id: 1,
        title: 'RPI Osu! Club Tournament',
        posterSrc: 'https://via.placeholder.com/304x494',
        description: 'Join us for the ultimate Osu! showdown on July 27th, 2024; from 6pm to 8pm at the McKinney Room, Union.',
    },
    {
        id: 2,
        title: 'RPI Chess Club Finals',
        posterSrc: 'https://via.placeholder.com/304x494',
        description: 'Witness the grand finals of the RPI Chess Club on August 15th, 2024; from 2pm to 5pm at the Union Games Room.',
    },

];

function AllEvents() {
    return (
        <div className="all-events">
            <Navbar />
            <div className="events-display-container">
                {events.map(event => (
                    <EventPoster
                        key={event.id}
                        title={event.title}
                        posterSrc={event.posterSrc}
                        description={event.description}
                    />
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default AllEvents;