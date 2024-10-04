const fs = require('fs');

function cleanAndTransformEvents(events) {
  const cleanedEvents = [];
  const eventNamesSet = new Set();

  events.forEach(event => {
    if (event.repeat !== 0) {
      return;
    }

    const uniqueKey = `${event.event_name}-${event.club_name}-${new Date(event.event_start).toISOString()}`;

    if (!eventNamesSet.has(uniqueKey)) {
      eventNamesSet.add(uniqueKey);

      const transformedEvent = {
        title: event.event_name,
        description: event.description || 'No description provided.',
        likes: 0,
        creationTimestamp: new Date(),
        poster: event.submitted_by || 'admin',
        startDateTime: new Date(event.event_start),  // Move event_start to startDateTime
        endDateTime: event.event_end ? new Date(event.event_end) : null,  // Move event_end to endDateTime
        location: event.location || 'Unknown',
        image: event.image_id ? `https://imgbb.com/${event.image_id}` : '',
        tags: event.tags || [],
        club: event.club_name || 'Unknown',
        rsvp: event.rsvp_link || ''
      };

      cleanedEvents.push(transformedEvent);
    }
  });

  return cleanedEvents;
}

fs.readFile('./events_202410011504.json', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading JSON file:", err);
    return;
  }

  const jsonData = JSON.parse(data);
  const events = jsonData.events;

  const cleanedEvents = cleanAndTransformEvents(events);

  fs.writeFile('cleaned_events.json', JSON.stringify(cleanedEvents, null, 2), err => {
    if (err) {
      console.error("Error writing cleaned JSON:", err);
    } else {
      console.log("Cleaned events have been saved to cleaned_events.json");
    }
  });
});
