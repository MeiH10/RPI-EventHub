import React, { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventCard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventsContext';
import { DateTime } from 'luxon';
import axios from "axios";
import config from '../../config';
import { toast } from 'react-toastify';
import ReactGA from "react-ga4";

const timeZone = 'America/New_York';

const BANNED = 0;
const UNVERIFIED = 1;
const VERIFIED = 2;
const OFFICER = 3;
const ADMIN = 4;


const EventCard = ({ event, isLiked, onSelect, selected, showEditButton, onEdit }) => {
  const {isLoggedIn} = useAuth();
  
  const { username, role } = useAuth();
  const { deleteEvent } = useEvents();

  const [liked, setLiked] = useState(isLiked)
  const [likes, setLikes] = useState(event.likes || 0);

  useEffect(() => {
    setLikes(event.likes || 0);
  }, [event.likes]);

  useEffect(() => {
    if (!isLoggedIn) {
      setLiked(false)
    } 
  }, [isLoggedIn])

  const handleDelete = useCallback(async () => {
    try {
      await deleteEvent(event._id);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, [event._id, deleteEvent]);

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

  const canSeeDeleteButton = (user_name, role) => {
    return role === ADMIN || user_name === event.poster;
  };

  const eventDate = event.startDateTime
    ? formatDateAsEST(event.startDateTime)
    : 'Unavailable';
  
  const eventTime = event.startDateTime
    ? formatTimeAsEST(event.startDateTime)
    : 'Unavailable';

  const handleLikeClick = () => {
    ReactGA.event({
      category: 'Like',
      action: 'Event Liked'
    });
  };

  const handleLikeToggle = async () => {
    const newLikedState = !liked; // Toggle the liked state
    handleLikeClick();
    if (!isLoggedIn) {
      return toast.error("Please login to like this event.");
    } 
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${config.apiUrl}/events/${event._id}/like`,
        { liked: newLikedState }, // Send the new like/unlike state
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setLikes(data.likes); // Update the likes count immediately
        setLiked(newLikedState); // Toggle the liked state
      }
    } catch (error) {
      console.error("Error while toggling like:", error);
      toast.error("An unexpected error occurred.");
    }
  };
  return (
    <div key={event._id} style={{ transition: 'border-width 0.25s ease, border-color 0.25s ease' }} className={`duration-500 ${styles.eventWrapper} ${selected && 'border-8 border-indigo-400'}`}>
      <div className={styles.imageContainer}>
        <img
          src={event.image || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'}
          loading="lazy"
          alt={event.title}
        />
        <div className={styles.overlay}>
          <Link to={`/events/${event._id}`} className={styles.overlayLink}>
            <span>Open</span>
          </Link>
        </div>
      </div>
      <div className={styles.eventPosterDetails}>
      <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" className='absolute right-4 mt-4 h-5 w-5' onChange={onSelect} checked={selected} />
        <p>Posted by {event.poster}</p>
      </div>
      {canSeeDeleteButton(username) && (
        <button onClick={handleDelete} className={styles.deleteButton}>
          Delete
        </button>
      )}
      <div className={styles.eventDetails}>
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p><strong>Date & Time:</strong> {`${eventTime} on ${eventDate}`}</p>
        <p><strong>Location:</strong> {event.location || "Location not specified"}</p>
        <div className={styles.tags}>
          {event.tags && event.tags.length > 0 ? (
            event.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))
          ) : (
            <span className={styles.tag}>No tags available</span>
          )}
        </div>
      </div>
      <div className={styles.likeContainer}>
        <button
          className={`${styles.likeButton} ${liked ? styles.liked : ""}`}
          onClick={handleLikeToggle}
        >
          {likes}
          <span>{liked ? "❤️" : "🤍"}</span>
        </button>
      </div>
      {showEditButton && (
        <div className={styles.editControls}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="btn btn-warning"
          >
            Edit Event
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
