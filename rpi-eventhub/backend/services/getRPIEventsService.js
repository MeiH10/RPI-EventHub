const Event = require('../models/Event');
const { getNextSequence } = require('../counter');
const cron = require('node-cron');
const { logger } = require('../services/eventsLogService');

/**
 * Constructs the URL for fetching events from RPI's events feed
 * @param {string} count - Number of events to return
 * @param {number} days - Number of days from today to fetch events for
 * @returns {string} - Complete URL for the events feed
 */
const setURLAndOptions = (count, days) => {
    return `https://events.rpi.edu/feeder/main/eventsFeed.do?f=y&sort=dtstart.utc:asc&fexpr=(categories.href!=%22/public/.bedework/categories/Ongoing%22)%20and%20(entity_type=%22event%22%20or%20entity_type=%22todo%22)&skinName=list-json&count=${count}&days=${days}`;
};

/**
 * Fetches events from RPI's events feed
 * @param {string} count - Number of events to return
 * @param {number} days - Number of days to fetch
 * @returns {Promise<Object>} - JSON response containing events
 */
const getEvents = async (count, days) => {
    try {
        const url = setURLAndOptions(count, days);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const res = await response.json();
        console.log("Successfully fetched events from events.rpi.edu");
        return res;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
};

/**
 * Formats datetime string from RPI's format to ISO 8601 format
 * @param {string} input - Datetime string in format YYYYMMDD[T]HHmmss
 * @returns {string} - ISO 8601 formatted datetime string
 */
function formatDateTime(input) {
    if (!input) return '';
    
    const year = input.slice(0, 4);
    const month = input.slice(4, 6);
    const day = input.slice(6, 8);
    const hours = input.slice(9, 11) || '00';
    const minutes = input.slice(11, 13) || '00';
    const seconds = input.slice(13, 15) || '00';

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000+00:00`;
}

/**
 * Extracts and formats events from the JSON response
 * @param {Object} jsonResponse - Response from RPI's events feed
 * @returns {Array} - Array of formatted event objects
 */
function extractEvents(jsonResponse) {
    const eventsList = [];
    const events = jsonResponse?.bwEventList?.events || [];

    events.forEach(event => {
        const newEvent = new Event({
            title: event.summary || '',
            description: event.description || '',
            poster: 'RPI',
            startDateTime: formatDateTime(event.start?.datetime),
            endDateTime: formatDateTime(event.end?.datetime),
            location: event.location?.address || 'unknown',
            image: '',
            tags: event.categories || [],
            club: 'RPI Official',
            rsvp: event.eventlink || '',
            likes: 0
        });
        eventsList.push(newEvent);
    });

    return eventsList;
}

/**
 * Fetches events from RPI's feed and updates the database
 */
async function fetchAndUpdateEvents() {
    try {
        const count = "NaN"; // Fetches all events
        const days = 7; // Fetch events for next 7 days
        
        const events = await getEvents(count, days);
        const eventsList = extractEvents(events);

        for (let eventData of eventsList) {
            // Check for duplicate events
            const existingEvent = await Event.findOne({ 
                title: eventData.title, 
                startDateTime: eventData.startDateTime,
                endDateTime: eventData.endDateTime 
            });

            if (existingEvent) {
                console.log(`Event already exists: ${eventData.title}`);
                continue;
            }

            try {
                const newEvent = new Event(eventData);
                await newEvent.save();
                console.log(`Inserted new event: ${eventData.title}`);
                logger.info(`Event CREATED: ${eventData.title} start at ${eventData.startDateTime}---${new Date()}`);
            } catch (error) {
                console.error(`Error saving event ${eventData.title}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in fetchAndUpdateEvents:', error);
    }
}

// Initialize: Run once when server starts
fetchAndUpdateEvents()
    .then(() => console.log('Initial fetch and update complete'))
    .catch(error => console.error('Error in initial fetch:', error));

// Schedule: Run daily at midnight
cron.schedule('0 0 * * *', fetchAndUpdateEvents);

module.exports = {
    getEvents,
    extractEvents
};