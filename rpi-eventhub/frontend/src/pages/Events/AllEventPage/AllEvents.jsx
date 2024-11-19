import React, { useEffect, useState, useCallback, useContext } from 'react';
import styles from './AllEvents.module.css';
import Navbar from "../../../components/Navbar/Navbar";
import FilterBar from '../../../components/FilterBar/FilterBar';
import Footer from "../../../components/Footer/Footer";
import EventCard from '../../../components/EventCard/EventCard';
import { useEvents } from '../../../context/EventsContext';
import EventList from '../../../pages/Events/AllEventList/EventsList';
import { Skeleton } from '@mui/material';
import Masonry from 'react-masonry-css';
import axios from 'axios';
import config from '../../../config';
import EventsListCard from '../../../pages/Events/AllEventList/EventsList';
import { ThemeContext } from '../../../context/ThemeContext';
import { useColorScheme } from '../../../hooks/useColorScheme';

function AllEvents() {
  const { events, fetchEvents, deleteEvent } = useEvents();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [sortMethod, setSortMethod] = useState('likes');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isListView, setIsListView] = useState(false);
  const [liked, setLiked] = useState([]); // Array of ids
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();
  const [selectedEventIds, setSelectedEventIds] = useState([]);
  const [posterSize, setPosterSize] = useState(400); // Default size

  const generateICS = () => {
    // Filter events by selected event IDs
    const filteredByIds = filteredEvents.filter(event => selectedEventIds.includes(event._id));

    let icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//YourApp//Event Calendar//EN\n`;

    filteredByIds.forEach(event => {
      icsData += `BEGIN:VEVENT\n`;
      icsData += `UID:${event._id}\n`; // Using _id since that's the unique identifier in MongoDB
      icsData += `DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d+/g, '')}\n`; // Correct UTC format
      icsData += `DTSTART:${new Date(event.startDateTime).toISOString().replace(/-|:|\.\d+/g, '')}\n`;
      icsData += `DTEND:${new Date(event.endDateTime).toISOString().replace(/-|:|\.\d+/g, '')}\n`;
      icsData += `SUMMARY:${event.title}\n`;
      icsData += `DESCRIPTION:${event.description}\n`;
      icsData += `LOCATION:${event.location}\n`;
      icsData += `END:VEVENT\n`;
    });

    icsData += `END:VCALENDAR\n`;

    // Create a Blob object for the ICS content
    const blob = new Blob([icsData], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'events.ics'; // Filename for the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the DOM element
  };

  const handleSelect = (eventId) => {
    setSelectedEventIds((prevSelectedIds) => {
      // If the event ID is already selected, remove it from the array (unselect)
      if (prevSelectedIds.includes(eventId)) {
        return prevSelectedIds.filter((id) => id !== eventId);
      } else {
        // Otherwise, add it to the array
        return [...prevSelectedIds, eventId];
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchEvents();
      await getLikedEvents();
      setIsLoading(false);
    };

    const getLikedEvents = async () => {
      // Fetch user information or check user data to determine if the event is liked
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(`${config.apiUrl}/events/like/status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLiked(response.data); // Update the liked state based on the server response
      } catch (err) {
        console.error("Error fetching like status:", err);
      }
    };

    getLikedEvents();
    fetchData();
  }, [fetchEvents]);

  useEffect(() => {
    setFilteredEvents(events);
    const filteredEvents = events.filter(event => new Date(event.startDateTime) >= new Date());
    const tags = [...new Set(filteredEvents.flatMap(event => event.tags || []))];
    setAvailableTags(tags);
  }, [events]);

  const handleFilterChange = useCallback((filters) => {
    let filtered = events;
    if (filters.tags.length > 0) {
      filtered = filtered.filter(event =>
        filters.tags.every(tag => event.tags?.includes(tag))
      );
    }
    const now = new Date();
    if (filters.time.length > 0) {
      let timeFiltered = [];
      if (filters.time.includes('past')) {
        timeFiltered = timeFiltered.concat(
          filtered.filter(event => new Date(event.startDateTime || event.date) < now)
        );
      }
      if (filters.time.includes('upcoming')) {
        timeFiltered = timeFiltered.concat(
          filtered.filter(event => new Date(event.startDateTime || event.date) >= now)
        );
      }
      if (filters.time.includes('today')) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        timeFiltered = timeFiltered.concat(
          filtered.filter(event => {
            const eventDate = new Date(event.startDateTime || event.date);
            return eventDate >= todayStart && eventDate <= todayEnd;
          })
        );
      }
      const uniqueTimeFiltered = [];
      const seenIds = new Set();
      timeFiltered.forEach(event => {
        if (!seenIds.has(event._id)) {
          seenIds.add(event._id);
          uniqueTimeFiltered.push(event);
        }
      });
      filtered = uniqueTimeFiltered;
    }
    setSortMethod(filters.sortMethod);
    setSortOrder(filters.sortOrder);
    setFilteredEvents(filtered);
  }, [events]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchEvents();
      setIsLoading(false);
    };

    fetchData();
  }, [fetchEvents]);

  useEffect(() => {
    const filteredEvents = events.filter(event => new Date(event.startDateTime) >= new Date());
    const tags = [...new Set(filteredEvents.flatMap(event => event.tags || []))];
    setAvailableTags(tags);

    const defaultFilters = {
      tags: [],
      time: ['upcoming', 'today'],
      sortMethod: 'likes',
      sortOrder: 'desc'
    };

    handleFilterChange(defaultFilters);
  }, [events, handleFilterChange]);

  const sortEvents = (events, sortMethod, sortOrder) => {
    const sortedEvents = [...events];
    switch (sortMethod) {
      case 'date':
        return sortedEvents.sort((a, b) => sortOrder === 'asc'
          ? new Date(a.startDateTime || a.date) - new Date(b.startDateTime || b.date)
          : new Date(b.startDateTime || b.date) - new Date(a.startDateTime || a.date));
      case 'likes':
        return sortedEvents.sort((a, b) => sortOrder === 'asc' ? a.likes - b.likes : b.likes - a.likes);
      case 'title':
        return sortedEvents.sort((a, b) => sortOrder === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
      default:
        return sortedEvents;
    }
  };

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  const changeView = () => {
    setIsListView(!isListView);
  };

  const handlePosterSizeChange = (event) => {
    setPosterSize(event.target.value);
  };

  return (
    <div className={`${styles.allEvents} ${isDark ? 'bg-[#120451] text-white' : 'bg-gradient-to-r from-red-400 via-yellow-200 to-blue-400 text-black'}`} data-theme={theme}>
      <Navbar />
      <div className="container-fluid" style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
        <div className={styles.filterContainer}>
          <FilterBar
            tags={availableTags}
            onFilterChange={handleFilterChange}
            filteredCount={filteredEvents.length}
            changeView={changeView}
            showICS={selectedEventIds.length > 0}
            onUnselectAll={() => setSelectedEventIds([])}
            onDownloadICS={generateICS}
          />
          <div>
            <label htmlFor="poster-size">Poster Size:</label>
            <input
              type="range"
              id="poster-size"
              name="poster-size"
              min="200"
              max="600"
              value={posterSize}
              onChange={handlePosterSizeChange}
            />
          </div>
        </div>
        {isListView ? (
          <div className={styles.eventsDisplayContainer}>
            {sortEvents(filteredEvents, sortMethod, sortOrder).map((event) => (
              <EventsListCard
                event={event}
                selected={selectedEventIds.includes(event._id)}
                events={sortEvents(filteredEvents, sortMethod, sortOrder)}
                selectedEventIds={selectedEventIds}
                onSelect={() => handleSelect(event._id)}
              />
            ))}
          </div>
        ) : (
          <>
            <div className={styles.eventsDisplayContainer}>
              {isLoading ? (
                Array.from(new Array(10)).map((_, index) => (
                  <div key={index} className={styles.skeletonWrapper}>
                    <Skeleton variant="rectangular" width={posterSize} height={posterSize * 1.33} />
                    <Skeleton variant="text" width={posterSize * 0.5} />
                    <Skeleton variant="text" width={posterSize * 0.375} />
                  </div>
                ))
              ) : (
                <>
                  <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className={styles.myMasonryGrid}
                    columnClassName={styles.myMasonryGridColumn}
                  >
                    {sortEvents(filteredEvents, sortMethod, sortOrder).map((event) => (
                      <EventCard
                        selected={selectedEventIds.includes(event._id)}
                        isLiked={liked.includes(event._id.toString())}
                        key={event._id}
                        event={event}
                        onSelect={() => handleSelect(event._id)}
                        style={{ width: posterSize, height: posterSize * 1.33 }}
                      />
                    ))}
                  </Masonry>
                </>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default AllEvents;