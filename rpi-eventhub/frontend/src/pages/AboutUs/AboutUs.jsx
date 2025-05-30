import React, { useEffect, useState ,useContext} from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RPIBridgePhoto from '../../assets/RPIBridgePhoto.jpg';
import RPIEVENTHUB_IMG from '../../assets/RPIEVENTHUB_IMG.jpg';
import RPIEVENTHUB_IMG2_ZOOMED from '../../assets/RPI-EVENTHUB_IMG2_ZOOMED.jpg';
import RPIEVENTHUB_IMG3 from '../../assets/RPIEVENTHUB_IMG3.jpg';
import { Skeleton } from '@mui/material';
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';
function AboutUs() {
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();
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
    <div className={`min-h-screen flex flex-col font-[afacad] ${isDark ? 'bg-[#120451] text-white' : 'bg-[#F4F1EA]'}`}>
      <Navbar />
      <div className="pt-20 px-5">
        <h1 className={`mt-3 font-bold text-6xl ${isDark ? 'text-white' : 'text-[#AB2328]'}`}> About us... </h1>
        <div className="relative mt-10 flex flex-col md:flex-row items-start md:items-stretch gap-2">
          <div className="flex-1 px-5 sm:text-center md:text-left md:justify-left md:max-w-[80vw]">
            <h4 className={`font-bold text-3xl underline underline-offset-4 ${isDark ? 'text-white' : 'text-[#252525]'}`}>Mission Statement</h4>
            <div className={`text-xl/8 mb-[10px] ${isDark ? 'text-white' : 'text-[#252525]'} md:max-w-[75%] mr-auto`}>
              EventHub is dedicated to connecting the students of RPI with events happening all over campus. Through this website, we hope to foster greater community, connection, and collaboration throughout the campus. Our hope is for RPI students and staff to be able to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.
            </div>
          </div>
          <div className="absolute hidden md:block bottom-8 right-0 w-full max-w-[28vw] max-h-[22vh] flex-1 mx-auto">
            <img 
              src={RPIEVENTHUB_IMG} 
              alt="RPI Bridge" 
              className="object-cover rounded-md"
            />
          </div>
          <div className="md:hidden w-full h-full flex-1 mx-auto">
            <img 
              src={RPIBridgePhoto} 
              alt="RPI Bridge" 
              className="object-cover rounded-md"
            />
          </div>
        </div>
        <div className="relative md:mt-20 md:mb-[80px] flex flex-col md:flex-row px-5 py-2 gap-x-2">
          <div className="flex-auto px-0">
            <h4 className={`font-bold text-3xl underline underline-offset-4 ${isDark ? 'text-white' : 'text-[#252525]'} md:text-left`}>Feedback    </h4>
            <div className={`text-xl/8 mb-[30px] max-w-[100vw] md:max-w-[60vw] ${isDark ? 'text-white' : 'text-[#252525]'} md:max-w-[75%] mr-auto md:text-left`}>
              We appreciate any feedback on your experience with our site. Please take a minute to fill out our
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSclGZl30lj1o3Etb6q9oU8Q9G8zHrTUk4HC7LLNJhZfYxFiFQ/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" className={`underline ${isDark ? 'hover:text-green-500' : 'hover:text-blue-500'}`}> feedback form</a>.
              <br /><br />
              If you find any bugs or have suggestions, please submit an issue on our GitHub repository: 
              <a href="https://github.com/MeiH10/RPI-EventHub/issues" target="_blank" rel="noopener noreferrer" className={`underline ${isDark ? 'hover:text-green-500' : 'hover:text-blue-500'}`}> Report a GitHub Issue</a>.
              <br /><br />
              We'd like to extend a special thanks to Corbin, <a href="https://github.com/Nibroc6" target="_blank" rel="noopener noreferrer" className={`underline ${isDark ? 'hover:text-green-500' : 'hover:text-blue-500'}`}> Nibroc6</a>, for sharing his database and providing some of the events displayed on our website.
            </div>
          </div>
          <div className="absolute hidden bottom-13 right-0 md:block w-full max-w-[22vw] max-h-[22vh]">
              <img 
                src={RPIEVENTHUB_IMG3} 
                alt="RPI Bridge" 
                className="object-cover rounded-md"
              />
            </div>
            <div className="md:hidden mx-auto">
              <img 
                src={RPIEVENTHUB_IMG2_ZOOMED} 
                alt="RPI Bridge" 
                className="object-cover rounded-md"
              />
            </div>
        </div>
        <hr className='center w-[80vw] md:w-[95vw] my-10 border-t-2' />
        <div className='mt-[50px]'>
          <h4 className={`text-center font-bold text-3xl underline underline-offset-4 ${isDark ? 'text-white' : 'text-[#252525]'}`}>Our Developers</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 justify-items-center p-5">
            {isLoading ? (
              Array.from({length: 5}).map((_, index) => (
                <div  className='w-40' key={index}>
                  <Skeleton variant="circular" width={150} height={150} />
                  <Skeleton variant="text" width={150} /> 
                </div>
              ))
            ) : (
              contributors.map((contributor) => (
                <div className="flex flex-col items-center w-13 h-13 md:w-60 md:h-60 " key={contributor.login}>
                  <img src={contributor.avatar_url} className={`rounded-full object-cover w-[125px] h-[125px] md:w-[250px] md:h-[250px] ${isDark ? 'border-[2px] border-white' : 'border-[1px] border-black'} border-opacity-100`} alt="Profile" />
                  <h6 className="text-xl mt-2">{contributor.login}</h6>
                </div>
              ))
            )}
          </div>
        </div>
        <hr className='center w-[80vw] md:w-[95vw] my-10 border-t-2' />
      </div>
      <Footer />
    </div>
  );
}
export default AboutUs;

