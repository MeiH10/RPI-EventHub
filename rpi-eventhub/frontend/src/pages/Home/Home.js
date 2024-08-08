import React, { useContext, useEffect } from 'react';
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HomeCSS from './Home.module.css';
import ImageCarousel from "../../components/Carousel/Carousel";
import SearchBar from "../../components/SearchBar/SearchBar";
import { ThemeContext } from '../../context/ThemeContext';

const Home = () => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="outterContainer" data-theme={theme}>
      <NavBar />
      <div className={`${HomeCSS.content} container-fluid containerFluid`}>
        {/* Hero section */}
        <div className="row">
          <div className="col-7 p-5">
            <div className={`${HomeCSS.anim1} title`}>
              <h1 id="red">All RPI events,</h1>
              <h1>in one place.</h1>
            </div>
            <div className={HomeCSS.grid}>
              <div className={`${HomeCSS.searchBarWrapper} ${HomeCSS.anim2}`}>
                <SearchBar />
              </div>
              <div className={`${HomeCSS.anim1} card text-start bg-transparent border-0 p-0`}>
                <div className="card-body p-0">
                  <h5 className={`${HomeCSS.cardtext}`}>About the website</h5>
                  <p className={`${HomeCSS.cardtext}`}>A comprehensive platform for RPI students and staff to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.</p>
                </div>
              </div>
            </div>
            <hr className="text-start" />
          </div>
          <div className={`${HomeCSS.carouselContainer} ${HomeCSS.anim2} col-5`}>
            <ImageCarousel />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
