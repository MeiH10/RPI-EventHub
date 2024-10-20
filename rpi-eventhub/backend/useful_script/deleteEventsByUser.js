const mongoose = require('mongoose');
const Event = require('../models/Event');
require('dotenv').config({ path: '../.env' });

const deleteEventsByUser = async (username) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    console.log('Connected to MongoDB');

    const result = await Event.deleteMany({ poster: username });

    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} event(s) posted by ${username}`);
    } else {
      console.log(`No events found posted by ${username}`);
    }
  } catch (error) {
    console.error('Error deleting events:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('Usage: node deleteEventsByUser.js <username>');
  process.exit(1);
}

const username = args[0];
deleteEventsByUser(username);
