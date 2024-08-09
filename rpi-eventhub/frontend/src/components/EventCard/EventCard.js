import React, { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventCard.module.css';
import axios from 'axios'; 
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventsContext';

const EventCard = ({ event }) => {
  const { username } = useAuth();
  const { deleteEvent } = useEvents();
  const [likeCount, setLikeCount] = useState(0); 
  const [liked, setLiked] = useState(false); 

  //Set up the webpage of w/ Like State
  useEffect(() => {
    fetchLike();
    fetchUserLikeStatus();
  }, [event._id]);

  // Handle delete event
  const handleDelete = useCallback(async () => {
    try {
      await deleteEvent(event._id);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, [event._id, deleteEvent]);

  // Check if the delete button should be visible
  const canSeeDeleteButton = (user_name) => {
    return user_name === 'admin' || user_name === event.poster;
  };

  const handleLike = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:5000/events/${event._id}/like`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLikeCount(response.data.likes);
      setLiked(!liked); 
    } catch (error) {
      console.error('Failed to like event:', error);
    }
  }, [event._id, liked]);

  const fetchLike = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/events/${event._id}/like`); 
      setLikeCount(response.data.likes); 
    } catch (error) {
      console.error('Failed to fetch likes', error); 
    }
  }, [event._id]);

  const fetchUserLikeStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5000/events/${event._id}/like/status`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Failed to fetch user like status:', error);
    }
  }, [event._id]);

  return (
    <div key={event._id} className={styles.eventWrapper}>
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
        <div className={styles.tags}>
          {event.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <button 
          onClick={handleLike} 
          className={`${styles['like-button']} ${liked ? styles.liked : styles.unliked}`}
        >
          Like {likeCount}
        </button>
      </div>
    </div>
  );
  
};

export default EventCard;
