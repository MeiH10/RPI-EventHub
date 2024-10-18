import React, { useEffect, useState, useRef } from "react";
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CalendarCSS from "./Calendar.module.css";
import axios from "axios";
import config from "../../config";
import ics from "ics";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";

const CalendarPage = () => {
  const [weekRange, setWeekRange] = useState({ start: "", end: "" });
  const [events, setEvents] = useState([]);
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
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

  const filterEventsByWeek = (firstDayOfWeek, lastDayOfWeek) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDateTime || event.date);
      eventDate.setHours(0, 0, 0, 0); // Normalize the event date to compare only the date part
      return eventDate >= firstDayOfWeek && eventDate <= lastDayOfWeek;
    });
  };

  const generateICSFile = () => {
    const weekEvents = filterEventsByWeek(
      parseDateAsEST(weekRange.start),
      parseDateAsEST(weekRange.end)
    );

    console.log(weekEvents);

    let icsContent = "";

    // Loop through the filtered weekEvents array and create an ICS content for each event
    weekEvents.forEach((event, index) => {
      try {
        // Assuming you're using a library like `ics` or a custom ICS event creator
        const eventDetails = {
          start: [
            new Date(event.startDateTime).getFullYear(),
            new Date(event.startDateTime).getMonth() + 1,
            new Date(event.startDateTime).getDate(),
            new Date(event.startDateTime).getHours(),
            new Date(event.startDateTime).getMinutes(),
          ],
          end: [
            new Date(event.endDateTime).getFullYear(),
            new Date(event.endDateTime).getMonth() + 1,
            new Date(event.endDateTime).getDate(),
            new Date(event.endDateTime).getHours(),
            new Date(event.endDateTime).getMinutes(),
          ],
          title: event.title || "Untitled Event", // default to 'Untitled Event' if title is missing
          description: event.description || "No description available", // default description if missing
          location: event.location || "No location specified", // default location if missing
        };

        console.log(
          "Attempting to create ICS event with details:",
          eventDetails
        );

        // Your function to create ICS (e.g., from `ics` library)
        const { error, value } = ics.createEvent(eventDetails);

        if (error) {
          throw new Error(`ICS creation failed: ${error.message}`);
        }

        // Handle successful ICS event creation (e.g., downloading the file)
        console.log("ICS event created successfully:", value);

        // Example for downloading (if you're using this on the web):
        const blob = new Blob([value], {
          type: "text/calendar;charset=utf-8;",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${eventDetails.title}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error(
          "Error creating ICS event:",
          error.message || error,
          event
        );
        alert(
          `Error creating ICS event: ${
            error.message || "Unknown error"
          }. Please check the console for more details.`
        );
      }
    });

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
    <div className="outterContainer">
      <NavBar />
      <div className={`${CalendarCSS.content} container-fluid containerFluid`}>
        <div className={CalendarCSS.heroSection}>
          <div className={CalendarCSS.title}></div>

          <div className={CalendarCSS.buttonWrapper}>
            <button onClick={captureCalendarScreenshot} className="bg-red-500 text-white p-2 rounded-lg">
              Save Calendar as Image
            </button>
          </div>

          <div className={CalendarCSS.grid} ref={calendarRef}>
            <div className={CalendarCSS.weeklyEvents}>
              <div className={CalendarCSS.navigationButtons}>
                <button onClick={() => handleWeekChange(-1)}>
                  Previous Week
                </button>
                <button onClick={goToToday}>Today</button>
                <button onClick={() => handleWeekChange(1)}>Next Week</button>
              </div>
              <h2>
                Week of {weekRange.start} - {weekRange.end}
              </h2>
              <div className={CalendarCSS.week}>
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <div className={CalendarCSS.day} key={day}>
                    <h3>
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
                          <div className={CalendarCSS.eventContainer}>
                            <h4 className={CalendarCSS.eventTitle}>
                              {event.title}
                            </h4>
                            {event.image ? (
                                <img
                                  src={`${config.apiUrl}/proxy/image/${event._id}`}
                                  alt={event.title}
                                  className={CalendarCSS.eventImage}
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
          <hr className={CalendarCSS.hr} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CalendarPage;
