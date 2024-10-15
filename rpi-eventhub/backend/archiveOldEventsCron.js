// Load environment variables from the .env file
require('dotenv').config();

const mongoose = require('mongoose');
const cron = require('node-cron');
const Event = require('./models/Event');
const EventArchive = require('./models/EventArchive');

mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})
   .then(() => console.log('MongoDB connected using env file'))
   .catch((err) => console.log(err));

const archiveOldEvents = async () => {
   const currentDate = new Date();

   const oneDayAgo = new Date();
   oneDayAgo.setDate(currentDate.getDate() - 1);

   try {
      const oldEvents = await Event.find({
         endDateTime: { $lt: oneDayAgo }
      });

      if (oldEvents.length > 0) {
         await EventArchive.insertMany(oldEvents);

         const result = await Event.deleteMany({
            endDateTime: { $lt: oneDayAgo }
         });

         console.log(`${oldEvents.length} events archived and ${result.deletedCount} old events deleted.`);
      } else {
         console.log('No old events to archive.');
      }
   } catch (error) {
      console.error('Error archiving old events:', error);
   }
};

cron.schedule('0 0 * * *', () => {
   console.log('Running a scheduled job to archive old events');
   archiveOldEvents();
});

module.exports = archiveOldEvents;
