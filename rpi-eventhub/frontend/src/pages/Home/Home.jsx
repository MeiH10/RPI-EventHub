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
    <div className={`min-h-screen h-full max-w-screen flex flex-col ${isDark ? 'bg-[#120451] text-white' : 'bg-gradient-to-r from-red-400 via-yellow-200 to-blue-400 text-black'}`} data-theme={theme}>
    <Navbar />
    <div className='flex flex-col lg:flex-row h-full w-full justify-between mt-16'>
      <div className='flex flex-col justify-between h-full w-full p-10 md:p-14 lg:p-16 space-y-12'>
          <div className="flex flex-col text-center md:text-left space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold">All RPI Events,</h1>
            <h1 className="text-4xl md:text-6xl font-bold">in One Place</h1>
        </div>
        <SearchBar />

        <div className='flex justify-center items-center h-full w-full py-2 md:hidden'>
          <ImageCarousel />
        </div>

        <div>
          <h1 className='text-4xl'>About the Website</h1>
          <h1 className='text-lg md:text-2xl mt-3'>A comprehensive platform for RPI students and staff to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.</h1>
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