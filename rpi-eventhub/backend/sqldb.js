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

const logDetailedTimeInfo = (eventName, originalDate, convertedDate) => {
  console.log('\nDetailed Time Information for:', eventName);
  console.log('Original Date Object:', originalDate);
  console.log('Original Date ISO:', originalDate.toISOString());
  console.log('Original Timezone:', originalDate.getTimezoneOffset());
  console.log('Converted UTC:', convertedDate);
  
  // Parse back to verify consistency
  const parsed = new Date(convertedDate);
  console.log('Parsed back to local:', parsed);
  console.log('Difference in hours:', (parsed - originalDate) / (1000 * 60 * 60));
};

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
    throw error;
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

const logTimeConversion = (pgEvent, transformedEvent) => {
  console.log('Time Conversion Details:');
  console.log(`Original event_start (EST): ${pgEvent.event_start}`);
  console.log(`Transformed startDateTime (UTC): ${transformedEvent.startDateTime}`);
  if (pgEvent.event_end) {
    console.log(`Original event_end (EST): ${pgEvent.event_end}`);
    console.log(`Transformed endDateTime (UTC): ${transformedEvent.endDateTime}`);
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

  // Ensure dates are properly handled
  const eventStart = new Date(pgEvent.event_start);
  const startDateTime = DateTime.fromJSDate(eventStart, { zone: 'America/New_York' })
    .toUTC()
    .toISO({ suppressMilliseconds: true });
  
  // Log detailed time information for debugging
  logDetailedTimeInfo(title, eventStart, startDateTime);

  // Handle end time
  let endDateTime;
  if (pgEvent.event_end) {
    const eventEnd = new Date(pgEvent.event_end);
    endDateTime = DateTime.fromJSDate(eventEnd, { zone: 'America/New_York' })
      .toUTC()
      .toISO({ suppressMilliseconds: true });
  } else {
    endDateTime = DateTime.fromJSDate(eventStart, { zone: 'America/New_York' })
      .plus({ hours: 3 })
      .toUTC()
      .toISO({ suppressMilliseconds: true });
  }

  const creationTimestamp = DateTime.fromJSDate(new Date(pgEvent.created))
    .toUTC()
    .toISO({ suppressMilliseconds: true });

  // Handle image upload after time conversion
  let imageUrl = '';
  if (pgEvent.image_id) {
    try {
      const originalImageUrl = `${process.env.IMAGE_PREFIX}${pgEvent.image_id}`;
      imageUrl = await uploadImageToImgBB(originalImageUrl);
    } catch (error) {
      console.error(`Image upload failed for event "${title}":`, error.message);
    }
  }

  // Normalize the title for consistency in checks
  const normalizedTitle = title.trim().toLowerCase();

  return {
    title,
    normalizedTitle,
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
  // Check for existing event within a 5-minute window
  const startDate = DateTime.fromISO(transformedEvent.startDateTime);
  const fiveMinutesBefore = startDate.minus({ minutes: 5 }).toISO();
  const fiveMinutesAfter = startDate.plus({ minutes: 5 }).toISO();

  return await Event.findOne({
    normalizedTitle: transformedEvent.normalizedTitle,
    startDateTime: {
      $gte: fiveMinutesBefore,
      $lte: fiveMinutesAfter
    }
  });
};

const syncEvents = async () => {
  try {
    console.log(`Starting sync. Last sync time (UTC): ${DateTime.fromJSDate(lastSyncTime).toUTC().toISO()}`);
    const newEvents = await fetchNewEventsFromPostgres(lastSyncTime);
    
    if (newEvents.length > 0) {
      console.log(`Fetched ${newEvents.length} new event(s) from PostgreSQL.`);
      let latestProcessedTime = lastSyncTime;

      for (const pgEvent of newEvents) {
        try {
          console.log('\n=== Event Processing Start ===');
          console.log(`Event Name: ${pgEvent.event_name}`);
          
          const transformedEvent = await transformEventData(pgEvent);
          logTimeConversion(pgEvent, transformedEvent);
          
          const existingEvent = await findExistingEvent(transformedEvent);

          if (!existingEvent) {
            await Event.create(transformedEvent);
            console.log('Created new event:');
            console.log('Title:', transformedEvent.title);
            console.log('Start time (UTC):', transformedEvent.startDateTime);
          } else {
            console.log('Duplicate event found - skipping');
            console.log('Existing start time:', existingEvent.startDateTime);
            console.log('New start time:', transformedEvent.startDateTime);
          }

          if (new Date(pgEvent.created) > latestProcessedTime) {
            latestProcessedTime = new Date(pgEvent.created);
          }
          
          console.log('=== Event Processing Complete ===');
        } catch (error) {
          console.error(`Error processing event ${pgEvent.event_name}:`, error.message);
        }
      }

      lastSyncTime = latestProcessedTime;
      saveLastSyncTime(lastSyncTime);
      console.log(`Sync completed. Last sync time updated to (UTC): ${DateTime.fromJSDate(lastSyncTime).toUTC().toISO()}`);
    } else {
      console.log('No new events to sync.');
    }
  } catch (error) {
    console.error('Error during sync process:', error);
  }
};

const createUniqueIndex = async () => {
  try {
    await Event.collection.createIndex(
      { normalizedTitle: 1, startDateTime: 1 },
      { unique: true }
    );
    console.log('Unique index on normalizedTitle and startDateTime created');
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
  // Run sync every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Starting scheduled sync process...');
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