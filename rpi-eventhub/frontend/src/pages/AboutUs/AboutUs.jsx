import React, { useEffect, useState ,useContext} from 'react';
import styles from './AboutUs.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import group1 from '../../assets/group1.jpg';
import group2 from '../../assets/group2.jpg';
import { Skeleton } from '@mui/material';
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';


function AboutUs() {
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();
  const [isSmall, setIsSmall] = useState(typeof window !== 'undefined' ? window.innerWidth <= 1750 : false);
  useEffect(() => {
      const onResize = () => setIsSmall(window.innerWidth <= 1750);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
  }, []);
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    
    async function fetchContributors() {
      try {
        const response = await fetch('https://api.github.com/repos/MeiH10/RPI-EventHub/contributors');
        const data = await response.json();
        setContributors(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching contributors:', error);
      }
    }

    fetchContributors();
  }, []);

  return (
    <div className={`outterContainer ${isDark ? 'text-white bg-[#383838]' : '#F4F1EA'}`} data-theme={theme}>
      <Navbar />
      <div className="container-fluid containerFluid">

        <h1 className={`col-12 col-lg-7 text-[75px] font-bold pl-[50px] pt-[30px] font-afacad tracking-wide ${isDark ? 'text-white' : 'text-[#AB2328]'}`}>
              About us...
        </h1>
        
        <div className="row flex items-stretch">
          <div className="col-12 col-lg-7 mt-[50px] p-0 flex flex-col justify-start">
            <div className={`text-left text-[30px] ${isSmall ? 'pl-[40px] w-[95%]' : 'pl-[125px] w-[80%]'} pt-[20px] tracking-wide`}>
              <h4 className={`font-afacad text-[32px] underline underline-offset-[10px] decoration-[1px] font-semibold pb-[10px] ${isDark ? 'decoration-[#AB2328]' : 'decoration-black'}`}>
                Mission Statement
              </h4>
              <div className="text-[25px] font-afacad">
                EventHub is dedicated to connecting the students of RPI with events happening all over campus. Through this website, we hope to foster greater community, connection, and collaboration throughout the campus. Our hope is for RPI students and staff to be able to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-5 flex justify-start items-end h-full relative">
            <img
              src={group1}
              alt="RPI Bridge"
              className={`
                h-[375px] w-auto object-contain z-10
                mt-[25px]
                mx-auto
                ${isSmall ? '' : 'lg:absolute lg:bottom-[-300px] lg:left-[-50px]'}
              `}
            />
          </div>
        </div>


        <div className="row flex items-stretch">
          <div className="col-12 col-lg-7 mt-[50px] p-0 flex-col justify-start">
            <div className={`text-left text-[30px] ${isSmall ? 'pl-[40px] w-[95%]' : 'pl-[125px] w-[100%]'} pt-[20px] tracking-wide`}>
              <h4 className={`font-afacad font-semibold text-[32px] underline underline-offset-[10px] decoration-[1px] pb-[10px] ${isDark ? 'decoration-[#AB2328]' : 'decoration-black'}`}>
                Feedback!
              </h4>
              <div className='text-[25px] font-afacad'>
                We appreciate any feedback on your experience with our site. Please take a minute to fill out our&nbsp;
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSclGZl30lj1o3Etb6q9oU8Q9G8zHrTUk4HC7LLNJhZfYxFiFQ/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" className="underline">feedback form</a>.
                <br />
                If you find any bugs or have suggestions, please submit an issue on our GitHub repository:&nbsp;
                <a href="https://github.com/MeiH10/RPI-EventHub/issues" target="_blank" rel="noopener noreferrer" className="underline">Report a GitHub Issue</a>.
                <br /><br />
                We'd like to extend a special thanks to Corbin, <a href="https://github.com/Nibroc6" target="_blank" rel="noopener noreferrer" className="underline">Nibroc6</a>, for sharing his database and providing some of the events displayed on our website.
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-5 flex justify-start items-end h-full relative">
            <img 
            src={group2} 
            className={`
                h-[375px] w-auto object-contain z-0
                mt-[25px]
                mx-auto
                ${isSmall ? '' : 'lg:absolute lg:bottom-[-320px] lg:left-[200px]'}
              `}
            alt="RPI Bridge" />
          </div>
        </div>
      
        <div className="mt-10 h-[3.5px] w-[94%] mx-auto bg-[repeating-linear-gradient(to_right,_#ab2328_0px,_#ab2328_50px,_transparent_10px,_transparent_60px)]"></div>

        <hr className="m-0 w-full border-0 border-t border-t-white border-b border-b-[#2d0505]" />
        <div className="text-center mt-10 text-[24px]">
          <h4 className="font-bold text-[35px] font-afacad tracking-wide">Our Developers</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full md:w-[90%] mx-auto justify-items-center">
            {isLoading ? (
              Array.from(new Array(8)).map((_, index) => (
                <div className="w-full flex flex-col items-center p-3" key={index}>
                  <Skeleton variant="circular" width={80} height={80} />
                  <Skeleton variant="text" width={80} />
                </div>
              ))
            ) : (
              contributors.map(contributor => (
                <div className="w-full flex flex-col items-center p-3" key={contributor.login}>
                  <div className="w-36 h-36 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                    <img
                      src={contributor.avatar_url}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  </div>
                  <h6 className="mt-[8px] text-sm md:text-base">{contributor.login}</h6>
                </div>
              ))
            )}
          </div>
        </div>
        <hr className="m-0 w-full border-0 border-t border-t-white border-b border-b-[#2d0505]" />
        
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;
