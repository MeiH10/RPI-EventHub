const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const mongoose = require('mongoose');
const axios = require('axios');
const FormData = require('form-data');
const Event = require('./models/Event');
const { giveTags } = require('./useful_script/tagFunction');
const { DateTime } = require('luxon');
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
    return '';
  }
};

const fetchNewEventsFromPostgres = async (lastSyncTime) => {
  const utcLastSync = DateTime.fromJSDate(lastSyncTime)
    .toUTC()
    .toSQL();

  const query = 'SELECT * FROM events WHERE created > $1::timestamp ORDER BY created ASC, event_id ASC';
  const values = [utcLastSync];
  
  try {
    const res = await pgClient.query(query, values);
    return res.rows;
  } catch (error) {
    console.error('Error fetching new events from PostgreSQL:', error);
    throw error;
  }
};

const logTimeComparison = (eventName, existingEvent, newEvent) => {
  console.log('\n=== Time Comparison ===');
  console.log('Event:', eventName);
  console.log('Existing Event Time (UTC):', existingEvent?.startDateTime);
  console.log('New Event Time (UTC):', newEvent.startDateTime);
  
  if (existingEvent) {
    const diffMinutes = Math.abs(existingEvent.startDateTime - newEvent.startDateTime) / (1000 * 60);
    console.log('Time Difference (minutes):', diffMinutes);
  }
  console.log('========================');
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

  // Convert times to UTC Date objects
  const startDateTime = DateTime.fromJSDate(new Date(pgEvent.event_start), { zone: 'America/New_York' })
    .toUTC()
    .toJSDate();  // Convert to JavaScript Date object

  let endDateTime;
  if (pgEvent.event_end) {
    endDateTime = DateTime.fromJSDate(new Date(pgEvent.event_end), { zone: 'America/New_York' })
      .toUTC()
      .toJSDate();
  } else {
    endDateTime = DateTime.fromJSDate(new Date(pgEvent.event_start), { zone: 'America/New_York' })
      .plus({ hours: 3 })
      .toUTC()
      .toJSDate();
  }

  const creationTimestamp = new Date();  // Use current time as creation timestamp

  // Handle image upload after time conversion
  let imageUrl = '';
  if (pgEvent.image_id) {
    const originalImageUrl = `${process.env.IMAGE_PREFIX}${pgEvent.image_id}`;
    imageUrl = await uploadImageToImgBB(originalImageUrl);
  }

  return {
    title,
    description,
    likes: pgEvent.likes || 0,
    creationTimestamp,
    poster,
    startDateTime,
    endDateTime,
    location: pgEvent.location || 'None',
    image: imageUrl,
    tags: tagsArray,
    club: pgEvent.club_name || 'Unknown Club',
    rsvp: pgEvent.more_info || '',
  };
};

const findExistingEvent = async (transformedEvent) => {
  try {
    // Convert ISO string to Date for comparison if it's not already a Date
    const eventStartDate = transformedEvent.startDateTime instanceof Date 
      ? transformedEvent.startDateTime 
      : new Date(transformedEvent.startDateTime);
    
    // First try exact match
    const existingExact = await Event.findOne({
      title: transformedEvent.title,
      startDateTime: eventStartDate
    });

    if (existingExact) {
      return existingExact;
    }

    // If no exact match, look for events within 5 minutes
    const fiveMinutesBefore = new Date(eventStartDate.getTime() - 5 * 60000);
    const fiveMinutesAfter = new Date(eventStartDate.getTime() + 5 * 60000);

    return await Event.findOne({
      title: transformedEvent.title,
      startDateTime: {
        $gte: fiveMinutesBefore,
        $lte: fiveMinutesAfter
      }
    });
  } catch (error) {
    console.error('Error finding existing event:', error);
    return null;
  }
};

const syncEvents = async () => {
  try {
    console.log('\n=== Starting Sync Process ===');
    const newEvents = await fetchNewEventsFromPostgres(lastSyncTime);
    
    if (newEvents.length > 0) {
      console.log(`Found ${newEvents.length} events to process`);
      let latestProcessedTime = lastSyncTime;

      for (const pgEvent of newEvents) {
        try {
          const transformedEvent = await transformEventData(pgEvent);
          const existingEvent = await findExistingEvent(transformedEvent);

          if (existingEvent) {
            console.log(`✗ Skipped duplicate: "${transformedEvent.title}"`);
            console.log(`  Existing time: ${existingEvent.startDateTime}`);
            console.log(`  New time: ${transformedEvent.startDateTime}`);
          } else {
            try {
              await Event.create(transformedEvent);
              console.log(`✓ Created: "${transformedEvent.title}"`);
              console.log(`  Time: ${transformedEvent.startDateTime}`);
            } catch (createError) {
              if (createError.code === 11000) {
                console.log(`✗ Concurrent duplicate detected: "${transformedEvent.title}"`);
              } else {
                throw createError;
              }
            }
          }

          if (new Date(pgEvent.created) > latestProcessedTime) {
            latestProcessedTime = new Date(pgEvent.created);
          }
        } catch (error) {
          if (error.code !== 11000) {
            console.error(`Error processing event ${pgEvent.event_name}:`, error.message);
          }
        }
      }

      lastSyncTime = latestProcessedTime;
      saveLastSyncTime(lastSyncTime);
    } else {
      console.log('No new events to sync');
    }
    console.log('=== Sync Process Complete ===\n');
  } catch (error) {
    console.error('Error during sync process:', error);
  }
};

const createUniqueIndex = async () => {
  try {
    await Event.collection.createIndex(
      { title: 1, startDateTime: 1 },
      { unique: true }
    );
    console.log('Unique index on title and startDateTime created');
  } catch (error) {
    if (error.code === 11000) {
      console.log('Unique index already exists');
    } else {
      console.error('Error creating unique index:', error);
    }
  }
};

const startSync = async () => {
  await createUniqueIndex();
  await syncEvents();
  // Run sync every houw
  cron.schedule('0 * * * *', async () => {
    console.log('\nStarting scheduled sync process...');
    await syncEvents();
  });
};

const startSynchronization = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
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