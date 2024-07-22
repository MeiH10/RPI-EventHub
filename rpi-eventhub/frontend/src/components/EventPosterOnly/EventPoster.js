import React, { useCallback, useState, useEffect } from 'react';
import style from './EventPoster.module.css';
import axios from 'axios';
import { useEvents } from '../../context/EventsContext';
import { useAuth } from '../../context/AuthContext';

const EventPoster = ({ id, title, posterSrc, description, author, tags }) => {
  const { username } = useAuth();
  const { deleteEvent, likeEvent } = useEvents();
  const [likeCount, setLikeCount] = useState(0); 

  const handleDelete = useCallback(async () => {
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, [id, deleteEvent]);

  useEffect (() => {
    fetchLike(); 
  }); 

  const canSeeDeleteButton = (user_name) => {
    return user_name === 'admin' || user_name === author;
  };

  const handleLike = useCallback(async () => {
    try {
      const response = await axios.put(`http://localhost:5000/events/${id}/like`); 
      setLikeCount(response.data.likes);
    } catch (error) {
      console.error('Failed to like event:', error);
    }
  }, [id]);

  const fetchLike = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/events/${id}/like`); 
      console.log("response: ", response);
      console.log("response pt.2! ", response.data); 
      setLikeCount(response.data.likes); 

    } catch (error) {
      console.error('Failed to fetch likes',error); 
    }
  })

  return (
    <div className={style.eventPosterContainer}>
      <img src={posterSrc} alt={title} className={style.eventPosterImg} />
      <div className={style.eventPosterDetails}>
        <h2 className={style.eventPosterTitle}>{title}</h2>
        <p className={style.eventPosterDescription}>{description}</p>
        {canSeeDeleteButton(username) && (
          <button onClick={handleDelete} className={`${style.deleteButton} btn-danger btn`}>
            Delete
          </button>
        )}
        <p>Posted by {author}</p>
        <ul>
          {tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
        <button onClick={handleLike} className={style['like-button']}>Like {likeCount}</button> 

      </div>
    </div>
  );
};

export default EventPoster;
