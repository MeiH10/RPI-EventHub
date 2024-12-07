import React, { useEffect, useState, useRef, useContext } from "react";
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import config from "../../config";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';

const CalendarPage = () => {
  const [weekRange, setWeekRange] = useState({ start: "", end: "" });
  const [events, setEvents] = useState([]);
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();
  const calendarRef = useRef(null);

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

  const loadAllImages = () => {
    const images = calendarRef.current.querySelectorAll("img");
    return Promise.all(
      Array.from(images).map((img) => {
        if (!img.complete) {
          return new Promise((resolve) => {
            img.onload = img.onerror = resolve;
          });
        }
        return Promise.resolve();
      })
    );
  };

  const captureCalendarScreenshot = async () => {
    await loadAllImages();
    if (calendarRef.current) {
      html2canvas(calendarRef.current, { useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `calendar-${weekRange.start}-to-${weekRange.end}.png`;
        link.click();
      });
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'text-white bg-[#120451]' : 'text-black bg-gradient-to-r from-red-400 via-yellow-200 to-blue-400'}`} data-theme={theme}>
      <NavBar />
      <div className="container mx-auto p-4">
        <div className="text-center mb-8">
          <button onClick={captureCalendarScreenshot} className="bg-red-500 text-white p-2 rounded-lg">
            Save Calendar as Image
          </button>
        </div>
        <div ref={calendarRef}>
          <div className="flex justify-between mb-4">
            <button onClick={() => handleWeekChange(-1)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Previous Week
            </button>
            <button onClick={goToToday} className="bg-blue-500 text-white px-4 py-2 rounded">
              Today
            </button>
            <button onClick={() => handleWeekChange(1)} className="bg-blue-500 text-white px-4 py-2 rounded">
              Next Week
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4">
            Week of {weekRange.start} - {weekRange.end}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <div key={day} className="border p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
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
                    <Link to={`/events/${event._id}`} key={event._id}>
                      <div className={`p-2 mb-2 rounded-lg ${isDark ? 'border border-white' : 'border border-gray-300'}`}>
                        <h4 className="font-semibold">{event.title}</h4>
                        {event.image ? (
                          <img
                            src={`${config.apiUrl}/proxy/image/${event._id}`}
                            alt={event.title}
                            className="w-full h-32 object-cover rounded-lg mt-2"
                          />
                        ) : (
                          <div
                            className="w-full h-32 flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg mt-2"
                          >
                            No image available
                          </div>
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