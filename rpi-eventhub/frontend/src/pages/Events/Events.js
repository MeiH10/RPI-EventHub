// Event.js
import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/Banner/Banner';
import PopularEvents from '../../components/PopularEvents/PopularEvents';
import Footer from '../../components/Footer/Footer';
import './Events.css';

function Event() {
    return (
        <div className="event-page">
            <Navbar />
            <Banner />
            <PopularEvents />
            <Footer />
        </div>
    );
}

export default Event;
