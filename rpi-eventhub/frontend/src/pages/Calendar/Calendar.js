import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CalendarCSS from './Calendar.module.css';
import ImageCarousel from "../../components/Carousel/Carousel";

const CalendarPage = () => {
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
                <h2>WEEKLY EVENTS</h2>
                <div className={CalendarCSS.week}>
                  <div className={CalendarCSS.day}>
                    <h3>Sunday</h3>
                    <p>No events</p>
                  </div>
                  <div className={CalendarCSS.day}>
                    <h3>Mon</h3>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CalendarPage;
