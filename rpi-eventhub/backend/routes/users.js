// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); 
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

module.exports = router;
