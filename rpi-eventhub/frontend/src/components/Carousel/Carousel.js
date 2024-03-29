import React, { useState } from 'react';
import './Carousel.css'; // We'll create this file next for styling
import image1 from './image1.jpg';
import image2 from './image2.jpg';
import image3 from './image3.jpg';
import image4 from './image4.jpg';
import image5 from './image5.jpg';
const images = [
  image1,
  image2,
  image3,
  image4,
  image5
  // '/image1.jpg',
  // '/image2.jpg',
  // '/image3.jpg',
  // '/image4.jpg',
  // '/image5.jpg',
];

const ImageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrev = () => {
    const isFirstImage = activeIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = activeIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
  };

  const thumbnailClass = (index) => {
    return index === activeIndex ? 'thumbnail active' : 'thumbnail';
  };

  return (
    <div className="carousel">
      <div className="thumbnails">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            className={thumbnailClass(index)}
            alt={`Slide ${index}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
      <div className="main-image">
        {/* Image Container */}
        <img src={images[activeIndex]} alt={`Slide ${activeIndex}`} />
        {/* Navigation Buttons */}
        <button onClick={goToPrev} className="prev-button">←</button>
        <button onClick={goToNext} className="next-button">→</button>
      </div>
    </div>

  );
};

export default ImageCarousel;
