import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css'; // Ensure this CSS file contains your styles
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const placeholderImage = 'https://via.placeholder.com/518x671?text=No+Image+Available'; // URL to a default placeholder image

const ImageCarousel = () => {
  const [events, setEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events'); // Adjust this to your actual API endpoint
        setEvents(response.data.map(event => ({
          src: event.image || placeholderImage, // Use the event image or the placeholder if no image exists
          caption: event.title,
          location: event.location,
          date: new Date(event.date).toLocaleString() // Format date as needed
        })));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);

  const goToNext = () => {
    setIsTransitioning(true); // Start transition
    setTimeout(() => {
      setActiveIndex(current => current === events.length - 1 ? 0 : current + 1);
      setIsTransitioning(false); // End transition
    }, 500); // Match the duration of the CSS opacity transition
  };
  
  const goToPrev = () => {
    setIsTransitioning(true); // Start transition
    setTimeout(() => {
      setActiveIndex(current => current === 0 ? events.length - 1 : current - 1);
      setIsTransitioning(false); // End transition
    }, 500); // Match the duration of the CSS opacity transition
  };
  
  

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goToNext, 3000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(intervalRef.current);
  }, [events]);

  return (
    <div className="carousel">
      <div className="main-image">
        {events.length > 0 && (
          <>
            <div className="caption-above">{`${events[activeIndex].caption} - ${events[activeIndex].location} - ${events[activeIndex].date}`}</div>
            <img
            src={events[activeIndex].src}
            alt={`Slide ${activeIndex}`}
            style={{ opacity: isTransitioning ? 0 : 1 }}
          />
            <button onClick={() => { goToPrev(); resetTimer(); }} className="prev-button">
              <i className="bi bi-chevron-left"></i>
            </button>
            <button onClick={() => { goToNext(); resetTimer(); }} className="next-button">
              <i className="bi bi-chevron-right"></i>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;
