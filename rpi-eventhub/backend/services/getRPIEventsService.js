const Event = require('../models/event');
const { getNextSequence } = require('../counter');
const cron = require('node-cron');

// get the data from events.rpi.edu

// set the URL and options for the request
// count is the total number of events to return
// days is the number of days from today to return events for
const setURLAndOptions = (count,days) => {
    return `https://events.rpi.edu/feeder/main/eventsFeed.do?f=y&sort=dtstart.utc:asc&fexpr=(categories.href!=%22/public/.bedework/categories/Ongoing%22)%20and%20(entity_type=%22event%22%20or%20entity_type=%22todo%22)&skinName=list-json&count=${count}&days=${days}`;
}

// get the events from events.rpi.edu
const getEvents = async (count,days) => {
    const url = setURLAndOptions(count,days);
    const response = await fetch(url);
    const res = await response.json();
    console.log("Successfully fetched events from events.rpi.edu");
    return res;
}

function extractEvents(jsonResponse) {
    const eventsList = [];

    const events = jsonResponse?.bwEventList?.events || [];
    events.forEach(event => {

        const newEvent = new Event({
            title: event.summary || '', // Using 'summary' from the response as the title
            description: event.description || '',
            poster: 'RPI', // Defaulting to 'RPI' if not provided
            startDateTime: formatDateTime(event.start?.datetime) || '', // Extracting start date from 'drupal'
            endDateTime: formatDateTime(event.end?.datetime) || '', // Extracting end date from 'drupal'
            location: event.location?.address || 'unknown', // Defaulting to 'unknown' if not provided
            image: '', // No image provided in the response, set to empty string
            tags: event.categories || [], // Extracting categories
            club: 'RPI Official', // Defaulting to 'RPI' if not provided
            rsvp: event.eventlink || '', // Extracting event link
        });

        eventsList.push(newEvent);
    });

    return eventsList;
}

function formatDateTime(input) {
    const year = input.slice(0, 4);
    const month = input.slice(4, 6);
    const day = input.slice(6, 8);
    const hours = input.slice(9, 11) || '00';
    const minutes = input.slice(11, 13) || '00';
    const seconds = input.slice(13, 15) || '00';

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000+00:00`;
}

async function fetchAndUpdateEvents() {
    try {
        // Fetch events from events.rpi.edu 7 days from today
        const count = "NaN";
        const days = 7;

        let events = await getEvents(count, days); // get events from events.rpi.edu
        let eventsList = extractEvents(events);    // extract events from the response

        for (let eventData of eventsList) {
            let existingEvent = await Event.findOne({ title: eventData.title, startDateTime: eventData.startDateTime, endDateTime: eventData.endDateTime });

            if (existingEvent) {
                console.log(`Event already exists: ${eventData.title}`);
            } else {
                const newEvent = new Event(eventData);
                await newEvent.save();
                console.log(`Inserted new event: ${eventData.title}`);
            }
        }
    } catch (error) {
        console.error('Error fetching and updating events:', error);
    }
}


// Run when the server starts
fetchAndUpdateEvents().then(r => console.log('Initial fetch and update complete'));
// Run the fetchAndUpdateEvents function every day
cron.schedule('0 0 * * *', fetchAndUpdateEvents);

module.exports = {getEvents, extractEvents};

