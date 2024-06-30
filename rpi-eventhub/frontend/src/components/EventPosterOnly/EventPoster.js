import React, { useCallback } from 'react';
import style from './EventPoster.module.css';
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
    <div className={style.eventPosterContainer}>
      <img src={posterSrc} alt={title} className={style.eventPosterImg} />
      <div className={style.eventPosterDetails}>
        <h2 className={style.eventPosterTitle}>{title}</h2>
        <p className={style.eventPosterDescription}>{description}</p>
        <button onClick={handleDelete} className="delete-button btn-danger btn">Delete</button>
      </div>
    </div>
  );
};

export default EventPoster;
