import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventCard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventsContext';

const EventCard = ({ event }) => {
  const { username } = useAuth();
  const { deleteEvent } = useEvents();

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
        <p><strong>Date & Time:</strong> {`${event.time} on ${new Date(event.date).toLocaleDateString()}`}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <div className={styles.tags}>
          {event.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
