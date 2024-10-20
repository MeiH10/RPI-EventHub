const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const mongoose = require('mongoose');
const Event = require('./models/Event');
const { giveTags } = require('./useful_script/tagFunction');
require('dotenv').config();

const pgClient = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE || 'defaultdb',
  ssl: {
    rejectUnauthorized: false,
  },
});

pgClient.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL with SSL:', err);
  } else {
    console.log('Connected to PostgreSQL with SSL!');
  }
});

const lastSyncFilePath = path.join(__dirname, 'lastSyncTime.txt');

const loadLastSyncTime = () => {
  if (fs.existsSync(lastSyncFilePath)) {
    const timeStr = fs.readFileSync(lastSyncFilePath, 'utf-8');
    return new Date(timeStr);
  } else {
    return new Date(0);
  }
};

const saveLastSyncTime = (time) => {
  fs.writeFileSync(lastSyncFilePath, time.toISOString());
};

let lastSyncTime = loadLastSyncTime();

const fetchNewEventsFromPostgres = async (lastSyncTime) => {
  const query = 'SELECT * FROM events WHERE created > $1 ORDER BY created ASC, event_id ASC';
  const values = [lastSyncTime];
  try {
    const res = await pgClient.query(query, values);
    return res.rows;
  } catch (error) {
    console.error('Error fetching new events from PostgreSQL:', error);
    throw error;
  }
};

const transformEventData = (pgEvent) => {
  let poster = pgEvent.submitted_by || 'admin';
  if (poster.endsWith('@rpi.edu')) {
    poster = poster.slice(0, -('@rpi.edu'.length));
  }

  const title = pgEvent.event_name || 'Untitled Event';
  const description = pgEvent.description || 'No description provided.';

  if (!pgEvent.event_name) {
    console.warn(`Event with ID ${pgEvent.event_id} has a null or undefined event_name.`);
  }

  const tagsSet = giveTags(title, description);
  const tagsArray = Array.from(tagsSet);

  return {
    title: title,
    description: description,
    likes: pgEvent.likes || 0,
    creationTimestamp: new Date(pgEvent.created),
    poster: poster,
    startDateTime: new Date(pgEvent.event_start),
    endDateTime: pgEvent.event_end
      ? new Date(pgEvent.event_end)
      : new Date(new Date(pgEvent.event_start).getTime() + 3 * 60 * 60 * 1000),
    location: pgEvent.location || 'None',
    image: pgEvent.image_id ? `${process.env.IMAGE_PREFIX}${pgEvent.image_id}` : '',
    tags: tagsArray,
    club: pgEvent.club_name || 'Unknown Club',
    rsvp: pgEvent.more_info || '',
  };
};

const BATCH_SIZE = 1000;

const syncEvents = async () => {
  try {
    console.log(`Starting sync. Last sync time: ${lastSyncTime}`);
    const newEvents = await fetchNewEventsFromPostgres(lastSyncTime);
    if (newEvents.length > 0) {
      console.log(`Fetched ${newEvents.length} new event(s) from PostgreSQL.`);

      const transformedEvents = newEvents.map(transformEventData);
      const eventIdentifiers = transformedEvents.map(event => ({
        title: event.title,
        startDateTime: event.startDateTime,
      }));

      const existingEvents = await Event.find({
        $or: eventIdentifiers,
      }).select('title startDateTime');

      const existingEventSet = new Set(
        existingEvents.map(event => `${event.title}|||${event.startDateTime.toISOString()}`)
      );

      const eventsToInsert = transformedEvents.filter(event => {
        const identifier = `${event.title}|||${event.startDateTime.toISOString()}`;
        return !existingEventSet.has(identifier);
      });

      if (eventsToInsert.length > 0) {
        for (let i = 0; i < eventsToInsert.length; i += BATCH_SIZE) {
          const batch = eventsToInsert.slice(i, i + BATCH_SIZE);
          await Event.insertMany(batch);
          console.log(`Inserted batch of ${batch.length} events.`);
        }

        const latestCreatedTime = eventsToInsert.reduce((latest, event) => {
          const eventCreatedTime = new Date(event.creationTimestamp);
          return eventCreatedTime > latest ? eventCreatedTime : latest;
        }, lastSyncTime);

        lastSyncTime = latestCreatedTime;
        saveLastSyncTime(lastSyncTime);
        console.log(`Sync completed. Last sync time updated to ${lastSyncTime}`);
      } else {
        console.log('No new events to insert.');
      }
    } else {
      console.log('No new events to sync.');
    }
  } catch (error) {
    console.error('Error during sync process:', error);
  }
};

const createUniqueIndex = async () => {
  try {
    await Event.collection.createIndex({ title: 1, startDateTime: 1 }, { unique: true });
    console.log('Unique index on title and startDateTime created');
  } catch (error) {
    if (error.code === 11000) {
      console.log('Unique index on title and startDateTime already exists');
    } else {
      console.error('Error creating unique index:', error);
    }
  }
};

const startSync = async () => {
  await createUniqueIndex();
  await syncEvents();
  cron.schedule('0 * * * *', async () => {
    console.log('Starting scheduled sync process...');
    await syncEvents();
  });
};

const startSynchronization = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
    });
    console.log('MongoDB Connected for synchronization');
    await startSync();
  } catch (error) {
    console.error('Error connecting to MongoDB for synchronization:', error);
  }
};

startSynchronization();

module.exports = {
  startSync,
};
