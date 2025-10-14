const express = require('express');
const router = express.Router();
const { createEvents } = require('ics');
const Event = require('../models/Event.js'); // adjust path

function toArrayUTC(d) {
  const dt = new Date(d);
  return [
    dt.getUTCFullYear(),
    dt.getUTCMonth() + 1,
    dt.getUTCDate(),
    dt.getUTCHours(),
    dt.getUTCMinutes()
  ];
}

router.get('/events.ics', async (req, res) => {
  try {
    const events = await Event.find({}).lean();

    const icsEvents = events.map(ev => {
      const start = toArrayUTC(ev.startDateTime || ev.date);
      const end = ev.endDateTime ? toArrayUTC(ev.endDateTime) : undefined;

      return {
        start,
        end,
        title: ev.title || 'Untitled',
        description: (ev.description || '').replace(/\n/g, '\\n'),
        location: ev.location || '',
        uid: `${ev._id}@rpieventhub`,
        productId: 'RPI EventHub',
        calName: 'RPI EventHub',
        status: 'CONFIRMED'
      };
    });

    const { error, value } = createEvents(icsEvents);
    if (error) throw error;

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline; filename="events.ics"');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(value);
  } catch (e) {
    console.error(e);
    res.status(500).send('Failed to generate ICS');
  }
});

module.exports = router;