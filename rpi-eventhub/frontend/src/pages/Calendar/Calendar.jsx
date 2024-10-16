import React, { useEffect, useState, useContext } from "react";
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import config from "../../config";
import { Link } from "react-router-dom";
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';

const CalendarPage = () => {
  const [weekRange, setWeekRange] = useState({ start: "", end: "" });
  const [events, setEvents] = useState([]);
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();

  const parseDateAsEST = (utcDate) => {
    const date = new Date(utcDate);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    return new Date(year, month, day);
  };

  const getWeekRange = (startDate) => {
    const today = startDate || new Date();
    const currentDay = today.getDay();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - currentDay);

    const lastDayOfWeek = new Date(today);
    lastDayOfWeek.setDate(today.getDate() + (6 - currentDay));

    const formatDate = (date) => {
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const yy = date.getFullYear();
      return `${mm}/${dd}/${yy}`;
    };

    setWeekRange({
      start: formatDate(firstDayOfWeek),
      end: formatDate(lastDayOfWeek),
    });
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const handleWeekChange = (offset) => {
    const newStartDate = new Date(currentStartDate);
    newStartDate.setDate(currentStartDate.getDate() + offset * 7);
    setCurrentStartDate(newStartDate);
    getWeekRange(newStartDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentStartDate(today);
    getWeekRange(today);
  };

  useEffect(() => {
    getWeekRange(currentStartDate);
    fetchEvents();
  }, [currentStartDate]);

  useEffect(() => {
    fetchEvents();
  }, [weekRange]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const filterEventsByDay = (day, firstDayOfWeek, lastDayOfWeek) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDateTime || event.date);
      eventDate.setHours(0, 0, 0, 0);
      return (
        eventDate.getDay() === day &&
        eventDate >= firstDayOfWeek &&
        eventDate <= lastDayOfWeek
      );
    });
  };

  const pageStyles = {
    background: isDark
      ? '#120451'
      : `linear-gradient(
          217deg,
          rgba(255, 101, 101, 0.8),
          rgb(255 0 0 / 0%) 70.71%
        ), linear-gradient(127deg, rgba(255, 248, 108, 0.8), rgb(0 255 0 / 0%) 70.71%),
        linear-gradient(336deg, rgba(66, 66, 255, 0.8), rgb(0 0 255 / 0%) 70.71%)`,
    color: isDark ? '#fff' : '#000',
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'text-white' : 'text-black'}`} style={pageStyles} data-theme={theme}>
      <NavBar />
      <div className="flex-1 pt-20 container mx-auto">
        <div className="mt-10 border-3 p-4 bg-white dark:bg-gray-800 text-black dark:text-white w-11/12 mx-auto mb-10">
          <div className="flex justify-center mb-5">
            <button onClick={() => handleWeekChange(-1)} className="mx-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Previous Week
            </button>
            <button onClick={goToToday} className="mx-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Today
            </button>
            <button onClick={() => handleWeekChange(1)} className="mx-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Next Week
            </button>
          </div>
          <h2 className="mb-2 text-3xl text-black dark:text-white">
            Week of {weekRange.start} - {weekRange.end}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-0 text-center">
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <div key={day} className="p-2 border border-black dark:border-white bg-gray-100 dark:bg-gray-700 text-black dark:text-white flex flex-col items-center">
                <h3 className="text-lg border-b border-black dark:border-white w-full pb-1">
                  {
                    [
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ][day]
                  }
                </h3>
                {filterEventsByDay(
                  day,
                  parseDateAsEST(weekRange.start),
                  parseDateAsEST(weekRange.end)
                ).length > 0 ? (
                  filterEventsByDay(
                    day,
                    parseDateAsEST(weekRange.start),
                    parseDateAsEST(weekRange.end)
                  ).map((event) => (
                    <Link to={`/events/${event._id}`} key={event._id} className="w-full">
                      <div className="p-2 text-center mb-5 border border-black dark:border-white">
                        <h4 className="font-serif text-lg font-bold text-black dark:text-white">
                          {event.title}
                        </h4>
                        {event.image ? (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="max-w-full h-auto my-2"
                          />
                        ) : (
                          <p>No image available</p>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <p>No events</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CalendarPage;