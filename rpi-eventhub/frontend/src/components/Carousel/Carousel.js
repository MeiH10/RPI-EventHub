import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css'; // Ensure this CSS file contains your styles
import poster1 from './poster1.jpeg';
import poster2 from './poster2.jpeg';
import poster3 from './poster3.png';
import poster4 from './poster4.jpeg';
import poster5 from './poster5.png';

const images = [poster1, poster2, poster3, poster4, poster5];

const ImageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null); // Use useRef to hold the interval ID

  // Function to go to the next image
  const goToNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  // Function to go to the previous image
  const goToPrev = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  // Function to reset and start the timer
  const resetTimer = () => {
    clearInterval(intervalRef.current); // Clear the existing timer
    intervalRef.current = setInterval(goToNext, 3000); // Start a new timer
  };

  useEffect(() => {
    resetTimer(); // Start the timer when the component mounts

    // Clear the timer when the component unmounts
    return () => clearInterval(intervalRef.current);
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div className="carousel">
      <div className="main-image">
        {/* Image Container */}
        <img src={images[activeIndex]} alt={`Slide ${activeIndex}`} />
        {/* Navigation Buttons */}
        <button onClick={() => { goToPrev(); resetTimer(); }} className="prev-button">←</button>
        <button onClick={() => { goToNext(); resetTimer(); }} className="next-button">→</button>
      </div>
    </div>
  );
};

export default ImageCarousel;
