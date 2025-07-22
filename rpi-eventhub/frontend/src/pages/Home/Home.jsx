import React, { useContext, useEffect } from 'react';
import Footer from "../../components/Footer/Footer";
import ImageCarousel from "../../components/Carousel/Carousel";
import SearchBar from "../../components/SearchBar/SearchBar";
import Navbar from '../../components/Navbar/Navbar';
import { useColorScheme } from '../../hooks/useColorScheme';
import { ThemeContext } from '@emotion/react';





const Home = () => {
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme(); 

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className={`min-h-screen h-full max-w-screen flex flex-col ${isDark ? 'bg-[#383838] text-white' : 'bg-[#F4F1EA] text-black'}`} data-theme={theme}>
    <Navbar />
    <div className='flex flex-col lg:flex-row h-full w-full justify-between mt-16'>
      <div className='flex flex-col justify-between h-full w-full p-10 md:p-14 lg:p-16 space-y-12'>
          <div className="flex flex-col text-center md:text-left space-y-2">
            <div className="pl-10 pt-8 space-y-2 text-left">
              <h1 className="text-5xl md:text-6xl lg:text-[75px] font-bold font-Afacad text-[#AB2328] dark:text-white">
                All RPI Events,
              </h1>
              <h1 className="text-5xl md:text-6xl lg:text-[75px] font-bold font-Afacad text-[#AB2328] dark:text-white">
                in one place...
              </h1>
            </div>
        </div>
        <SearchBar />

        <div 
          className='flex justify-center items-center h-full w-full py-2 md:hidden'
          style={{ backgroundColor: '#AB2328', minHeight: '400px' }}
        >
          <ImageCarousel />
        </div>

        <div>
          <h2 className="text-4xl font-semibold font-Afacad">RPI EventHub</h2>
          <p className="text-lg md:text-2xl mt-3 font-Afacad">
            A comprehensive platform for RPI students and staff to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.
          </p>
        </div>

      </div>

      <div className='hidden md:flex justify-center items-center h-full w-full py-2'>
        <ImageCarousel />
      </div>
    </div>
    <Footer />
  </div>
  );
};

export default Home;