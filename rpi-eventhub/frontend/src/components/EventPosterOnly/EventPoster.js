import React, { useCallback } from 'react';
import style from './EventPoster.module.css';
import { useEvents } from '../../context/EventsContext';
import { useAuth } from '../../context/AuthContext';

const EventPoster = ({ id, title, posterSrc, description, author, tags }) => {
  console.log("tags: ", tags);
  const { username } = useAuth();  // Destructure username from useAuth
  const { deleteEvent } = useEvents();

  const handleDelete = useCallback(async () => {
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, [id, deleteEvent]);

  const canSeeDeleteButton = (user_name) => {
    console.log('user_name: ', user_name);
    console.log('author: ', author);

    if (user_name === 'admin' || user_name === author) {
      return true;
    }
    return false;
  }

  return (
    <div className={style.eventPosterContainer}>
      <img src={posterSrc} alt={title} className={style.eventPosterImg} />
      <div className={style.eventPosterDetails}>
        <h2 className={style.eventPosterTitle}>{title}</h2>
        <p className={style.eventPosterDescription}>{description}</p>
        {canSeeDeleteButton(username) && <button onClick={handleDelete} className="delete-button btn-danger btn">Delete</button>}
        <p>Posted by {author}</p>
        <ul>
          {tags.map((tag, index) =>(
          <li key={index}>{tag}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventPoster;
