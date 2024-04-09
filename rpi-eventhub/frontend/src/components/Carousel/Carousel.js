import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css'; // Ensure this CSS file contains your styles
import image1 from './image1.jpg';
import image2 from './image2.jpg';
import image3 from './image3.jpg';
import image4 from './image4.jpg';
import image5 from './image5.jpg';

const images = [image1, image2, image3, image4, image5];

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
