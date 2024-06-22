import React from 'react';
import styles from './AboutUs.module.css'; // Import the CSS Module
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RPIBridgePhoto from '../../assets/RPIBridgePhoto.jpg';
import ProfilePicImage from '../../assets/ProfilePicImage.svg';

function AboutUs() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  return (
    <div className={styles.footerContainer}>
      <Navbar />
      <div className={`containerFluid container-fluid`}>
        <div className="row">
          <div className="col-7 p-5">
            <div className={`${styles.title} text-start ${styles.first}`}>
              <h1>About Us</h1>
              <h6>RPI EventHub</h6>
            </div>
            <div className={styles.grid}>
              <div className={`${styles.aboutUsText} ${styles.second}`}>
                <h4>Mission Statement</h4>
                EventHub is dedicated to connecting the students of RPI with events
                happening all over campus. Through this website, we hope to foster
                greater community, connection, and collaboration throughout the campus.
                Our hope is for RPI students and staff to be able to effortlessly create,
                advertise, and explore diverse campus events, fostering a vibrant and
                connected university community.
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
            <div className={styles.column}>
              <img src={ProfilePicImage} height="150" alt="Profile"></img>
              <h6 className={styles.devText}>Mei H - Project Lead</h6>
              <p className={styles.devText}>
                <a href="mailto:huangm10@rpi.edu" target="_blank" rel="noopener noreferrer">huangm10@rpi.edu</a>
              </p>
            </div>
            <div className={styles.column}>
              <img src={ProfilePicImage} height="150" alt="Profile"></img>
              <h6 className={styles.devText}>William F</h6>
              <p className={styles.devText}>
                <a href="mailto:fernaw@rpi.edu" target="_blank" rel="noopener noreferrer">fernaw@rpi.edu</a>
              </p>
            </div>
            <div className={styles.column}>
              <img src={ProfilePicImage} height="150" alt="Profile"></img>
              <h6 className={styles.devText}>Nithin V</h6>
              <p className={styles.devText}>
                <a href="mailto:vadakn@rpi.edu" target="_blank" rel="noopener noreferrer">vadakn@rpi.edu</a>
              </p>
            </div>
            <div className={styles.column}>
              <img src={ProfilePicImage} height="150" alt="Profile"></img>
              <h6 className={styles.devText}>Jordyn Y</h6>
              <p className={styles.devText}>
                <a href="mailto:youngj22@rpi.edu" target="_blank" rel="noopener noreferrer">youngj22@rpi.edu</a>
              </p>
            </div>
            <div className={styles.column}>
              <img src={ProfilePicImage} height="150" alt="Profile"></img>
              <h6 className={styles.devText}>Henry T</h6>
              <p className={styles.devText}>
                <a href="mailto:thealh@rpi.edu" target="_blank" rel="noopener noreferrer">thealh@rpi.edu</a>
              </p>
            </div>
            <div className={styles.column}>
              <img src={ProfilePicImage} height="150" alt="Profile"></img>
              <h6 className={styles.devText}>Hari K</h6>
              <p className={styles.devText}>
                <a href="mailto:kimh21@rpi.edu" target="_blank" rel="noopener noreferrer">kimh21@rpi.edu</a>
              </p>
            </div>
            <div className={styles.column}>
              <img src={ProfilePicImage} height="150" alt="Profile"></img>
              <h6 className={styles.devText}>Felix T</h6>
              <p className={styles.devText}>
                <a href="mailto:tianf2@rpi.edu" target="_blank" rel="noopener noreferrer">tianf2@rpi.edu</a>
              </p>
            </div>
          </div>
        </div>
        <hr className={styles.hr} />
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;
