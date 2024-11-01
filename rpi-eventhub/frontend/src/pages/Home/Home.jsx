import React, { useEffect } from 'react';
import Footer from "../../components/Footer/Footer";
import ImageCarousel from "../../components/Carousel/Carousel";
import SearchBar from "../../components/SearchBar/SearchBar";
import Navbar from '../../components/Navbar/Navbar';

const Home = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
   <div className='min-h-screen h-full max-w-screen flex flex-col'>
    <Navbar />
    <div className='flex flex-col md:flex-row h-full w-full justify-between mt-16'>
      <div className='flex flex-col justify-between h-full w-full p-16 space-y-12'>
        <div className='flex md:block'>
          <h1 id="red" className='text-4xl md:text-6xl'>All RPI events,</h1>
          <h1 className='text-4xl md:text-6xl ml-1 md:ml-0'>in one place.</h1>
        </div>
        <SearchBar />

        <div className='flex justify-center items-center h-full w-full py-4 md:hidden'>
          <ImageCarousel />
        </div>

        <div>
          <h1 className='text-4xl'>About the website</h1>
          <h1 className='text-2xl'>A comprehensive platform for RPI students and staff to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.</h1>
        </div>
      </div>

      <div className='hidden md:flex justify-center items-center h-full w-full py-4'>
        <ImageCarousel />
      </div>
    </div>
    <Footer />
  </div>
  );
};

export default Home;