const express = require('express');
const router = express.Router();
const Event = require('../models/Event'); // Adjust the path as necessary

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  const event = new Event({
    title: req.body.title,
    description: req.body.description,
    // `likes` defaults to 0, so no need to set it here
    // `creationTimestamp` defaults to now, so no need to set it here
    poster: req.body.poster,
    date: req.body.date,
    endDate: req.body.endDate,
    location: req.body.location,
    image: req.body.image, // Make sure you validate this is a proper Imgur URL if needed
    tags: req.body.tags,
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Other CRUD operations (update, delete, etc.)


module.exports = router;
