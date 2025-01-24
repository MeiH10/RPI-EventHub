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

// PostgreSQL client setup with SSL
const pgClient = new Client({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE || 'defaultdb',
  ssl: { rejectUnauthorized: false }
});

pgClient.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

const lastSyncFilePath = path.join(__dirname, 'lastSyncTime.txt');

// Load and save sync timestamp functions
const loadLastSyncTime = () => {
  if (fs.existsSync(lastSyncFilePath)) {
    const timeStr = fs.readFileSync(lastSyncFilePath, 'utf-8');
    return new Date(timeStr);
  }
  return new Date(0);
};

const saveLastSyncTime = (time) => {
  fs.writeFileSync(lastSyncFilePath, time.toISOString());
};

let lastSyncTime = loadLastSyncTime();

// Image upload handling
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
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data?.data?.url || null;
  } catch (error) {
    console.error(`Image upload failed for ${imageUrl}: ${error.message}`);
    return '';
  }
};

// Fetch new events from PostgreSQL
const fetchNewEventsFromPostgres = async (lastSyncTime) => {
  // Convert lastSyncTime to UTC for PostgreSQL comparison
  const utcLastSync = DateTime.fromJSDate(lastSyncTime)
    .toUTC()
    .toSQL();

  const query = 'SELECT * FROM events WHERE created > $1::timestamp ORDER BY created ASC, event_id ASC';
  const values = [utcLastSync];
  
  try {
    const res = await pgClient.query(query, values);
    return res.rows;
  } catch (error) {
    console.error('Error fetching from PostgreSQL:', error);
    throw error;
  }
};

const transformEventData = async (pgEvent) => {
  let poster = pgEvent.submitted_by || 'admin';
  if (poster.endsWith('@rpi.edu')) {
    poster = poster.slice(0, -('@rpi.edu'.length));
  }

  console.log(`\nProcessing event: ${pgEvent.event_name}`);
  console.log('Original EST time:', pgEvent.event_start);

  // PostgreSQL time is in EST, convert to UTC
  const startDateTime = DateTime.fromJSDate(new Date(pgEvent.event_start), { zone: 'America/New_York' })
    .toUTC()
    .toJSDate();

  console.log('Converted UTC time:', startDateTime);

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

  let imageUrl = '';
  if (pgEvent.image_id) {
    const originalImageUrl = `${process.env.IMAGE_PREFIX}${pgEvent.image_id}`;
    imageUrl = await uploadImageToImgBB(originalImageUrl);
  }

  return {
    title: pgEvent.event_name || 'Untitled Event',
    description: pgEvent.description || 'No description provided.',
    likes: pgEvent.likes || 0,
    creationTimestamp: new Date(),
    poster,
    startDateTime,
    endDateTime,
    location: pgEvent.location || 'None',
    image: imageUrl,
    tags: Array.from(giveTags(pgEvent.event_name || '', pgEvent.description || '')),
    club: pgEvent.club_name || 'Unknown Club',
    rsvp: pgEvent.more_info || '',
  };
};

// Check for existing events with timezone-aware comparison
const findExistingEvent = async (transformedEvent) => {
  try {
    console.log('Searching for existing event with:', {
      title: transformedEvent.title,
      startDateTime: transformedEvent.startDateTime
    });

    // Times are already in UTC, direct comparison
    const existingExact = await Event.findOne({
      title: transformedEvent.title,
      startDateTime: transformedEvent.startDateTime
    });

    if (existingExact) {
      console.log('Found exact match:', existingExact.startDateTime);
      return existingExact;
    }

    // 5-minute window search
    const startDate = new Date(transformedEvent.startDateTime);
    const fiveMinutesBefore = new Date(startDate.getTime() - 5 * 60000);
    const fiveMinutesAfter = new Date(startDate.getTime() + 5 * 60000);

    const existingWithinWindow = await Event.findOne({
      title: transformedEvent.title,
      startDateTime: {
        $gte: fiveMinutesBefore,
        $lte: fiveMinutesAfter
      }
    });

    if (existingWithinWindow) {
      console.log('Found match within 5-minute window:', existingWithinWindow.startDateTime);
    }

    return existingWithinWindow;
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
            console.log(`  Existing time (UTC): ${existingEvent.startDateTime}`);
            console.log(`  New time (UTC): ${transformedEvent.startDateTime}`);
          } else {
            try {
              await Event.create(transformedEvent);
              console.log(`✓ Created: "${transformedEvent.title}"`);
              console.log(`  Time (UTC): ${transformedEvent.startDateTime}`);
            } catch (createError) {
              if (createError.code === 11000) {
                console.log(`✗ Concurrent duplicate: "${transformedEvent.title}"`);
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
    console.log('Created/verified unique index');
  } catch (error) {
    if (error.code === 11000) {
      console.log('Unique index exists');
    } else {
      console.error('Error creating index:', error);
    }
  }
};

const startSync = async () => {
  await createUniqueIndex();
  await syncEvents();
  cron.schedule('* * * * *', async () => {
    console.log('\nStarting scheduled sync...');
    await syncEvents();
  });
};

const startSynchronization = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
    await startSync();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

startSynchronization();

module.exports = { startSync };