import React, { useCallback, useEffect, useRef, useState } from 'react';
import style from './EventPoster.module.css';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventsContext';
import { useAuth } from '../../context/AuthContext';

const EventPoster = ({ id, title, posterSrc, description, author, tags }) => {
  const { username } = useAuth();
  const { deleteEvent } = useEvents();
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

  // Check if the delete button should be visible
  const canSeeDeleteButton = (user_name) => {
    return user_name === 'admin' || user_name === author;
  }

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
        {canSeeDeleteButton(username) && (
          <button onClick={handleDelete} className={style.deleteButton}>
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
      </div>
    </div>
  );
};

export default EventPoster;
