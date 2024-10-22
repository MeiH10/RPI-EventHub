const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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

eventSchema.index({ title: 1, startDateTime: 1 }, { unique: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
