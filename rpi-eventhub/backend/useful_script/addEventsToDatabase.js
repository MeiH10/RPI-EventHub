const mongoose = require('mongoose');
const Event = require('../models/Event');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const addEventsToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('Connected to MongoDB');

    const eventsPath = path.join(__dirname, '../cleaned_events.json');

    if (!fs.existsSync(eventsPath)) {
      console.error(`File not found: ${eventsPath}`);
      process.exit(1);
    }

    const eventsData = fs.readFileSync(eventsPath, 'utf-8');
    const events = JSON.parse(eventsData);

    for (const event of events) {
      if (!event.endDateTime) {
        event.endDateTime = new Date(new Date(event.startDateTime).getTime() + 3 * 60 * 60 * 1000);
      }

      const existingEvent = await Event.findOne({ 
        title: event.title, 
        startDateTime: event.startDateTime 
      });

      if (existingEvent) {
        console.log(`Event "${event.title}" on ${event.startDateTime} already exists. Skipping.`);
        continue;
      }

      const newEvent = new Event({
        title: event.title,
        description: event.description,
        likes: event.likes || 0,
        creationTimestamp: new Date(event.creationTimestamp),
        poster: event.poster || 'admin',
        startDateTime: new Date(event.startDateTime),
        endDateTime: new Date(event.endDateTime),
        location: event.location || 'None',
        image: event.image || '',
        tags: Array.isArray(event.tags) ? event.tags : [],
        club: event.club || 'Unknown Club',
        rsvp: event.rsvp || ''
      });

      await newEvent.save();
      console.log(`Event "${newEvent.title}" added successfully.`);
    }

    console.log('All events processed successfully.');
  } catch (error) {
    console.error('Error adding events to the database:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

addEventsToDatabase();
