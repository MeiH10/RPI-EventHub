import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css'; // Ensure this CSS file contains your styles
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';



const placeholderImage = 'https://via.placeholder.com/518x671?text=No+Image+Available'; // URL to a default placeholder image

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    month: '2-digit', 
    day: '2-digit', 
    year: 'numeric', 
    weekday: 'short', 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  };
  return date.toLocaleDateString('en-US', options).replace(',', '').replace(',', ' @');
};

const ImageCarousel = () => {
  const [events, setEvents] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events'); // Adjust this to your actual API endpoint
        setEvents(response.data.map(event => ({
          src: event.image || placeholderImage, // Use the event image or the placeholder if no image exists
          caption: event.title,
          location: event.location,
          date: formatDate(event.date),// Format date as needed
          
        })));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);

  const goToNext = () => {
    setActiveIndex(current => current === events.length - 1 ? 0 : current + 1);
  };

  const goToPrev = () => {
    setActiveIndex(current => current === 0 ? events.length - 1 : current - 1);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goToNext, 3000);
  };

  const pauseAutoplay = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(intervalRef.current);
  }, [events]);



  return (
    <div className="carousel"
         onMouseEnter={pauseAutoplay} //pause carousel when on hover
         onMouseLeave={resetTimer}>
          
      <div className="main-image">
        {events.length > 0 && (
          <>
            <div className="caption-above">{`${events[activeIndex].caption.toUpperCase()}`}</div>
            <img src={events[activeIndex].src} alt={`Slide ${activeIndex}`} />
            <div className="caption-below">
              {`${events[activeIndex].location.toUpperCase()}  - ${events[activeIndex].date}`}
            </div>
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