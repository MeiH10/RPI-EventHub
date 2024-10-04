import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Carousel.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import { Skeleton } from "@mui/material";
import config from "../../config";
import { format } from "date-fns";

const placeholderImage =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png";

// Format date to EST timezone
const formatDateAsEST = (utcDate) => {
  if (!utcDate) return "Date not specified";
  const date = new Date(utcDate);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const estDate = new Date(year, month, day);
  return estDate;
};

// Format time with AM/PM notation
const formatTime = (timeString) => {
  if (!timeString) return "Time not specified";
  let [hours, minutes] = timeString.split(":");
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

// Format date with a readable format
const formatDate = (dateString) => {
  if (!dateString) return "Date not specified";
  const date = formatDateAsEST(dateString);
  return format(date, "MMMM do, yyyy");
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
            // Fallback to "Unavailable" if new fields are missing
            date: event.startDateTime ? formatDate(event.startDateTime) : "Unavailable",
            endDate: event.endDateTime ? formatDate(event.endDateTime) : "Unavailable",
            time: event.startDateTime ? formatTime(new Date(event.startDateTime).toLocaleTimeString()) : "Unavailable",
            endTime: event.endDateTime ? formatTime(new Date(event.endDateTime).toLocaleTimeString()) : "Unavailable",
            originalDate: event.startDateTime || event.date // Use new field or fallback to older one
          }))
          .sort((a, b) => new Date(b.originalDate) - new Date(a.originalDate))
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
