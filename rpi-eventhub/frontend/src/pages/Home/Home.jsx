import React, { useContext, useEffect } from 'react';
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HomeCSS from './Home.module.css';
import ImageCarousel from "../../components/Carousel/Carousel";
import SearchBar from "../../components/SearchBar/SearchBar";
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme'; 
import Navbar from '../../components/Navbar/Navbar';

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme(); 

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

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
    // <div className={`flex flex-col min-h-screen`} style={pageStyles} data-theme={theme}>
    //   <NavBar />
    //   <div className={`${HomeCSS.content} container-fluid containerFluid`}>
    //     <div className="row">
    //       <div className={`col-12 col-lg-7 py-sm-2 py-md-5 px-sm-0 px-md-5 text-start sm:text-center`}>
    //         <div className={`${HomeCSS.anim1} title`}>
    //           <h1 id="red">All RPI events,</h1>
    //           <h1>in one place.</h1>
    //         </div>
    //         <div className={HomeCSS.grid}>
    //           <div className={`${HomeCSS.searchBarWrapper} ${HomeCSS.anim2}`}>
    //               <SearchBar />
    //           </div>
    //           <div className={`d-block d-lg-none ${HomeCSS.carouselContainer} ${HomeCSS.anim2}`}>
    //             <ImageCarousel />
    //           </div>
    //           <div className={`${HomeCSS.anim1} card text-start bg-transparent border-0 p-0`}>
    //             <div className={`${HomeCSS.about} card-body p-0`}>
    //               <h5 className={`${HomeCSS.cardtext}`}>About the website</h5>
    //               <p className={`${HomeCSS.cardtext}`}>A comprehensive platform for RPI students and staff to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.</p>
    //             </div>
    //           </div>
    //         </div>
    //         <hr className="text-start" />
    //       </div>
    //       <div className={`d-none d-lg-block col-lg-5 ${HomeCSS.carouselContainer} ${HomeCSS.anim2}`}>
    //         <ImageCarousel />
    //       </div>
    //     </div>
    //   </div>
    //   <Footer />
    // </div>
    <div className='min-h-screen max-w-screen flex'>
      <Navbar />
      <div className='flex flex-row h-full w-full justify-between mt-16 bg-blue-500'>
        <div className='flex flex-col justify-between h-full w-full p-16 bg-red-300'>
          <div>
            <h1 id="red" className='text-6xl'>All RPI events,</h1>
            <h1 className='text-6xl'>in one place.</h1>
          </div>s
          <SearchBar />
          <div>
            <h1 className='text-4xl'>About the website</h1>
            <h1 className='text-2xl'>A comprehensive platform for RPI students and staff to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.</h1>
          </div>
        </div>
        <div className='flex justify-center items-center h-full w-full bg-green-400'>
          <ImageCarousel />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Home;