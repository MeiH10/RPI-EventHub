const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const Event = require('./models/Event');
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

  return {
    eventId: pgEvent.event_id,
    title: pgEvent.event_name,
    description: pgEvent.description,
    likes: pgEvent.likes || 0,
    creationTimestamp: new Date(pgEvent.created),
    poster: poster,
    startDateTime: new Date(pgEvent.event_start),
    endDateTime: pgEvent.event_end
      ? new Date(pgEvent.event_end)
      : new Date(new Date(pgEvent.event_start).getTime() + 3 * 60 * 60 * 1000),
    location: pgEvent.location || 'None',
    image: pgEvent.image_id ? `${process.env.IMAGE_PREFIX}${pgEvent.image_id}` : '',
    tags: pgEvent.tags ? pgEvent.tags.split(',').map(tag => tag.trim()) : [],
    club: pgEvent.club_name || 'Unknown Club',
    rsvp: pgEvent.more_info || '',
  };
};

const upsertEventsToMongoDB = async (events) => {
  const bulkOps = events.map((event) => {
    const transformedEvent = transformEventData(event);
    return {
      updateOne: {
        filter: { eventId: transformedEvent.eventId },
        update: { $set: transformedEvent },
        upsert: true,
      },
    };
  });

  try {
    await Event.bulkWrite(bulkOps);
    console.log('Events upserted successfully.');
  } catch (error) {
    console.error('Error upserting events to MongoDB:', error);
    throw error;
  }
};

const syncEvents = async () => {
  try {
    console.log(`Starting sync. Last sync time: ${lastSyncTime}`);
    const newEvents = await fetchNewEventsFromPostgres(lastSyncTime);
    if (newEvents.length > 0) {
      console.log(`Fetched ${newEvents.length} new events from PostgreSQL.`);
      await upsertEventsToMongoDB(newEvents);
      
      const latestCreatedTime = newEvents.reduce((latest, event) => {
        const eventCreatedTime = new Date(event.created);
        return eventCreatedTime > latest ? eventCreatedTime : latest;
      }, lastSyncTime);
      
      lastSyncTime = latestCreatedTime;
      saveLastSyncTime(lastSyncTime);
      console.log(`Sync completed. Last sync time updated to ${lastSyncTime}`);
    } else {
      console.log('No new events to sync.');
    }
  } catch (error) {
    console.error('Error during sync process:', error);
  }
};

const createUniqueIndex = async () => {
  try {
    await Event.collection.createIndex({ eventId: 1 }, { unique: true });
    console.log('Unique index on eventId created');
  } catch (error) {
    if (error.code === 11000) {
      console.log('Unique index on eventId already exists');
    } else {
      console.error('Error creating unique index:', error);
    }
  }
};

const startSync = async () => {
  await createUniqueIndex();
  await syncEvents();
  cron.schedule('0 */3 * * *', async () => {
    console.log('Starting scheduled sync process...');
    await syncEvents();
  });
};

module.exports = {
  startSync,
};
