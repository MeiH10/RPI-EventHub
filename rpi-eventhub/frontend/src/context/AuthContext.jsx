import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import config from '../config';
import { useEvents } from '../context/EventsContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [username, setUsername] = useState('');

    const {events, fetchEvents, deleteEvent} = useEvents();

    const getLikedEvents = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const response = await axios.get(`${config.apiUrl}/events/like/status`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLiked(response.data);
        } catch (err) {
            console.error("Error fetching like status:", err);
        }
    };

    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(true);
        setUsername(decodedToken.username);
        setEmailVerified(decodedToken.emailVerified);
        fetchEvents();
        getLikedEvents();

    };

    const logout = () => {
        console.log("Logging out");
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setEmailVerified(false);
        setUsername(''); 
        fetchEvents();
    };

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get(`${config.apiUrl}/verify-token`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        const decodedToken = jwtDecode(token);
                        setIsLoggedIn(true);
                        setUsername(decodedToken.username);
                        setEmailVerified(decodedToken.emailVerified);
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('token');
                }
            }
        };
        verifyToken();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, emailVerified, login, logout, username }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
