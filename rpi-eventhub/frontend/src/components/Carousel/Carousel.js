import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Carousel.module.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { Skeleton } from '@mui/material';
import config from '../../config';
import { format } from 'date-fns';

const placeholderImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'; 

const formatTime = (timeString) => {
  let [hours, minutes] = timeString.split(':');
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const formatDateAsEST = (utcDate) => {
  const date = new Date(utcDate);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const estDate = new Date(year, month, day);
  return estDate;
};

const formatDate = (dateString) => {
  const date = formatDateAsEST(dateString);
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
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/events`);
        const sortedEvents = response.data
          .map(event => ({
            src: event.image || placeholderImage,
            caption: event.title,
            location: event.location,
            date: formatDate(event.date),
            time: event.time && formatTime(event.time),
            originalDate: event.date,
          }))
          .sort((a, b) => new Date(b.originalDate) - new Date(a.originalDate))
          .slice(0, 5);

        setEvents(sortedEvents);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex(current => current === events.length - 1 ? 0 : current + 1);
  }, [events.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex(current => current === 0 ? events.length - 1 : current - 1);
  }, [events.length]);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goToNext, 3000);
  }, [goToNext]);

  const pauseAutoplay = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!isLoading) {
      resetTimer();
    }
    return () => clearInterval(intervalRef.current);
  }, [events, isLoading, resetTimer]);

  return (
    <div className="carousel"
         onMouseEnter={pauseAutoplay} // pause carousel when on hover
         onMouseLeave={resetTimer}>
      <div className={styles.carousel}>
        <div className={styles.mainImage}>
          {isLoading ? (
            <div>
              <Skeleton variant="rectangular" width={420} height={580} />
              <Skeleton variant="text" width={300} />
              <Skeleton variant="text" width={200} />
            </div>
          ) : events.length > 0 && (
            <div className={styles.carouselCard}>
              <div className={styles.captionAbove}>{`${events[activeIndex].caption}`}</div>
              <button onClick={() => { goToPrev(); resetTimer(); }} className={styles.prevButton}>
                <i className="bi bi-chevron-left"></i>
              </button>
              <div className={styles.imgContainer}>
                <img src={events[activeIndex].src} alt={`Slide ${activeIndex}`} />
              </div>
              <button onClick={() => { goToNext(); resetTimer(); }} className={styles.nextButton}>
                <i className="bi bi-chevron-right"></i>
              </button>
              <div className={styles.captionBelow}>
                {`${events[activeIndex].location} - ${events[activeIndex].date} ${events[activeIndex].time}`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
