import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import config from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [username, setUsername] = useState('');

    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(true);
        setUsername(decodedToken.username);
        setEmailVerified(decodedToken.emailVerified);
    };

    const logout = () => {
        console.log("Logging out");
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setEmailVerified(false);
        setUsername('');
    };

    const forgotPassword = async (email) => {
        try {
            await axios.post(`${config.apiUrl}/auth/forgot-password`, { email });
            console.log('Password reset email sent');
        } catch (error) {
            console.error('Failed to send password reset email:', error.response ? error.response.data : error.message);
        }
    };

    const resetPassword = async (token, password) => {
        try {
            await axios.post(`${config.apiUrl}/auth/reset-password/${token}`, { password });
            console.log('Password has been reset');
        } catch (error) {
            console.error('Failed to reset password:', error.response ? error.response.data : error.message);
        }
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
        <AuthContext.Provider value={{ isLoggedIn, emailVerified, login, logout, forgotPassword, resetPassword, username }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
