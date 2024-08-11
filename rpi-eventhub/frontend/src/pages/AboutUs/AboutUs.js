import React, { useEffect, useState } from 'react';
import styles from './AboutUs.module.css'; // Import the CSS Module
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RPIBridgePhoto from '../../assets/RPIBridgePhoto.jpg';
import { Skeleton } from '@mui/material';

function AboutUs() {
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className='outterContainer'>
      <Navbar />
      <div className="containerFluid container-fluid">
        <div className="row">
          <div className="col-7 p-5">
            <div className={styles.grid}>
              <div className={`${styles.aboutUsText} ${styles.second}`}>
                <h4 className={styles.boldTitle}>Mission Statement</h4>
                <div className={styles.missionText}>
                  EventHub is dedicated to connecting the students of RPI with events happening all over campus. Through this website, we hope to foster greater community, connection, and collaboration throughout the campus. Our hope is for RPI students and staff to be able to effortlessly create, advertise, and explore diverse campus events, fostering a vibrant and connected university community.
                </div>
              </div>
            </div>
            <div className={`${styles.feedbackSection} ${styles.second}`}>
              <h4 className={styles.feedbackTitle}>Feedback!</h4>
              <div>
                We appreciate any feedback on your experience with our site. Please take a minute to fill out our 
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSclGZl30lj1o3Etb6q9oU8Q9G8zHrTUk4HC7LLNJhZfYxFiFQ/viewform?usp=sf_link" target="_blank" rel="noopener noreferrer" className={styles.link}> feedback form</a>.
                <br />
                If you find any bugs or have suggestions, please submit an issue on our GitHub repository:
                <a href="https://github.com/MeiH10/RPI-EventHub/issues" target="_blank" rel="noopener noreferrer" className={styles.link}> Report a GitHub Issue</a>.
              </div>
            </div>
          </div>
          <div className={`${styles.anim} col-5 p-5 ${styles.second}`}>
            <img src={RPIBridgePhoto} id="bridge" alt="bridge" width="480"></img>
          </div>
        </div>
        <hr className={styles.hr} />
        <div className={styles.developers}>
          <h4 className={styles.title}>Developers</h4>
          <div className="row">
            {isLoading ? (
              Array.from(new Array(5)).map((_, index) => (
                <div className={`col-4 ${styles.column}`} key={index}>
                  <Skeleton variant="circular" width={150} height={150} />
                  <Skeleton variant="text" width={150} />
                </div>
              ))
            ) : (
              contributors.map(contributor => (
                <div className={`col-4 ${styles.column}`} key={contributor.login}>
                  <img src={contributor.avatar_url} className={styles.profilePic} alt="Profile" />
                  <h6 className={styles.devText}>{contributor.login}</h6>
                </div>
              ))
            )}
          </div>
        </div>
        <hr className={styles.hr} />
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;
