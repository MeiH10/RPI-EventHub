import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Carousel.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { Skeleton } from "@mui/material";
import config from "../../config";
import { DateTime } from "luxon";

const placeholderImage =
  "https://t3.ftcdn.net/jpg/05/04/28/96/360_F_504289605_zehJiK0tCuZLP2MdfFBpcJdOVxKLnXg1.jpg";

const timeZone = 'America/New_York';

const formatDateAsEST = (utcDateString) => {
  if (!utcDateString) return "Date not specified";

  const dateTime = DateTime.fromISO(utcDateString, { zone: 'utc' }).setZone(timeZone);
  return dateTime.toFormat('MMMM dd, yyyy');
};

const formatTimeAsEST = (utcDateString) => {
  if (!utcDateString) return 'Time not specified';

  const dateTime = DateTime.fromISO(utcDateString, { zone: 'utc' }).setZone(timeZone);
  return dateTime.toFormat('h:mm a');
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
          .map((event) => ({
            src: event.image || placeholderImage,
            caption: event.title,
            location: event.location || "Location not specified",
            date: event.startDateTime ? formatDateAsEST(event.startDateTime) : "Unavailable",
            endDate: event.endDateTime ? formatDateAsEST(event.endDateTime) : "Unavailable",
            time: event.startDateTime ? formatTimeAsEST(event.startDateTime) : "Unavailable",
            endTime: event.endDateTime ? formatTimeAsEST(event.endDateTime) : "Unavailable",
            originalDate: event.startDateTime || event.date,
            likes: event.likes || 0,
          }))

          .filter( a => new Date(a.originalDate) - new Date > 0)
          .sort((a, b) => b.likes - a.likes)

          .slice(0, 5);
  
        setEvents(sortedEvents);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
  
    fetchEvents();
  }, []);
  
  const goToNext = useCallback(() => {
    setActiveIndex((current) =>
      current === events.length - 1 ? 0 : current + 1
    );
  }, [events.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? events.length - 1 : current - 1
    );
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
    <div
      className="carousel"
      onMouseEnter={pauseAutoplay} // pause carousel when on hover
      onMouseLeave={resetTimer}
    >
      <div className={styles.carousel}>
        <div className={styles.mainImage}>
          {isLoading ? (
            <div>
              <Skeleton variant="rectangular" width={420} height={580} />
              <Skeleton variant="text" width={300} />
              <Skeleton variant="text" width={200} />
            </div>
          ) : (
            events.length > 0 && (
              <div className={styles.carouselCard}>
                <div className={styles.captionAbove}>
                  {events[activeIndex].caption}
                </div>
                <button
                  onClick={() => {
                    goToPrev();
                    resetTimer();
                  }}
                  className={styles.prevButton}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <div className={styles.imgContainer}>
                  <img
                    src={events[activeIndex].src}
                    alt={`Slide ${activeIndex}`}
                  />
                </div>
                <button
                  onClick={() => {
                    goToNext();
                    resetTimer();
                  }}
                  className={styles.nextButton}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
                <div className={styles.captionBelow}>
                  {`${events[activeIndex].location} - ${events[activeIndex].date} @ ${events[activeIndex].time}`}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
