import React, { useCallback, useEffect, useRef, useState } from 'react';
import style from './EventPoster.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { useEvents } from '../../context/EventsContext';
import { useAuth } from '../../context/AuthContext';

const BANNED = 0;
const UNVERIFIED = 1;
const VERIFIED = 2;
const OFFICER = 3;
const ADMIN = 4;

const EventPoster = ({ id, title, posterSrc, description, author, tags }) => {
  const { username, role } = useAuth();
  const { deleteEvent } = useEvents();
  const [likeCount, setLikeCount] = useState(0); 
  const [liked, setLiked] = useState(false); 

  const [imageSize, setImageSize] = useState(null);
  const [imgHeight, setImgHeight] = useState(0); // State to store image height
  const posterRef = useRef(null);

  // Handle delete event
  const handleDelete = useCallback(async () => {
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }, [id, deleteEvent]);

  useEffect(() => {
    fetchLike();
    fetchUserLikeStatus();
  }, [id]);

  const canSeeDeleteButton = (user_name, role) => {
    return role === ADMIN || user_name === author;
  };

  const handleLike = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(`http://localhost:5000/events/${id}/like`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLikeCount(response.data.likes);
      setLiked(!liked); // Toggle the liked state
    } catch (error) {
      console.error('Failed to like event:', error);
    }
  }, [id, liked]);

  const fetchLike = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/events/${id}/like`); 
      setLikeCount(response.data.likes); 
    } catch (error) {
      console.error('Failed to fetch likes', error); 
    }
  }, [id]);

  const fetchUserLikeStatus = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5000/events/${id}/like/status`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Failed to fetch user like status:', error);
    }
  }, [id]);


  // Fetch image size
  useEffect(() => {
    const fetchImageSize = async () => {
      try {
        const response = await fetch(posterSrc, { method: 'HEAD' });
        const contentLength = response.headers.get('Content-Length');
        if (contentLength) {
          setImageSize((parseInt(contentLength) / 1024).toFixed(2));
        }
      } catch (error) {
        console.error('Failed to fetch image size:', error);
      }
    };

    fetchImageSize();
  }, [posterSrc]);

  // Dynamically adjust card size based on image dimensions
  useEffect(() => {
    const handleLoad = () => {
      const poster = posterRef.current;
      if (poster) {
        const img = poster.querySelector('img');
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const maxHeight = 600; // Adjust as needed
        const calculatedHeight = Math.min(maxHeight, img.offsetWidth / aspectRatio);
        setImgHeight(calculatedHeight);
      }
    };

    const img = posterRef.current.querySelector('img');
    img.addEventListener('load', handleLoad);

    if (img.complete) {
      handleLoad();
    }

    return () => {
      img.removeEventListener('load', handleLoad);
    };
  }, [posterSrc]);

  return (
    <div className={style.eventPosterContainer} ref={posterRef} style={{ height: imgHeight }}>
      <img src={posterSrc} alt={title} className={style.eventPosterImg} />
      <div className={style.eventPosterDetails}>
        <Link to={`/events/${id}`} className={style.eventLink}>
          <h1 className={style.eventPosterTitle}>{title}</h1>
        </Link>
        <p className={style.eventPosterDescription}>{description}</p>
        {canSeeDeleteButton(username, role) && (
          <button onClick={handleDelete} className={`${style.deleteButton} btn-danger btn`}>
            Delete
          </button>
        )}
        <p>Posted by {author}</p>
        {imageSize && <p>Image Size: {imageSize} KB</p>}
        <ul>
          {tags.map((tag, index) => (
            <li key={index}>{tag}</li>
          ))}
        </ul>
        <button onClick={handleLike} 
         className={`${style['like-button']} ${liked ? style.liked : style.unliked}`}>Like {likeCount}</button> 
      </div>
    </div>
  );
};

export default EventPoster;
