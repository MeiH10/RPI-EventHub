import React, { useEffect, useState } from 'react';
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CalendarCSS from './Calendar.module.css';
import ImageCarousel from "../../components/Carousel/Carousel";
import axios from 'axios';
import config from '../../config';
const CalendarPage = () => {
  const [weekRange, setWeekRange] = useState({ start: '', end: '' });
  const [events, setEvents] = useState([]);
  const [image, setImage] = useState();

  useEffect(() => {
    const getWeekRange = () => {
      const today = new Date();
      const currentDay = today.getDay(); // gets the current day of the week (0-6, where 0 is Sunday)
      const firstDayOfWeek = new Date(today.setDate(today.getDate() - currentDay)); // first day of the current week (Sunday)
      const lastDayOfWeek = new Date(today.setDate(today.getDate() + 6)); // last day of the current week (Saturday)

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
      try {
        const response = await axios.get(`${config.apiUrl}/events`);
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();

    setImage('https://via.placeholder.com/300x450');

  }, []);

  const filterEventsByDay = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDay() === day;
    });
  };





  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

  return (
    <div className='outterContainer'>
      <NavBar />

      <div className={`${CalendarCSS.content} container-fluid containerFluid`}>
        {/* Hero section */}
        <div className="row">
          <div className="col-12 p-5">
            <div className={`${CalendarCSS.anim1} title`}>
              {/* Title or any other content */}
            </div>

            <div className={CalendarCSS.grid}>
              <div className={`${CalendarCSS.weeklyEvents} ${CalendarCSS.anim2}`}>
                <h2>Week of {weekRange.start} - {weekRange.end}</h2>
                <div className={CalendarCSS.week}>
                  {[0, 1, 2, 3, 4, 5, 6].map(day => (
                    <div className={CalendarCSS.day} key={day}>
                      <h3>{["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day]}</h3>
                      {filterEventsByDay(day).length > 0 ? (
                        filterEventsByDay(day).map(event => (
                          <div key={event._id} className={CalendarCSS.event}>
                            <h4>{event.title}</h4>
                            {event.image && <img src={event.image} alt={event.title} className={CalendarCSS.eventImage} />}
                          </div>
                        ))
                      ) : (
                        <p>No events</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <hr className="text-start" />
            <div className={`${CalendarCSS.carouselContainer} ${CalendarCSS.anim2} col-5`}>
              {/* <SearchBar /> */}
              {/* <ImageCarousel /> */}
              <svg width="500" height="800">
                <rect width="420" height="777" x="10" y="10"/>
                <text x="100" y="100" font-family="Verdana" font-size="35" fill="blue">Hello</text>
              </svg> 


              <diV>
                <img src={image} alt="" className={CalendarCSS.bigImage}/>
              </diV>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CalendarPage;
