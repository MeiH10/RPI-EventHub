const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

async function migrateUsers() {
  try {
    // Connect to your MongoDB database (update the connection string as needed)
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB.');

    // Update all user documents:
    const result = await User.updateMany(
      {},
      {
        $set: { role: 1 },
        $unset: { emailVerified: "" }
      }
    );

    console.log(`Migration complete. Modified ${result.modifiedCount} documents.`);
    process.exit(0);
  } catch (err) {
    console.error('Error during migration:', err);
    process.exit(1);
  }
}

migrateUsers();
