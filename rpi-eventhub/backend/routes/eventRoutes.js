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



// Other CRUD operations (update, delete, etc.)


module.exports = router;
