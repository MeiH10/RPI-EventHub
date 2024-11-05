import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import Footer from '../../components/Footer/Footer';
import styles from './EventDetails.module.css';
import { useEvents } from '../../context/EventsContext';
import RsvpButton from '../../components/RSVPButton/RsvpButton';
import { DateTime } from 'luxon';
import { useAuth } from "../../context/AuthContext";


const timeZone = 'America/New_York';

const formatTime = (utcDateString) => {
    if (!utcDateString) return 'Unavailable';

    const dateTime = DateTime.fromISO(utcDateString, { zone: 'utc' }).setZone(timeZone);

    return dateTime.toFormat('h:mm a');
};

const formatDateAsEST = (utcDateString) => {
    if (!utcDateString) return 'Unavailable';

    const dateTime = DateTime.fromISO(utcDateString, { zone: 'utc' }).setZone(timeZone);

    return dateTime.toFormat('MMMM dd, yyyy');
};

const EventDetails = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { manageMode } = useAuth();

    useEffect(() => {
        setIsEditing(manageMode);
    }, [manageMode]);

    const { eventId } = useParams();
    const { events, fetchEvents, updateEvent } = useEvents();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        club: '',
        startDateTime: '',
        endDateTime: '',
        location: '',
        tags: '',
        image: '',
        rsvp: ''
    });

    useEffect(() => {
        if (events.length === 0) {
            fetchEvents();
        }
    }, [events, fetchEvents]);

    const event = events.find(event => event._id === eventId);

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title || '',
                description: event.description || '',
                club: event.club || '',
                startDateTime: event.startDateTime || '',
                endDateTime: event.endDateTime || '',
                location: event.location || '',
                tags: event.tags ? event.tags.join(', ') : '',
                image: event.image || '',
                rsvp: event.rsvp || ''
            });
        }
    }, [event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateEvent(eventId, formData);
    };

    if (!event) {
        return <p>Event not found.</p>;
    }

    const eventStartDateTime = event.startDateTime ? formatDateAsEST(event.startDateTime) : formatDateAsEST(event.date);
    const eventEndDateTime = event.endDateTime ? formatDateAsEST(event.endDateTime) : (event.endDate ? formatDateAsEST(event.endDate) : null);
    const eventStartTime = event.startDateTime ? formatTime(event.startDateTime) : formatTime(event.time);
    const eventEndTime = event.endDateTime ? formatTime(event.endDateTime) : formatTime(event.endTime);

    return (
        <div className='outterContainer'>
            <Navbar />
            <div className={`${styles.eventsDisplayContainer} containerFluid container-fluid`}>
                { isEditing ?
                    (
                        <div className="max-h-svh mx-auto p-6 rounded-lg">
                            <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
                                {/* Left Column */}
                                <div className="col-span-1">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">
                                            Image URL:
                                        </label>
                                        <input
                                            type="text"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    {formData.image ? (
                                        <div className="mt-4">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-full h-auto rounded-md shadow-md"
                                            />
                                        </div>
                                    ): (
                                        <div className="mt-4">
                                            <img
                                                src={event.image || 'https://via.placeholder.com/300x450'}
                                                alt="Preview"
                                                className="w-full h-auto rounded-md shadow-md"
                                            />
                                        </div>
                                    )
                                    }
                                </div>

                                {/* Right Column */}
                                <div className="max-w-lg col-span-2 grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-gray-700 font-medium mb-1">
                                        Title:
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block text-gray-700 font-medium mb-1">
                                            Description:
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows="5"
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">
                                            Club/Organization:
                                        </label>
                                        <input
                                            type="text"
                                            name="club"
                                            value={formData.club}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">
                                            Location:
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">
                                            Start Date and Time:
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="startDateTime"
                                            value={formData.startDateTime}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">
                                            End Date and Time:
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="endDateTime"
                                            value={formData.endDateTime}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">
                                            Tags:
                                        </label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">
                                            RSVP:
                                        </label>
                                        <input
                                            type="text"
                                            name="rsvp"
                                            value={formData.rsvp}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    ):
                    (
                        <div className={styles.container}>
                            <div className={styles.eventPoster}>
                                <img src={event.image || 'https://via.placeholder.com/300x450'} alt={event.title}/>
                            </div>
                            <div className={styles.eventInfo}>
                                <h1>{event.title}</h1>
                                <p><strong>About:</strong> {event.description}</p>
                                <p><strong>Club/Organization:</strong> {event.club}</p>
                                <p><strong>Start:</strong> {eventStartDateTime} @ {eventStartTime}</p>
                                {eventEndDateTime &&
                                    <p><strong>End:</strong> {`${eventEndDateTime} @ ${eventEndTime}`}</p>}
                                <p><strong>Location:</strong> {event.location || 'Location Unavailable'}</p>
                                {event.tags && event.tags.length > 0 && (
                                    <p><strong>Tags:</strong> {event.tags.join(', ')}</p>
                                )}
                                {event.rsvp !== "" && <RsvpButton rsvp={event.rsvp}/>}
                            </div>
                        </div>
                    )

                }

            </div>
            <Footer/>
        </div>
    )
        ;
};

export default EventDetails;