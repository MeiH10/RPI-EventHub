// Event.js
import React from 'react';
import Navbar from '../../components/Navbar/Navbar'; // Assuming the path is correct
import Banner from '../../components/Banner/Banner';
import PopularEvents from '../../components/PopularEvents/PopularEvents';
import Footer from '../../components/Footer/Footer';
import './Events.css'; // Assuming CSS Modules are not used

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
