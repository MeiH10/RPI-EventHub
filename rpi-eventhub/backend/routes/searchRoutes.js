// routes/search.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Search RCS IDs
router.get('/search', async (req, res) => {
    const query = req.query.q; // q is the search term sent from the frontend
    try {
        const users = await User.find({
            rcsId: { $regex: query, $options: 'i' } // case-insensitive search
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error searching RCS IDs' });
    }
});

module.exports = router;
