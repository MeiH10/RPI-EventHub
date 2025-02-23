const { getEvents, extractEvents } = require('../services/getRPIEventsService');
const {
    createEvent,
    deleteEvent,
    getEventLikes,
    getUserLikedEvents,
    toggleEventLike,
    proxyImage
} = require('../services/eventService');

const Event = require('../models/Event');


/**
 * Get RPI events app.get('/rpi-events')
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getRPIEvents = async (req, res) => {
    //hardcoded values for now
    const count = "NaN";
    const days = 7;
    let events = null;
    let eventsList = [];
    try {
        events = await getEvents(count, days);
        eventsList = extractEvents(events);
        console.log('Successfully fetched RPI events');
        res.status(200).json(eventsList);
    } catch (error) {
        console.error('Error fetching RPI events:', error);
        res.status(500).json({ message: 'Error fetching RPI events', error: error.message });
    }
};

/**
 * Create a new event app.post('/events')
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const createNewEvent = async (req, res) => {
    try {
        const { title, description, poster, startDateTime, endDateTime, location, tags, club, rsvp } = req.body;
        const file = req.file;

        const eventData = {
            title,
            description,
            poster: poster || 'admin',
            startDateTime,
            endDateTime,
            location,
            tags,
            club,
            rsvp,
        };

        const event = await createEvent(eventData, file);
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        if (error.code === 11000 || error.message.includes('already exists')) {
            res.status(409).json({ message: 'Event with the same title and date already exists.' });
        } else {
            res.status(400).json({ message: 'Error creating event', error: error.message });
        }
    }
};

/**
 * Get all events app.get('/events')
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getAllEvents = async (req, res) => {
    try {
        // make sure that the Event model here is the Event schema from Mongoose, not the JS one.
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error: error.message });
    }
};

/**
 * This function is used to fetch the likes for a specific event
 * app.get('/events/:id/like')
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const fetchEventLikes = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getEventLikes(id);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get like count', error: error.message });
    }
};


/**
 * This function is used to fetch the events liked by a specific user
 * app.get('/events/like/status')
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const fetchUserLikedEvents = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await getUserLikedEvents(userId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


/**
 * This function is used to like/unlike an event
 * app.post('/events/:id/like')
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const handleEventLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { liked } = req.body;
        const userId = req.user._id;

        const result = await toggleEventLike(id, userId, liked);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error during like/unlike:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * This function is used to delete an event
 * app.delete('/events/:id')
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const removeEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteEvent(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};


/**
 * This function is used to get the image of an event
 * app.get('/proxy/image/:eventId')
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getProxyImage = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { data, contentType } = await proxyImage(eventId);
        res.set('Content-Type', contentType);
        res.send(data);
    } catch (error) {
        console.error('Error fetching image:', error.message);
        res.status(500).json({ message: 'Error fetching image' });
    }
};

module.exports = {
    createNewEvent,
    getRPIEvents,
    getAllEvents,
    fetchEventLikes,
    fetchUserLikedEvents,
    handleEventLike,
    removeEvent,
    getProxyImage
};