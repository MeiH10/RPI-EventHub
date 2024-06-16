import React, { useCallback } from 'react';
import './EventPoster.css';
import { useEvents } from '../../context/EventsContext';

const EventPoster = ({ id, title, posterSrc, description }) => {
  const { deleteEvent } = useEvents();

  const handleDelete = useCallback(async () => {
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, [id, deleteEvent]);

  return (
    <div className="event-poster-container">
      <img src={posterSrc} alt={title} className="event-poster-img" />
      <div className="event-poster-details">
        <h2 className="event-poster-title">{title}</h2>
        <p className="event-poster-description">{description}</p>
        <button onClick={handleDelete} className="delete-button">Delete</button>
      </div>
    </div>
  );
};

export default EventPoster;
