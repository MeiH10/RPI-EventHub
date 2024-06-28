import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const login = (token) => {
        console.log("Logging in");
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        console.log("Logging out");
        localStorage.removeItem('token');
        setIsLoggedIn(false);
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
                  setIsLoggedIn(true);
                }
              } catch (error) {
                console.error('Token verification failed:', error);
                localStorage.removeItem('token'); 
              }
            }
          };
          verifyToken();

    });





    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
