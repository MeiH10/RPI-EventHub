const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  likes: { type: Number, default: 0 },
  creationTimestamp: { type: Date, default: Date.now },
  poster: { type: String, required: true },
  date: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String }, // Storing the URL to an image hosted on Imgur or similar service
  tags: [String], // An array of strings to store tags
  time: { type: String, required: true },
  endTime: {type: String, required: true},
  club: {type: String, required: true},
  rsvp: {type: String, required: false}
}, {creationTimestamp: true});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
