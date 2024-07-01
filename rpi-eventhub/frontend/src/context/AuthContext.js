import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);

    const login = (token) => {
        console.log("Logging in");
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token on login: ", decodedToken);
        setIsLoggedIn(true);
        setEmailVerified(decodedToken.emailVerified);
        console.log("emailVerified state after login: ", decodedToken.emailVerified);
    };

    const logout = () => {
        console.log("Logging out");
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setEmailVerified(false);
    };

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:5000/verify-token', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        const decodedToken = jwtDecode(token);
                        console.log("Decoded Token on verify: ", decodedToken);
                        setIsLoggedIn(true);
                        setEmailVerified(decodedToken.emailVerified);
                        console.log("emailVerified state after verify: ", decodedToken.emailVerified);
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
        <AuthContext.Provider value={{ isLoggedIn, emailVerified, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
