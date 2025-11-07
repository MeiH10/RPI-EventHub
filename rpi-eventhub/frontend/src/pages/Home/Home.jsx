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
        <div className="flex flex-col items-start justify-center w-[120%] pl-20 ">
          <div className="flex flex-col text-left pb-24">
              <h1 className="text-[550%] font-bold font-Afacad text-[#AB2328] dark:text-white tracking-wider">
                All RPI Events,
              </h1>
              <h1 className="text-[550%] font-bold font-Afacad text-[#AB2328] dark:text-white tracking-wider">
                in one place...
              </h1>
          </div>

          <SearchBar align="left" className="w-[75%] !max-w-none" />

          <div className="text-left w-[95%] pt-24">
            <h2 className="text-[350%] font-semibold font-Afacad">RPI EventHub</h2>
            <p className="text-[200%] font-Afacad tracking-wider">
              A comprehensive platform for RPI students and staff to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.
            </p>
          </div>
        </div>

        <ImageCarousel />
      </div>


      {/* Mobile view */}
      <div className="mt-[70px] flex flex-col gap-10 lg:hidden">
        <section className="px-5  pt-6  flex flex-col items-center">
          <div className="flex flex-col pb-6 text-center font-Afacad">
            <h1 align = "center" className="text-[300%] text-[#AB2328] dark:text-white font-bold pb-6">
              RPI Eventhub
            </h1>
            <h1 className="font-bold font-Afacad text-[#AB2328] dark:text-white tracking-wider text-4xl">
              All RPI Events,
            </h1>
            <h1 className="font-bold font-Afacad text-[#AB2328] dark:text-white tracking-wider text-4xl">
              in one place...
            </h1>
          </div>

          <SearchBar align="center" />
        </section>

        <section className="w-full">
          <ImageCarousel />
        </section>

        <section className="px-4 flex w-full justify-center">
          <div className="w-full max-w-[760px] text-center font-Afacad">
            <h2 className="font-bold font-Afacad text-[200%] mt-[-10px] mb-4 text-[#AB2328] dark:text-white">About the website...</h2>
            <p className="font-Afacad tracking-wider text-lg">
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