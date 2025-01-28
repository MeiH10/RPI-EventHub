const Event = require('../models/Event');
const axios = require('axios');
const {logger} = require('../services/eventsLogService');
const { compressImage, convertPdfToImage } = require('../useful_script/imageUtils');
const path = require('path');
const FormData = require('form-data');
require('dotenv').config({ path: path.join(__dirname, '../.env') });



/**
 * Create a new event
 * @param eventData
 * @param file
 * @returns {Promise<any>}
 */
const createEvent = async (eventData, file) => {
    let imageUrl = '';

    // Upload image to ImgBB
    if (file) {
        let imageBuffer;
        if (file.mimetype === 'application/pdf') {
            imageBuffer = await convertPdfToImage(file.buffer);
        } else {
            imageBuffer = await compressImage(file.buffer);
        }

        const formData = new FormData();
        formData.append('image', imageBuffer.toString('base64'));

        try {
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.ImgBB_API_KEY}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const imageUrl = response?.data?.data?.url;

            if (!imageUrl) {
                throw new Error('ImgBB API Not Give Image URL');
            }

        } catch (error) {
            console.log('Error Message:', error.response?.data)
            console.log(process.env.ImgBB_API_KEY)
            throw new Error(`Image Upload Fails: ${error.response?.data?.error?.message || error.message}`)
        }

    }

    // Check for duplicates
    const existingEvent = await Event.findOne({ title: eventData.title, startDateTime: eventData.startDateTime });
    if (existingEvent) {
        throw new Error('Event with the same title and date already exists.');
    }

    const event = new Event({
        ...eventData,
        image: imageUrl,
        tags: eventData.tags ? eventData.tags.split(',').map(tag => tag.trim()) : [],
    });

    await event.save();

    // Log the event creation
    logger.info(`Event CREATED: ${eventData.title} start at ${eventData.startDateTime}---${new Date()}`);

    return event;
};



// LIKE LOGIC BELOW
const User = require('../models/User');

/**
 * Get event likes
 * @param eventId
 * @returns {Promise<{likes: *}>}
 */
const getEventLikes = async (eventId) => {
    const event = await Event.findById(eventId);
    if (!event) {
        throw new Error('Event not found');
    }
    return { likes: event.likes };
};

/**
 * Get user liked events
 * @param userId
 * @returns {Promise<*>}
 */
const getUserLikedEvents = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user.likedEvents.map(eventId => eventId.toString());
};

/**
 * Toggle event like
 * @param eventId
 * @param userId
 * @param liked
 * @returns {Promise<{likes: (number|*)}>}
 */
const toggleEventLike = async (eventId, userId, liked) => {
    const event = await Event.findById(eventId);
    const user = await User.findById(userId);

    if (!event || !user) {
        throw new Error('Event or User not found');
    }

    const hasLiked = user.likedEvents.includes(eventId);

    if (liked && !hasLiked) {
        event.likes += 1;
        user.likedEvents.push(eventId);
    } else if (!liked && hasLiked) {
        event.likes -= 1;
        user.likedEvents = user.likedEvents.filter(
            (eventId) => eventId.toString() !== eventId
        );
    }

    await event.save();
    await user.save();

    logger.info(`Event ${event.title} ${liked ? 'LIKED' : 'UNLIKED'} by ${user.username}. count: ${event.likes}---${new Date()}`);

    return { likes: event.likes };
};

/**
 * Delete an event
 * @param eventId
 * @returns {Promise<{message: string}>}
 */
const deleteEvent = async (eventId) => {
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
        throw new Error('Event not found');
    }

    // Log the event deletion
    logger.info(`Event DELETED: ${event.title} start at ${event.startDateTime}---${new Date()}`);

    return { message: 'Event deleted successfully' };
};

/**
 * Proxy image from event
 * @param eventId
 * @returns {Promise<{data: any, contentType}>}
 */
const proxyImage = async (eventId) => {
    const event = await Event.findById(eventId);
    if (!event || !event.image) {
        throw new Error('Event or image not found');
    }

    const response = await axios.get(event.image, { responseType: 'arraybuffer' });
    return {
        data: response.data,
        contentType: response.headers['content-type'],
    };
};

module.exports = {
    createEvent,
    getEventLikes,
    getUserLikedEvents,
    toggleEventLike,
    deleteEvent,
    proxyImage
};
