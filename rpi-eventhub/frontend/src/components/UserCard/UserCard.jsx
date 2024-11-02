import React, { useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './EventCard.module.css';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventsContext';
import { DateTime } from 'luxon';
import axios from "axios";
import config from '../../config';
import ReactGA from "react-ga4";

const timeZone = 'America/New_York';

const UserCard = ({ user }) => {
  
  
  const { banUser } = useEvents();

  

  const handleBan = useCallback(async () => {
    try {
      await banUser(user._id);
    } catch (error) {
      console.error('Failed to ban user:', error);
    }
  }, [user._id, banUser]);



  


  const [likes, setLikes] = useState(user.likes || 0);

  const handlePromote = () => {
    
      
  };


  return (
    <div key={user._id} style={{ transition: 'border-width 0.25s ease, border-color 0.25s ease' }} className={`duration-500 ${styles.userWrapper} ${selected && 'border-8 border-indigo-400'}`}>
     
      <div className={styles.userDetails}>
        <p>{user.name}</p>
        <p>{user.email}</p>


        
      </div>
      <div className={styles.container}>
        <button onClick={handleBan} className={styles.deleteButton}>
            Ban
            </button>
      </div>
    </div>
  );
};

export default userCard;
