import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import config from '../config';

const EventsContext = createContext(null);

export function useEvents() {
    return useContext(EventsContext);
}

export const EventsProvider = ({ children }) => {
    const [events, setEvents] = useState([]);

    const fetchEvents = useCallback(async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/events`);
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }, []);

    const addEvent = (newEvent) => {
        setEvents(currentEvents => [...currentEvents, newEvent]);
    };

    const deleteEvent = useCallback(async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${config.apiUrl}/events/${id}`, {headers: {Authorization: `Bearer ${token}`}});
            setEvents((prevEvents) => prevEvents.filter(event => event._id !== id));
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    }, []);

    const updateEvent = useCallback(async (id, updatedEvent) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${config.apiUrl}/events-update/${id}`, updatedEvent, {headers: {Authorization: `Bearer ${token}`}});
            // setEvents((prevEvents) => prevEvents.map(event => event._id === id ? response.data : event));
        } catch (error) {
            console.error('Failed to update event:', error);
        }
    }, []);

    return (
        <EventsContext.Provider value={{ events, fetchEvents, addEvent, deleteEvent, updateEvent }}>
            {children}
        </EventsContext.Provider>
    );
};
