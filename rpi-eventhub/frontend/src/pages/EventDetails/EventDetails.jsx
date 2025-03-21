import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import Footer from '../../components/Footer/Footer';
import styles from './EventDetails.module.css';
import { useEvents } from '../../context/EventsContext';
import RsvpButton from '../../components/RSVPButton/RsvpButton';
import DeleteButton from '../../components/DeleteButton/DeleteButton';
import { DateTime } from 'luxon';
import { useAuth } from "../../context/AuthContext";
import * as pdfjsLib from "pdfjs-dist";
import { handleFileChange } from "../../components/CreateEventModal/CreateEventModal";
import axios from "axios";
import config from "../../config";
import ShareButtons from "./ShareButtons";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
import OpencvQr from "opencv-qr";


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

// Load Model
const cvQR = new OpencvQr({
    dw: `${config.apiUrl}/assets/Models/detect.caffemodel`,
    sw: `${config.apiUrl}/assets/Models/sr.caffemodel`,
});

const EventDetails = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const { manageMode, username } = useAuth();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [tags, setTags] = useState([]);
    const [showOriginalImage, setShowOriginalImage] = useState(true);
    // QR code (For Single QR code)
    const [QRCodeLink, setQRCodeLink] = useState('');
    const [QRCodeError, setQRCodeError] = useState('');
    const qrcodeCanvasRef = useRef(null);
    const [QRCodeLinkIcon, setQRCodeLinkIcon] = useState('');
    // QR code (For Multiple QR codes)
    const [showQRMask, setShowQRMask] = useState(false);
    const [qrCodes, setQrCodes] = useState([]);
    const [selectedQR, setSelectedQR] = useState(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const imageRef = useRef(null);


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

    // This hook should always be at the top of the function
    useEffect(() => {
        if (events.length === 0) {
            fetchEvents();
        }
    }, [events, fetchEvents]);

    // The event found by the eventId
    const event = events.find(event => event._id === eventId);


    useEffect(() => {
        if (event?.image) {
            decodeQRFromUrl(event.image);
        }
    }, [event?.image]);

    // Check if the user is the owner of the event
    useEffect(() => {
        if (event && username) {
            setIsEditing(manageMode && event.poster === username);
            setIsOwner(event.poster === username);
        }
    }, [manageMode, event, username]);


    // Set the form data to the event data
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

    // Handle form data changes, update the form data (Update Event/Manage Event)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    //#region Update/Manage event
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

    function handleImageFileChange(e) {
        toggleImage();
        handleFileChange(e, setPreview, setFile, setError);
    }

    function toggleImage() {
        setShowOriginalImage((prevState) => !prevState);
    }
    //#endregion changed event update

    if (!event) {
        return <p>Event not found.</p>;
    }

    //#region Format the date and time for the event
    const eventStartDateTime = event.startDateTime ? formatDateAsEST(event.startDateTime) : formatDateAsEST(event.date);
    const eventEndDateTime = event.endDateTime ? formatDateAsEST(event.endDateTime) : (event.endDate ? formatDateAsEST(event.endDate) : null);
    const eventStartTime = event.startDateTime ? formatTime(event.startDateTime) : formatTime(event.time);
    const eventEndTime = event.endDateTime ? formatTime(event.endDateTime) : formatTime(event.endTime);
    //#endregion

    const eventShareDescription = "Join " + event.club + " for " + event.title + " on " + eventStartDateTime + " at " + eventStartTime + (event.location ? " in " + event.location : "") + ". " + event.description;

//#region--------------------QR code to Link--------------------
    // Convert url to ImageData
    const loadImageData = async (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
                } catch (err) {
                    reject(new Error('cannot resolve image'));
                }
            };

            img.onerror = () => {
                reject(new Error('cannot resolve image'));
            };

            img.src = url;
        });
    };

    const decodeQRFromUrl = async (url) => {
        try {
            setQRCodeError('');
            setQRCodeLink('');
            setShowQRMask(false);

            const imageData = await loadImageData(url);
            const result = cvQR.load(imageData);
            const infos = result?.getInfos();
            const sizes = result?.getSizes();

            if (!infos || infos.length === 0) {
                setQRCodeError('No QR code found');
                console.log("No QR code found");
                return;
            }

            // Get the actual image size
            const img = imageRef.current;
            const { naturalWidth, naturalHeight, offsetWidth, offsetHeight } = img;

            // Calculate the scale factor
            const scaleX = offsetWidth / naturalWidth;
            const scaleY = offsetHeight / naturalHeight;

            // Set the image size
            const qrData = infos.map((info, index) => ({
                info,
                position: {
                    x: sizes[index].x * scaleX,
                    y: sizes[index].y * scaleY,
                    w: sizes[index].w * scaleX,
                    h: sizes[index].h * scaleY
                }
            }));

            setQrCodes(qrData);

            if (qrData.length === 1) {
                setQRCodeLink(qrData[0].info);
                setQRCodeLinkIcon(getFavicon(qrData[0].info));
            } else {
                setShowQRMask(true);
            }

            cvQR.clear();
        } catch (err) {
            setQRCodeError('Cannot resolve QR code: ' + err.message);
            console.log(QRCodeError);
        }
    };

    // Overlay for QR code
    const QRMaskOverlay = ({ qrCodes, onSelect }) => {
        return (
            <div className="absolute inset-0 cursor-pointer">
                {qrCodes.map((qr, index) => (
                    <div
                        key={index}
                        className="absolute border-4 border-blue-400 hover:border-blue-600 transition-all"
                        style={{
                            left: qr.position.x + 'px',
                            top: qr.position.y + 'px',
                            width: qr.position.w + 'px',
                            height: qr.position.h + 'px',
                        }}
                        onClick={() => onSelect(index)}
                    >
                        <div className="absolute -right-2 -top-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            {index + 1}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Get the favicon from the url
    const getFavicon = (url) => {
        //Extract the domain from the url
        const domain = url.split('/')[2];
        return `https://www.google.com/s2/favicons?sz=32&domain_url=${domain}`;
    }
//#endregion

    return (
        <div className='outterContainer'>
            <Navbar />
            <div className={`${styles.eventsDisplayContainer} containerFluid container-fluid`}>
                {isEditing && isOwner ?
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
                                                src={showOriginalImage ? event.image : preview || 'https://via.placeholder.com/300x450'}
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
                                                    className={`px-4 py-2 rounded-md ${tags.includes(tag) ? 'text-amber-50 bg-blue-600 hover:bg-blue-700' : 'text-blue-950 bg-gray-300 hover:bg-gray-400'}`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="form-label-text block font-medium mb-1">
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
                                            <label className="form-label-text block font-medium mb-1">
                                                Description:
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows="5"
                                                className="form-label-text w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                                            ></textarea>
                                        </div>

                                        <div className="md:col-span-1 col-span-2">
                                            <label className="form-label-text block font-medium mb-1">
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
                                            <label className="form-label-text block font-medium mb-1">
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
                                            <label className="form-label-text block font-medium mb-1">
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
                                            <label className="form-label-text block font-medium mb-1">
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
                                            <label className="form-label-text block font-medium mb-1">
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

                                <div> 
                                    <button 
                                        type="button"
                                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-red-700"
                                        onClick={DeleteButton}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </form>
                        </div>

                    ) :
                    (
                        <div className={styles.container}>
                            <div className={styles.eventPoster}>
                                <div className="relative max-w-full">
                                    <img
                                        ref={imageRef}
                                        src={event.image || 'https://via.placeholder.com/300x450'} alt={event.title}
                                        className="max-w-full h-auto"
                                        onLoad={(e) => {
                                            setImageSize({
                                                width: e.target.offsetWidth,
                                                height: e.target.offsetHeight
                                            });
                                        }}
                                    />
                                    {showQRMask && (
                                        <QRMaskOverlay
                                            qrCodes={qrCodes}
                                            onSelect={(index) => {
                                                setSelectedQR(index);
                                                setQRCodeLink(qrCodes[index].info);
                                                setQRCodeLinkIcon(getFavicon(qrCodes[index].info));
                                            }}
                                        />
                                    )}
                                </div>
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
                                {event.rsvp !== "" && <RsvpButton rsvp={event.rsvp} />}
                                {event.delete !== "" && <DeleteButton delete={event.delete} />}
                                <canvas ref={qrcodeCanvasRef} style={{ display: 'none' }}></canvas>

                                <ShareButtons
                                    url={window.location.href}
                                    title={event.title}
                                    description={eventShareDescription}
                                    image={event.image}
                                />
                                {QRCodeLink && (
                                    <div
                                        className="my-2 max-w-[max-content] flex items-center space-x-2 bg-gray-50 p-2 rounded-md border border-gray-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth={1.5} stroke="currentColor" className="size-5 text-gray-500">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"/>
                                        </svg>
                                        <a href={QRCodeLink} target="_blank" rel="noopener noreferrer"
                                           className="inline-flex items-center space-x-1 hover:underline text-blue-500">
                                            {QRCodeLinkIcon && (
                                                <div
                                                    className="relative inline-flex items-center space-x-1 p-1 bg-white rounded">
                                                    <div className="relative">
                                                        <img
                                                            src={QRCodeLinkIcon}
                                                            alt="favicon"
                                                            className="w-4 h-4 rounded-sm"
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500 truncate max-w-[150px]">
                                                        {QRCodeLink.split('/')[2]}
                                                    </span>
                                                    {showQRMask &&
                                                        <span className="absolute -top-[3px] -right-[3px] inline-block w-6 h-6
                                                                         text-[13px] text-center content-center font-bold leading-none text-white bg-blue-500
                                                                         rounded-full border-2 border-white
                                                                         transform translate-x-1/2 -translate-y-1/2
                                                                         shadow-sm z-10">
                                                            {selectedQR + 1}
                                                        </span>
                                                    }

                                                </div>
                                            )}
                                        </a>
                                    </div>

                                )}
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