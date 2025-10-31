import React, { useContext, useEffect } from 'react';
import Footer from "../../components/Footer/Footer";
import ImageCarousel from "../../components/Carousel/Carousel";
import SearchBar from "../../components/SearchBar/SearchBar";
import Navbar from '../../components/Navbar/Navbar';
import { useColorScheme } from '../../hooks/useColorScheme';
import { ThemeContext } from '../../context/ThemeContext';

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      className={`min-h-screen h-full max-w-screen flex flex-col ${isDark ? 'bg-[#383838] text-white' : 'bg-[#F4F1EA] text-black'}`}
      data-theme={theme}
    >
      <Navbar />


      <div className="hidden lg:flex flex-row items-center w-full justify-between gap-10 mt-[70px] lg:min-h-[calc(100vh-110px)]">
        <div className="flex flex-col items-start justify-center w-[120%] pl-10 ">
          <div className="flex flex-col text-left pb-24">
              <h1 className="text-[550%] font-bold font-Afacad text-[#AB2328] dark:text-white tracking-wider">
                All RPI Events,
              </h1>
              <h1 className="text-[550%] font-bold font-Afacad text-[#AB2328] dark:text-white tracking-wider">
                in one place...
              </h1>
          </div>

          <SearchBar align="left" />

          <div className="text-left w-[100%] pt-24">
            <h2 className="text-[350%] font-semibold font-Afacad">RPI EventHub</h2>
            <p className="text-[200%] font-Afacad tracking-wider">
              A comprehensive platform for RPI students and staff to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.
            </p>
          </div>
        </div>

        <ImageCarousel />
      </div>



      <div className="mt-[70px] flex flex-col gap-10 lg:gap-16 lg:hidden">
        {/* Hero copy + search (mobile-centered, desktop-left) */}
        <section className="px-5 lg:pl-10 pt-6 lg:pt-12 flex flex-col items-center lg:items-start">
          <div className="flex flex-col pb-10 lg:pb-24 text-center lg:text-left">
            <h1 className="font-bold font-Afacad text-[#AB2328] dark:text-white tracking-wider text-4xl sm:text-5xl md:text-6xl lg:text-[550%]">
              All RPI Events,
            </h1>
            <h1 className="font-bold font-Afacad text-[#AB2328] dark:text-white tracking-wider text-4xl sm:text-5xl md:text-6xl lg:text-[550%]">
              in one place...
            </h1>
          </div>

          {/* Center on mobile, left on desktop */}
          <SearchBar align="center" className="lg:self-start w-full max-w-[600px] md:max-w-[700px] lg:max-w-[800px]" />
        </section>

        {/* Carousel section (edge-to-edge red background handled inside component) */}
        <section className="w-full">
          <ImageCarousel />
        </section>

        {/* About section */}
        <section className="px-5 py-10 flex w-full justify-center">
          <div className="w-full max-w-[760px] text-center">
            <h2 className="font-semibold font-Afacad text-2xl sm:text-3xl md:text-[350%] mb-4">About the website...</h2>
            <p className="font-Afacad tracking-wider text-lg sm:text-xl md:text-[200%]">
              A comprehensive platform for RPI students and staff to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.
            </p>
          </div>
        </section>
      </div>


      <Footer />
    </div>
  );
};
export default Home;