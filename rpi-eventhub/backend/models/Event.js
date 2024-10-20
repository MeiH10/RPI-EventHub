// models/Event.js

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  likes: { type: Number, default: 0 },
  creationTimestamp: { type: Date, default: Date.now },
  poster: { type: String, required: true },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String },
  tags: [String],
  club: { type: String, required: true },
  rsvp: { type: String },
});

eventSchema.index({ eventId: 1 }, { unique: true });

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

module.exports = Event;
