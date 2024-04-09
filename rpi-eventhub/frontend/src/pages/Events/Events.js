// Event.js
import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Banner from '../../components/EventHomePage/Banner/Banner';
import PopularEvents from '../../components/EventHomePage/PopularEvents/PopularEvents';
import Footer from '../../components/Footer/Footer';
import './Events.css';

function Event() {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    return (
        <div className="event-page">
            <Navbar />
            <div className="anim">
                <Banner />
            </div>
            
            <div className="anim">
                <PopularEvents />
            </div>
            
            <Footer />
        </div>
    );
}

export default Event;
