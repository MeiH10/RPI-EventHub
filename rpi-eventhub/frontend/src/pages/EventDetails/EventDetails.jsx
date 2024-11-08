import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import Footer from '../../components/Footer/Footer';
import styles from './EventDetails.module.css';
import { useEvents } from '../../context/EventsContext';
import RsvpButton from '../../components/RSVPButton/RsvpButton';
import { DateTime } from 'luxon';
import { useAuth } from "../../context/AuthContext";
import * as pdfjsLib from "pdfjs-dist";
import {handleFileChange} from "../../components/CreateEventModal/CreateEventModal";
import axios from "axios";
import config from "../../config";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;



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
    const [isOwner, setIsOwner] = useState(false);
    const { manageMode, username } = useAuth();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [tags, setTags] = useState([]);
    const [showOriginalImage, setShowOriginalImage] = useState(true);


    const { eventId } = useParams();
    const { events, fetchEvents, updateEvent } = useEvents();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        poster: '',
        club: '',
        startDateTime: '',
        endDateTime: '',
        location: '',
        tags: '',
        file: '',
        rsvp: ''
    });

    const suggestedTags = [
        'fun', 'games', 'board games', 'food', 'social', 'competition',
        'movie', 'anime', 'academic', 'professional', 'career', 'relax',
        'outdoor', 'workshop', 'fundraiser', 'art', 'music', 'networking',
        'sports', 'creative', 'tech', 'wellness', 'coding', 'other'
    ];

    const handleAddTag = (tag) => {
        setTags(prevTags => {
            let newTags;
            if (prevTags.includes(tag)) {
                newTags = prevTags.filter(t => t !== tag);
            } else if (prevTags.length < 10) {
                newTags = [...prevTags, tag];
            } else {
                newTags = prevTags;
            }
            setFormData(prevState => ({
                ...prevState,
                tags: newTags
            }));
            return newTags;
        });

    };

    useEffect(() => {
        if (events.length === 0) {
            fetchEvents();
        }
    }, [events, fetchEvents]);

    const event = events.find(event => event._id === eventId);

    useEffect(() => {
        if (event && username) {
            setIsEditing(manageMode && event.poster === username);
            setIsOwner(event.poster === username);
        }
    }, [manageMode, event, username]);

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title || '',
                description: event.description || '',
                poster: event.poster || '',
                club: event.club || '',
                startDateTime: '',
                endDateTime: '',
                location: event.location || '',
                tags: event.tags || '',
                file: '',
                rsvp: event.rsvp || ''
            });
            setTags(event.tags || []);
        }
    }, [event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        console.log('tags:', tags);
        console.log('formData:', formData);

        const submittedFormData = new FormData();
        submittedFormData.append('title', formData.title);
        submittedFormData.append('description', formData.description);
        submittedFormData.append('poster', formData.poster);
        submittedFormData.append('club', formData.club);
        submittedFormData.append('startDateTime', formData.startDateTime || event.startDateTime);
        submittedFormData.append('endDateTime', formData.endDateTime || event.endDateTime);
        submittedFormData.append('location', formData.location);
        tags.forEach(tag => {
            submittedFormData.append('tags[]', tag);
        });
        submittedFormData.append('rsvp', formData.rsvp);

        if (file !== null) {
            submittedFormData.append('file', file);
            console.log('file:', file);
        }

        console.log('submitting form data:', submittedFormData);
        console.log('Form data is valid:', submittedFormData);
        try {
            const response = await axios.post(`${config.apiUrl}/events-update/${eventId}`, submittedFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Event updated successfully:', response.data);
        } catch (error) {
            console.error('Failed to update event:', error);
        }

    };

    if (!event) {
        return <p>Event not found.</p>;
    }

    function handleImageFileChange(e) {
        toggleImage();
        handleFileChange (e, setPreview, setFile, setError);
    }

    function toggleImage() {
        setShowOriginalImage((prevState) => !prevState);
    }

    const eventStartDateTime = event.startDateTime ? formatDateAsEST(event.startDateTime) : formatDateAsEST(event.date);
    const eventEndDateTime = event.endDateTime ? formatDateAsEST(event.endDateTime) : (event.endDate ? formatDateAsEST(event.endDate) : null);
    const eventStartTime = event.startDateTime ? formatTime(event.startDateTime) : formatTime(event.time);
    const eventEndTime = event.endDateTime ? formatTime(event.endDateTime) : formatTime(event.endTime);


    return (
        <div className='outterContainer'>
            <Navbar />
            <div className={`${styles.eventsDisplayContainer} containerFluid container-fluid`}>
                { isEditing&&isOwner ?
                    (
                        <div className="mx-auto p-4 md:p-6 max-w-screen-lg min-h-screen">
                            {error && <div className="text-red-500 text-center">{error}</div>}
                            <form className="grid grid-cols-1 gap-6">
                                <div className="flex flex-col lg:grid lg:grid-cols-9 gap-6">
                                    <div className="col-span-3">
                                        <div className="items-center">
                                            <input
                                                id="image-upload"
                                                type="file"
                                                onChange={handleImageFileChange}
                                                accept=".jpg, .jpeg, .png, .webp, .pdf"
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="inline-block cursor-pointer px-4 py-2 mt-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                                            >
                                                Choose Image/PDF File
                                            </label>
                                            <button
                                                type="button"
                                                onClick={toggleImage}
                                                className="ml-0 sm:ml-2 inline-block px-4 py-2 mt-2 text-white bg-gray-600 rounded hover:bg-gray-700 transition"
                                            >
                                                {showOriginalImage ? 'Show Preview' : 'Show Original'}
                                            </button>
                                        </div>
                                        <div className="mt-4">
                                            <img
                                                src={showOriginalImage? event.image : preview || 'https://via.placeholder.com/300x450'}
                                                alt="Preview"
                                                className="w-full h-auto rounded-md shadow-md"
                                            />
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {suggestedTags.map((tag, index) => (
                                                <button
                                                    type="button"
                                                    key={index}
                                                    onClick={() => handleAddTag(tag)}
                                                    className={`px-4 py-2 rounded-md text-white ${tags.includes(tag) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 hover:bg-gray-400'}`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                                                Title:
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                                                Description:
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows="5"
                                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                                            ></textarea>
                                        </div>

                                        <div className="md:col-span-1 col-span-2">
                                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                                                Club/Organization:
                                            </label>
                                            <input
                                                type="text"
                                                name="club"
                                                value={formData.club}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                                            />
                                        </div>

                                        <div className="md:col-span-1 col-span-2">
                                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                                                Location:
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                                            />
                                        </div>

                                        <div className="md:col-span-1 col-span-2">
                                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                                                Start Date Time:
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="startDateTime"
                                                value={formData.startDateTime}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                                            />
                                            <span>
                                                Original Start Date Time: {eventStartDateTime} @ {eventStartTime}
                                            </span>
                                        </div>
                                        <div className="md:col-span-1 col-span-2">
                                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                                                End Date Time:
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="endDateTime"
                                                value={formData.endDateTime}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                                            />
                                            <span>
                                                Original End Date Time: {eventEndDateTime} @ {eventEndTime}
                                            </span>
                                        </div>

                                        <div className="md:col-span-1 col-span-2">
                                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                                                RSVP:
                                            </label>
                                            <input
                                                type="text"
                                                name="rsvp"
                                                value={formData.rsvp}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                                        onClick={handleSubmit}
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>

                    ) :
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
    );
};

export default EventDetails;