// backend/services/adminSearchService.js
const User = require('../models/User'); // Adjust the path as necessary

// Function to find a user by their RCS ID
const findUserByRcsId = async (rcsId) => {
  try {
    const user = await User.findOne({ rcs_id: rcsId });
    return user; // Returns the user object if found, otherwise returns null
  } catch (error) {
    console.error('Error finding user by RCS ID:', error);
    throw error; // Re-throw error so it can be handled by the route
  }
};

module.exports = { findUserByRcsId };
