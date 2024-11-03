const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const mongoose = require('mongoose');
const axios = require('axios');
const FormData = require('form-data');
const Event = require('./models/Event');
const { giveTags } = require('./useful_script/tagFunction');
require('dotenv').config();

const uploadImageToImgBB = async (imageUrl) => {
  try {
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });
    
    const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
    const formData = new FormData();
    formData.append('image', base64Image);
    
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.ImgBB_API_KEY}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );

    return response.data?.data?.url || null;
  } catch (error) {
    console.error(`Image upload failed for ${imageUrl}: ${error.message}`);
    return null;
  }
};

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



const transformEventData = async (pgEvent) => {
  let poster = pgEvent.submitted_by || 'admin';
  if (poster.endsWith('@rpi.edu')) {
    poster = poster.slice(0, -('@rpi.edu'.length));
  }

  const title = pgEvent.event_name || 'Untitled Event';
  const description = pgEvent.description || 'No description provided.';

  const tagsSet = giveTags(title, description);
  const tagsArray = Array.from(tagsSet);

  let imageUrl = '';
  if (pgEvent.image_id) {
    const originalImageUrl = `${process.env.IMAGE_PREFIX}${pgEvent.image_id}`;
    imageUrl = await uploadImageToImgBB(originalImageUrl);
    
    if (!imageUrl) {
      return null;
    }
  }

  const startDateTime = pgEvent.event_start;
  const endDateTime = pgEvent.event_end || new Date(new Date(startDateTime).getTime() + (3 * 60 * 60 * 1000)).toISOString();

  return {
    title: title,
    description: description,
    likes: pgEvent.likes || 0,
    creationTimestamp: pgEvent.created,
    poster: poster,
    startDateTime: startDateTime,
    endDateTime: endDateTime,
    location: pgEvent.location || 'None',
    image: imageUrl,
    tags: tagsArray,
    club: pgEvent.club_name || 'Unknown Club',
    rsvp: pgEvent.more_info || '',
  };
};

const syncEvents = async () => {
  try {
    console.log(`Starting sync. Last sync time: ${lastSyncTime}`);
    const newEvents = await fetchNewEventsFromPostgres(lastSyncTime);
    
    if (newEvents.length > 0) {
      console.log(`Fetched ${newEvents.length} new event(s) from PostgreSQL.`);
      let latestProcessedTime = lastSyncTime;

      for (const pgEvent of newEvents) {
        try {
          console.log(`\nProcessing: ${pgEvent.event_name}`);
          console.log(`SQL time: ${pgEvent.event_start}`);

          const existingEvent = await Event.findOne({
            title: pgEvent.event_name,
            startDateTime: pgEvent.event_start
          });

          if (!existingEvent) {
            const transformedEvent = await transformEventData(pgEvent);
            if (transformedEvent) {
              await Event.create(transformedEvent);
              console.log(`Created new event: ${transformedEvent.title}`);
              console.log(`Start time: ${transformedEvent.startDateTime}`);
            }
          } else {
            console.log(`Event already exists: ${pgEvent.event_name}`);
            console.log(`Existing start time: ${existingEvent.startDateTime}`);
          }

          if (new Date(pgEvent.created) > latestProcessedTime) {
            latestProcessedTime = new Date(pgEvent.created);
          }
        } catch (error) {
          console.error(`Error processing event ${pgEvent.event_name}:`, error.message);
        }
      }

      lastSyncTime = latestProcessedTime;
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