const Event = require('../models/Event');
const User = require('../models/User');
const axios = require('axios');
const {logger} = require('../services/eventsLogService');
const { compressImage, convertPdfToImage } = require('../useful_script/imageUtils');
const path = require('path');
const FormData = require('form-data');
const {Error} = require("mongoose");
require('dotenv').config({ path: path.join(__dirname, '../.env') });



/**
 * Create a new event
 * @param eventData see Event model
 * @param file
 * @returns {Promise<any>}
 */
const createEvent = async (eventData, file) => {
    let imageUrl = '';
    let ImgBBError = false;

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

            imageUrl = response.data.data.url;

        } catch (error) {
            console.log('Error Message:', error.response?.data)
            // use another domain later
            ImgBBError = true
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

    // If ImgBB upload failed, use the another image URL
    if (ImgBBError) {
        //TODO: PostgresSQL Manipulation needed
    }

    // Log the event creation
    logger.info(`Event CREATED: ${eventData.title} start at ${eventData.startDateTime}---${new Date()}`);

    return event;
};


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
            (id) => id.toString() !== eventId
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

/**
 * Update an event
 * @param id EventID
 * @param updatedEvent EventData
 * @param file New image post
 * @returns {Promise<Event>}
 */
const updateEvent = async (id, updatedEvent, file) => {
    const event = await Event.findById(id);
    if (!event) {
        throw new Error('Event not found');
    }
    try{
        let imageUrl = '';
        if (file){
            let imageBuffer;
            // Notice here all pdf should be converted to image
            // This if statement is to do the double check
            if (file.mimetype === 'application/pdf') {
                imageBuffer = await convertPdfToImage(file.buffer);
            } else {
                imageBuffer = await compressImage(file.buffer);
            }
            const formData = new FormData();
            formData.append('image', imageBuffer.toString('base64'));
            const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.ImgBB_API_KEY}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            imageUrl = response.data.data.url;
        }
        if (imageUrl !== '') {
            updatedEvent.image = imageUrl
            delete updatedEvent.file;
        } else {
            delete updatedEvent.file;
        }
        const event = await Event.findByIdAndUpdate(id, updatedEvent, { new: true });

        return {
            message: 'Event updated successfully',
            image: imageUrl || event.image,
        }
    }catch (error) {
        throw new Error('Error updating event: ' + error.message);
    }
}


module.exports = {
    createEvent,
    getEventLikes,
    getUserLikedEvents,
    toggleEventLike,
    deleteEvent,
    proxyImage,
    updateEvent
};
