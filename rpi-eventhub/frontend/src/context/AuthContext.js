import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import config from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [username, setUsername] = useState('');


    const login = (token) => {
        // console.log("Logging in");
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        // console.log("Decoded Token on login: ", decodedToken);
        setIsLoggedIn(true);
        setUsername(decodedToken.username);
        setEmailVerified(decodedToken.emailVerified);
        // console.log("username after login: ", decodedToken.username);


        // console.log("emailVerified state after login: ", decodedToken.emailVerified);
    };

    const logout = () => {
        console.log("Logging out");
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setEmailVerified(false);
        setUsername(''); 
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
                        // console.log("Decoded Token on verify: ", decodedToken);
                        setIsLoggedIn(true);
                        setUsername(decodedToken.username);
                        setEmailVerified(decodedToken.emailVerified);
                        // console.log("emailVerified state after verify: ", decodedToken.emailVerified);
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('token');
                }
            }
        };
        verifyToken();
    }, []);

    useEffect(() => {
      console.log("Username state updated: ", username);
  }, [username]);

    return (
        <AuthContext.Provider value={{ isLoggedIn, emailVerified, login, logout, username }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
