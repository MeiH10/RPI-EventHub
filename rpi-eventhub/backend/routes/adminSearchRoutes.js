const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path based on your file structure

// Endpoint to get all RCS IDs
router.get('/rcs-ids', async (req, res) => {
  try {
    const users = await User.find({}, 'rcs_id'); // Adjust the field name based on your schema
    const rcsIds = users.map(user => user.rcs_id);
    res.json(rcsIds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve RCS IDs' });
  }
});

module.exports = router;
