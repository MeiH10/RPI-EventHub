import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import config from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState('');
    const [manageMode, setManageMode] = useState(false);

    /**
     * @param token { userId: user._id, email: user.email, role: user.role, username: user.username },
     */
    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        setIsLoggedIn(true);
        setUsername(decodedToken.username);
        setRole(decodedToken.role);
    };

    const logout = () => {
        console.log("Logging out");
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setRole(null);
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
                        setIsLoggedIn(true);
                        setUsername(decodedToken.username);
                        setRole(decodedToken.role);
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    setRole(null);
                }
            }
        };
        verifyToken();
    }, []);

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            role,
            login,
            logout,
            username,
            manageMode,
            setManageMode
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);