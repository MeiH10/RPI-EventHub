const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path as necessary

// Get all events
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Other CRUD operations (update, delete, etc.)


module.exports = router;
