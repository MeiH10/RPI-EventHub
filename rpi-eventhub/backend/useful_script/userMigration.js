const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });


const BANNED = 0;
const UNVERIFIED = 1;
const VERIFIED = 2;
const OFFICER = 3;
const ADMIN = 4;

async function migrateUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    
    const collectionName = User.collection.name;
    const users = await User.find();
    console.log(`Found ${users.length} users to check`);
    
    let migratedCount = 0;

    for (const user of users) {
      const rawUser = await mongoose.connection.db
        .collection(collectionName)
        .findOne({ _id: user._id });
      
      if (!rawUser) {
        console.log(`User ${user.username} not found in database`);
        continue;
      }
      
      if ('role' in rawUser) {
        console.log(`User ${user.username} already has role=${rawUser.role}, skipping`);
        continue;
      }

      let newRole = UNVERIFIED;
      if (rawUser.emailVerified === true) {
        newRole = VERIFIED;
      }
      
      const updateResult = await mongoose.connection.db
        .collection(collectionName)
        .updateOne(
          { _id: user._id }, 
          { $set: { role: newRole } }
        );
      
      if (updateResult.modifiedCount === 1) {
        migratedCount++;
        console.log(`Migrated user ${user.username} to role=${newRole}`);
      }
    }

    console.log(`Migration complete! Migrated ${migratedCount} users.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateUsers();