const Event = require('../models/Event');
const { getNextSequence } = require('../counter');
const cron = require('node-cron');
const { logger } = require('../services/eventsLogService');
const { DateTime } = require('luxon');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { giveTags } = require('../useful_script/tagFunction');

const setURLAndOptions = (count, days) => {
    return `https://events.rpi.edu/feeder/main/eventsFeed.do?f=y&sort=dtstart.utc:asc&fexpr=(categories.href!=%22/public/.bedework/categories/Ongoing%22)%20and%20(entity_type=%22event%22%20or%20entity_type=%22todo%22)&skinName=list-json&count=${count}&days=${days}`;
};

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

function formatDateTime(input) {
    if (!input) return '';
    
    try {
        // Parse the input string (format: YYYYMMDD[T]HHmmss)
        const year = input.slice(0, 4);
        const month = input.slice(4, 6);
        const day = input.slice(6, 8);
        const hours = input.slice(9, 11) || '00';
        const minutes = input.slice(11, 13) || '00';
        const seconds = input.slice(13, 15) || '00';

        // Create DateTime object in EST
        const estDateTime = DateTime.fromFormat(
            `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
            'yyyy-MM-dd HH:mm:ss',
            { zone: 'America/New_York' }
        );

        console.log('Debug - Input EST:', estDateTime.toFormat('yyyy-MM-dd HH:mm:ss ZZZZ'));
        console.log('Debug - Output UTC:', estDateTime.toUTC().toISO());

        return estDateTime.toUTC().toISO();
    } catch (error) {
        console.error('Error formatting datetime:', input, error);
        return '';
    }
}

function extractEvents(jsonResponse) {
    const eventsList = [];
    const events = jsonResponse?.bwEventList?.events || [];

    events.forEach(event => {
        console.log('\nProcessing event:', event.summary);
        console.log('Raw start datetime:', event.start?.datetime);
        console.log('Raw end datetime:', event.end?.datetime);

        const startDateTime = formatDateTime(event.start?.datetime);
        const endDateTime = formatDateTime(event.end?.datetime);

        console.log('Formatted start (UTC):', startDateTime);
        console.log('Formatted end (UTC):', endDateTime);

        const newEvent = new Event({
            title: event.summary || '',
            description: event.description || '',
            poster: 'RPI',
            startDateTime,
            endDateTime,
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

async function fetchAndUpdateEvents() {
    try {
        const count = "NaN"; // Fetches all events
        const days = 7; // Fetch events for next 7 days
        
        const events = await getEvents(count, days);
        const eventsList = extractEvents(events);

        for (let eventData of eventsList) {
            console.log('\nSaving event:', eventData.title);
            console.log('Start DateTime (UTC) to save:', eventData.startDateTime);
            console.log('End DateTime (UTC) to save:', eventData.endDateTime);

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
                
                const savedEvent = await Event.findById(newEvent._id);
                console.log('Verified saved start (UTC):', savedEvent.startDateTime);
                console.log('Verified saved end (UTC):', savedEvent.endDateTime);
                
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