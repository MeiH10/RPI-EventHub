require('dotenv').config();

const mongoose = require('mongoose');
const cron = require('node-cron');
const Event = require('./models/Event');
const EventArchive = require('./models/EventArchive');

const archiveOldEvents = async () => {
   const currentDate = new Date();

   // Subtract one day from the current date
   const oneDayAgo = new Date();
   oneDayAgo.setDate(currentDate.getDate() - 1);

   try {
      // Find all events where either "endDateTime" or "startDateTime" is before one day ago
      const oldEvents = await Event.find({
         $or: [
            { endDateTime: { $lt: oneDayAgo } },  // Archive based on endDateTime
            { startDateTime: { $lt: oneDayAgo } }, // Archive based on startDateTime if no endDateTime
            { date: { $lt: oneDayAgo } }  // Archive based on date if no endDateTime or startDateTime (old schema)
         ]
      });

      if (oldEvents.length > 0) {
         const archivedEventsData = oldEvents.map(event => {
            const eventObject = event.toObject();

            // Conditionally remove eventId if it exists
            if (eventObject.hasOwnProperty('eventId')) {
               delete eventObject.eventId;
            }

            // If the event has a "date" field, remove it and set "startDateTime" and "endDateTime" to its value
            if (eventObject.hasOwnProperty('date')) {
               let combinedDateTime;

               if (eventObject.hasOwnProperty('time')) {
                  // Combine the "date" and "time" fields into a single Date object
                  const datePart = new Date(eventObject.date);
                  const timePart = eventObject.time.split(':');

                  datePart.setHours(parseInt(timePart[0]));
                  datePart.setMinutes(parseInt(timePart[1]));

                  combinedDateTime = datePart;
               } else {
                  combinedDateTime = new Date(eventObject.date);
               }

               eventObject.startDateTime = combinedDateTime;
               eventObject.endDateTime = combinedDateTime;

               // Remove the "date" field and "time" field (if they exist)
               delete eventObject.date;
               if (eventObject.hasOwnProperty('time')) {
                  delete eventObject.time;
               }
            }

            return eventObject;
         });

         // Insert the modified events into the EventArchive collection
         const archivedEvents = await EventArchive.insertMany(archivedEventsData);
         console.log(`${archivedEvents.length} events successfully archived into the EventArchive collection`);

         // Remove the archived events from the Event collection
         const result = await Event.deleteMany({
            _id: { $in: oldEvents.map(event => event._id) }
         });

         console.log(`${result.deletedCount} old events deleted from the Event collection.`);
      } else {
         console.log('No old events to archive.');
      }
   } catch (error) {
      console.error('Error archiving old events:', error);
   }
};
   
   
// Cron job to run the archiveOldEvents function every day at XX:XX XM
cron.schedule('42 16 * * *', () => {
   console.log('Running a scheduled job to archive old events');
   archiveOldEvents();
});

module.exports = archiveOldEvents;
