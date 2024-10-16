import React, { useCallback, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventCard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventsContext';
import { DateTime } from 'luxon';
import axios from "axios";
import config from '../../config';
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';

const timeZone = 'America/New_York';
const EventCard = ({ event, isLiked }) => {
  const { username } = useAuth();
  const { deleteEvent } = useEvents();
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();

  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(event.likes || 0);

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

  const canSeeDeleteButton = (user_name) => {
    return user_name === 'admin' || user_name === event.poster;
  };

  const eventDate = event.startDateTime
    ? formatDateAsEST(event.startDateTime)
    : 'Unavailable';
  
  const eventTime = event.startDateTime
    ? formatTimeAsEST(event.startDateTime)
    : 'Unavailable';

  const handleLikeToggle = async () => {
    const newLikedState = !liked; // Toggle the liked state

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
    }
  };

  const backgroundStyle = isDark
    ? { backgroundColor: '#120451' }
    : {
        background: `linear-gradient(
          217deg,
          rgba(255, 101, 101, 0.8),
          rgb(255 0 0 / 0%) 70.71%
        ), linear-gradient(127deg, rgba(255, 248, 108, 0.8), rgb(0 255 0 / 0%) 70.71%),
        linear-gradient(336deg, rgba(66, 66, 255, 0.8), rgb(0 0 255 / 0%) 70.71%)`,
      };

  return (
    <div
      key={event._id}
      className={`p-4 rounded-lg shadow-md ${isDark ? 'text-white' : 'text-black'}`}
      style={backgroundStyle}
      data-theme={theme}
    >
      <div className="relative">
        <img
          src={event.image || 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png'}
          loading="lazy"
          alt={event.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Link to={`/events/${event._id}`} className="text-white text-lg">
            <span>Open</span>
          </Link>
        </div>
      </div>
      <div className="mt-2">
        <p>Posted by {event.poster}</p>
      </div>
      {canSeeDeleteButton(username) && (
        <button onClick={handleDelete} className="mt-2 bg-red-500 text-white py-1 px-2 rounded">
          Delete
        </button>
      )}
      <div className="mt-4">
        <h2 className="text-xl font-bold">{event.title}</h2>
        <p>{event.description}</p>
        <p><strong>Date & Time:</strong> {`${eventTime} on ${eventDate}`}</p>
        <p><strong>Location:</strong> {event.location || "Location not specified"}</p>
        <div className="mt-2">
          {event.tags && event.tags.length > 0 ? (
            event.tags.map(tag => (
              <span key={tag} className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
                {tag}
              </span>
            ))
          ) : (
            <span className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
              No tags available
            </span>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <button
          className={`flex items-center ${liked ? 'text-red-500' : 'text-gray-500'}`}
          onClick={handleLikeToggle}
        >
          {likes}
          <span className="ml-1">{liked ? "❤️" : "🤍"}</span>
        </button>
      </div>
    </div>
  );
};

export default EventCard;