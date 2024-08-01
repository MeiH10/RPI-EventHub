// Calendar.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CalendarCSS from './Calendar.module.css';
import ImageCarousel from "../../components/Carousel/Carousel";
import axios from 'axios';

const CalendarPage = () => {
  const [weekRange, setWeekRange] = useState({ start: '', end: '' });
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const getWeekRange = () => {
      const today = new Date();
      const currentDay = today.getDay();
      const firstDayOfWeek = new Date(today.setDate(today.getDate() - currentDay));
      const lastDayOfWeek = new Date(today.setDate(today.getDate() + 6));

      const formatDate = (date) => {
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        return `${mm}/${dd}/${yy}`;
      };

      setWeekRange({
        start: formatDate(firstDayOfWeek),
        end: formatDate(lastDayOfWeek)
      });
    };

    getWeekRange();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      if (weekRange.start && weekRange.end) {
        try {
          const response = await axios.get('http://localhost:5000/events', {
            params: { start: weekRange.start, end: weekRange.end }
          });
          setEvents(response.data);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      }
    };

    fetchEvents();
  }, [weekRange]);

  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

  const getEventsForDay = (day) => {
    const date = new Date(day);
    return events.filter(event => new Date(event.date).toDateString() === date.toDateString());
  };

  const handleImageClick = (eventId) => {
    navigate(`/events/${eventId}`); // Redirect to event details page
  };

  const renderDay = (day, dayName) => {
    const eventsForDay = getEventsForDay(day);
    console.log(`Rendering ${dayName}:`, eventsForDay); // For debugging

    return (
      <div className={CalendarCSS.day}>
        <h3>{dayName}</h3>
        {eventsForDay.length > 0 ? (
          eventsForDay.map(event => (
            <div key={event._id} className={CalendarCSS.event}>
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className={CalendarCSS.eventImage}
                  onClick={() => handleImageClick(event._id)} // Handle image click
                  style={{ cursor: 'pointer' }} // Indicate that the image is clickable
                />
              )}
              <p>{event.title}</p>
            </div>
          ))
        ) : (
          <p>No events</p>
        )}
      </div>
    );
  };

  return (
    <div className='outterContainer'>
      <NavBar />
      <div className={`${CalendarCSS.content} container-fluid containerFluid`}>
        <div className="row">
          <div className="col-12 p-5">
            <div className={`${CalendarCSS.anim1} title`}></div>
            <div className={CalendarCSS.grid}>
              <div className={`${CalendarCSS.weeklyEvents} ${CalendarCSS.anim2}`}>
                <h2>Week of {weekRange.start} - {weekRange.end}</h2>
                <div className={CalendarCSS.week}>
                  {renderDay(new Date(weekRange.start), 'Sunday')}
                  {renderDay(new Date(new Date(weekRange.start).setDate(new Date(weekRange.start).getDate() + 1)), 'Monday')}
                  {renderDay(new Date(new Date(weekRange.start).setDate(new Date(weekRange.start).getDate() + 2)), 'Tuesday')}
                  {renderDay(new Date(new Date(weekRange.start).setDate(new Date(weekRange.start).getDate() + 3)), 'Wednesday')}
                  {renderDay(new Date(new Date(weekRange.start).setDate(new Date(weekRange.start).getDate() + 4)), 'Thursday')}
                  {renderDay(new Date(new Date(weekRange.start).setDate(new Date(weekRange.start).getDate() + 5)), 'Friday')}
                  {renderDay(new Date(new Date(weekRange.start).setDate(new Date(weekRange.start).getDate() + 6)), 'Saturday')}
                </div>
              </div>
            </div>
            <hr className="text-start" />
            <div className={`${CalendarCSS.carouselContainer} ${CalendarCSS.anim2} col-5`}>
              <ImageCarousel />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CalendarPage;
