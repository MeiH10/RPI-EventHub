const mongoose = require('mongoose');

const eventArchiveSchema = new mongoose.Schema({
   title: { type: String},         
   description: { type: String},   
   likes: { type: Number, default: 0 },             
   creationTimestamp: { type: Date, default: Date.now }, 
   poster: { type: String},      
   startDateTime: { type: Date},   
   endDateTime: { type: Date},     
   location: { type: String},      
   image: { type: String },                         
   tags: [String],                                  
   club: { type: String},          
   rsvp: { type: String }                           
}, { timestamps: true });

const EventArchive = mongoose.model('EventArchive', eventArchiveSchema);

module.exports = EventArchive;

