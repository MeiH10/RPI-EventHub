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
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      className={`min-h-screen h-full max-w-screen flex flex-col ${isDark ? 'bg-[#383838] text-white' : 'bg-[#F4F1EA] text-black'}`}
      data-theme={theme}
    >
      <Navbar />

      <div className="flex flex-col lg:flex-row items-center w-full justify-between gap-10 mt-[70px] min-h-[calc(100vh-110px)]">
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

      <Footer />
    </div>
  );
};
export default Home;