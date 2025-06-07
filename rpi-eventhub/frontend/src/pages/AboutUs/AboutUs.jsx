import React, { useEffect, useState ,useContext} from 'react';
import styles from './AboutUs.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RPIBridgePhoto from '../../assets/RPIBridgePhoto.jpg';
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
    <div className={`outterContainer ${isDark ? 'text-white bg-[#120451]' : 'text-black bg-gradient-to-r from-red-400 via-yellow-200 to-blue-400'}`} data-theme={theme}>
      <Navbar />
      <div className="container-fluid containerFluid">
        
        <div className="row bg-white">
          <div className={`col-12 col-lg-7 px-5 ${styles.missionContainer}`}>
            <h1 className="text-[75px] font-bold text-[darkred] pl-[25px] pb-[25px] font-sans">
              About us...
            </h1>
            <div className="text-left text-[30px] pl-[75px] w-[100%]">
              <h4 className="font-sans text-[30px] underline underline-offset-[10px] font-bold pb-[10px]">
                Mission Statement
              </h4>
              <div className={styles.missionText}>
                EventHub is dedicated to connecting the students of RPI with events happening all over campus. Through this website, we hope to foster greater community, connection, and collaboration throughout the campus. Our hope is for RPI students and staff to be able to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-5 p-5 d-flex justify-content-center align-items-center">
            <img src={RPIBridgePhoto} className="mt-[30px] w-[80%] h-auto rounded-[10px]" alt="RPI Bridge" />
          </div>
        </div>

        <div className="row bg-white pb-[20px]">
          <div className={`col-12 col-lg-7 px-5 ${styles.missionContainer}`}>
            <div className="text-left text-[30px] pl-[75px] w-[90%]">
              <h4 className="font-sans font-bold text-[30px] underline decoration-black underline-offset-[10px] pb-[10px]">
                Feedback!
              </h4>
              <div>
                We appreciate any feedback on your experience with our site. Please take a minute to fill out our&nbsp;
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSclGZl30lj1o3Etb6q9oU8Q9G8zHrTUk4HC7LLNJhZfYxFiFQ/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" className={styles.link}>feedback form</a>.
                <br />
                If you find any bugs or have suggestions, please submit an issue on our GitHub repository:&nbsp;
                <a href="https://github.com/MeiH10/RPI-EventHub/issues" target="_blank" rel="noopener noreferrer" className={styles.link}>Report a GitHub Issue</a>.
                <br /><br />
                We'd like to extend a special thanks to Corbin, <a href="https://github.com/Nibroc6" target="_blank" rel="noopener noreferrer" className={styles.link}>Nibroc6</a>, for sharing his database and providing some of the events displayed on our website.
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-5 p-5 d-flex justify-content-center align-items-center">
            <img src={RPIBridgePhoto} className="mt-[30px] w-[80%] h-auto rounded-[10px]" alt="RPI Bridge" />
          </div>
        </div>

        <hr className="m-0 w-full border-0 border-t border-t-white border-b border-b-[#2d0505]" />
        <div className="text-center mt-10 text-[24px]">
          <h4 className={styles.title}>Developers</h4>
          <div className="flex flex-wrap justify-around flex-col md:flex-row">
            {isLoading ? (
              Array.from(new Array(5)).map((_, index) => (
                <div className="w-1/3 flex flex-col items-center p-5 m-auto" key={index}>
                  <Skeleton variant="circular" width={150} height={150} />
                  <Skeleton variant="text" width={150} />
                </div>
              ))
            ) : (
              contributors.map(contributor => (
                <div className="w-1/3 flex flex-col items-center p-5 m-auto" key={contributor.login}>
                  <img src={contributor.avatar_url} className={styles.profilePic} alt="Profile" />
                  <h6 className={styles.devText}>{contributor.login}</h6>
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
