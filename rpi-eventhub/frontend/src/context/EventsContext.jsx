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
            await axios.delete(`${config.apiUrl}/events/${id}`);
            setEvents((prevEvents) => prevEvents.filter(event => event._id !== id));
        } catch (error) {
            console.error('Failed to delete event:', error);
        }
    }, []);

    return (
        <EventsContext.Provider value={{ events, fetchEvents, addEvent, deleteEvent }}>
            {children}
        </EventsContext.Provider>
    );
};
