import React, { useEffect, useState } from 'react';
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CalendarCSS from './Calendar.module.css';
import ImageCarousel from "../../components/Carousel/Carousel";

const CalendarPage = () => {
  const [weekRange, setWeekRange] = useState({ start: '', end: '' });

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

  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

  return (
    <div>
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
                  <div className={CalendarCSS.day}>
                    <h3>Sunday</h3>
                    <p>No events</p>
                  </div>
                  <div className={CalendarCSS.day}>
                    <h3>Monday</h3>
                    <p>No events</p>
                  </div>
                  <div className={CalendarCSS.day}>
                    <h3>Tuesday</h3>
                    <p>No events</p>
                  </div>
                  <div className={CalendarCSS.day}>
                    <h3>Wednesday</h3>
                    <p>No events</p>
                  </div>
                  <div className={CalendarCSS.day}>
                    <h3>Thursday</h3>
                    <p>No events</p>
                  </div>
                  <div className={CalendarCSS.day}>
                    <h3>Friday</h3>
                    <p>No events</p>
                  </div>
                  <div className={CalendarCSS.day}>
                    <h3>Saturday</h3>
                    <p>No events</p>
                  </div>
                </div>
              </div>
            </div>
            <hr className="text-start" />
            <div className={`${CalendarCSS.carouselContainer} ${CalendarCSS.anim2} col-5`}>
              {/* <SearchBar /> */}
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
