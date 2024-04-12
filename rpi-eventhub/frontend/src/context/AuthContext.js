import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}


export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emailVerified, setEmailVerified] = useState(null); // Initialize as null or undefined

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            setIsLoggedIn(true);
            // Fetch user details here if necessary, or assume it's set later
        }
    }, []);

    const login = (token, verified) => {
        localStorage.setItem('userToken', token);
        setIsLoggedIn(true);
        setEmailVerified(verified);  // Set based on response from the server
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        setEmailVerified(null); // Reset to uninitialized state
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, emailVerified, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
