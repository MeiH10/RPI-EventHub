import React, { useState } from 'react';
import './ImageCarousel.css'; // We'll create this file next for styling

const images = [
  '/path/to/image1.jpg',
  '/path/to/image2.jpg',
  '/path/to/image3.jpg',
  '/path/to/image4.jpg',
  '/path/to/image5.jpg',
];

const ImageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

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
        <img src={images[activeIndex]} alt={`Slide ${activeIndex}`} />
        <button onClick={goToNext} className="next-button">→</button>
      </div>
    </div>
  );
};

export default ImageCarousel;
