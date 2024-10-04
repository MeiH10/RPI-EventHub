const fs = require('fs');

function extractDateTime(datetimeString) {
  const dateObj = new Date(datetimeString);
  
  const options = { 
    timeZone: 'America/New_York', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  };
  
  const localDateString = dateObj.toLocaleString('en-US', options);
  
  const [month, day, year, time] = localDateString.match(/\d+/g);

  return { date: `${year}-${month}-${day}`, time: time.slice(0, 5) };
}

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

      const startDateTime = extractDateTime(event.event_start);
      const endDateTime = extractDateTime(event.event_end);

      const transformedEvent = {
        title: event.event_name,
        description: event.description || 'No description provided.',
        likes: 0,
        creationTimestamp: new Date(),
        poster: event.submitted_by || 'admin',
        date: new Date(startDateTime.date),
        endDate: new Date(endDateTime.date),
        location: event.location || 'Unknown',
        image: event.image_id ? `https://imgbb.com/${event.image_id}` : '',
        tags: event.tags || [],
        time: startDateTime.time || '00:00',
        endTime: endDateTime.time || '23:59',
        club: event.club_name || 'Unknown',
        rsvp: event.rsvp_link || ''
      };

      cleanedEvents.push(transformedEvent);
    }
  });

  return cleanedEvents;
}

fs.readFile('events_202410011504.json', 'utf8', (err, data) => {
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
