import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const EventsContext = createContext(null);

export function useEvents() {
    return useContext(EventsContext);
}

export const EventsProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);

    useEffect(() => {
        if (events.length > 0) {
            const uniqueClubs = [...new Set(events.map(event => event.club).filter(Boolean))];
            const sortedClubs = uniqueClubs.sort((a, b) => a.localeCompare(b));
            setClubs(sortedClubs);
        }
    }, [events]);

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

    const updateEvent = useCallback(async (id, updatedEvent) => {
        try {
            const response = await axios.post(`${config.apiUrl}/events-update/${id}`, updatedEvent);
            // setEvents((prevEvents) => prevEvents.map(event => event._id === id ? response.data : event));
        } catch (error) {
            console.error('Failed to update event:', error);
        }
    }, []);

    return (
        <EventsContext.Provider value={{ events, clubs,fetchEvents, addEvent, deleteEvent, updateEvent }}>
            {children}
        </EventsContext.Provider>
    );
};
