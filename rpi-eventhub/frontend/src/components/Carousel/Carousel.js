import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Carousel.css'; // Ensure this CSS file contains your styles
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

// Import your placeholder image URL
const placeholderImage = 'https://via.placeholder.com/300x450';

const ImageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState([]);
  const intervalRef = useRef(null);

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/events'); // Adjust the URL to your backend endpoint
        const events = response.data.map(event => ({
          src: event.image || placeholderImage,
          caption: `${event.title} - ${event.location} - ${new Date(event.date).toLocaleDateString()}`,
        }));
        setImages(events);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex(current => (current === images.length - 1 ? 0 : current + 1));
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex(current => (current === 0 ? images.length - 1 : current - 1));
  }, [images.length]);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goToNext, 3000);
  }, [goToNext]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(intervalRef.current);
  }, [resetTimer]);

  return (
    <div className="carousel">
      <div className="main-image">
        <div className="caption-above">{images[activeIndex]?.caption}</div>
        <img src={images[activeIndex]?.src} alt={`Slide ${activeIndex}`} />
        <button onClick={() => { goToPrev(); resetTimer(); }} className="prev-button">
          <i className="bi bi-chevron-left"></i>
        </button>
        <button onClick={() => { goToNext(); resetTimer(); }} className="next-button">
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
