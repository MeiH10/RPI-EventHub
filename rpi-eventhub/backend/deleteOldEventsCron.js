require('dotenv').config();

const mongoose = require('mongoose');
const cron = require('node-cron');
const Event = require('./models/Event');

mongoose.connect(process.env.MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})
   .then(() => console.log('MongoDB connected using env file'))
   .catch((err) => console.log(err));

const deleteOldEvents = async () => {
   const currentDate = new Date();

   const oneDayAgo = new Date();
   oneDayAgo.setDate(currentDate.getDate() - 1);

   try {
      const result = await Event.deleteMany({
         endDateTime: { $lt: oneDayAgo }
      });

      console.log(`${result.deletedCount} old events deleted.`);
   } catch (error) {
      console.error('Error deleting old events:', error);
   }
};

cron.schedule('0 0 * * *', () => {
   console.log('Running a scheduled job to delete old events');
   deleteOldEvents();
});

module.exports = deleteOldEvents;