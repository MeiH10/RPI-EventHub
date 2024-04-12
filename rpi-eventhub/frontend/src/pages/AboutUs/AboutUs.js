import React from 'react'
import AbousUsCSS from './AboutUs.modular.css' // Import modular CSS for scoped styling
import Navbar from '../../components/Navbar/Navbar' // Navbar component for consistent navigation
import Footer from '../../components/Footer/Footer' // Footer component for the bottom of the page
import EventHubLogo from "../../assets/EventHubLogo1.svg"; // EventHub logo for branding
import RPIseal from '../../assets/RF0010-04 Small Seal-RGB-White.svg'; // RPI seal image, not used in this component but imported
import RPIBridgePhoto from '../../assets/RPIBridgePhoto.jpg' // RPI bridge photo for visual appeal
import ProfilePicImage from '../../assets/ProfilePicImage.svg' // Placeholder profile picture for developer profiles

// AboutUs functional component definition
function AboutUs() {
    return (
        <div>
          <Navbar /> {/* Embedding the Navbar component at the top */}
    
          <div className="container-fluid content"> {/* Full-width container for content */}
            
            <div className="row"> {/* Row for layout */}
              <div className="col-7 p-5"> {/* Column taking up 7 parts of the grid with padding */}
    
                <div className="title text-start first"> {/* Title container with text alignment to start */}
                  <h1>About Us</h1> {/* Main heading for the page */}
                  <h6>RPI EventHub</h6> {/* Subtitle with the name of the platform */}
                </div>
    
                <div className="grid"> {/* Grid layout for the mission statement section */}
                    <div className="about-us-text second"> {/* Container for the about us text */}
                        <h4>Mission Statement</h4> {/* Mission statement heading */}
                        {/* Paragraph containing the mission statement of EventHub */}
                        EventHub is dedicated to connecting the students of RPI with events
                        happening all over campus. Through this website, we hope to foster
                        greater community, connection, and collaboration throughout the campus.
                        Our hope is for RPI students and staff to be able to effortlessly create,
                        advertise, and explore diverse campus events, fostering a vibrant and
                        connected university community.
                    </div>                    
                </div>
              </div>
    
              <div className="col-5 p-5 second"> {/* Column taking up 5 parts of the grid with padding */}
                <img src={RPIBridgePhoto} alt="RPI Bridge" width="480" /> {/* Image of RPI Bridge with specified width */}
              </div>
            </div>
    
            <hr /> {/* Horizontal rule for a visual break between sections */}
    
            <div className="developers third"> {/* Container for the developers section */}
                <h4>Developers</h4> {/* Heading for the developers list */}
                <div className="row"> {/* Row to hold developer profiles */}
                  {/* Multiple columns for each developer profile */}
                  {/* Each column includes a profile picture, name, and contact email */}
                  <div className="column">
                    <img src={ProfilePicImage} height="150"></img>
                    <h6 className="devtext">Mei H - Project Lead</h6>
                    <p className="devtext">
                      <a href="mailto:huangm10@rpi.edu" target="_blank">huangm10@rpi.edu</a>
                    </p>
                  </div>

                  <div className="column">
                    <img src={ProfilePicImage} height="150"></img>
                    <h6 className="devtext">William F</h6>
                    <p className="devtext">
                      <a href="mailto:fernaw@rpi.edu" target="_blank">fernaw@rpi.edu</a>
                    </p>
                  </div>

                  <div className="column">
                    <img src={ProfilePicImage} height="150"></img>
                    <h6 className="devtext">Nithin V</h6>
                    <p className="devtext">
                      <a href="mailto:vadakn@rpi.edu" target="_blank">vadakn@rpi.edu</a>
                    </p>
                  </div>

                  <div className="column">
                    <img src={ProfilePicImage} height="150"></img>
                    <h6 className="devtext">Jordyn Y</h6>
                    <p className="devtext">
                      <a href="mailto:youngj22@rpi.edu" target="_blank">youngj22@rpi.edu</a>
                    </p>
                  </div>

                  <div className="column">
                    <img src={ProfilePicImage} height="150"></img>
                    <h6 className="devtext">Henry T</h6>
                    <p className="devtext">
                      <a href="mailto:thealh@rpi.edu" target="_blank">thealh@rpi.edu</a>
                    </p>
                  </div>

                  <div className="column">
                    <img src={ProfilePicImage} height="150"></img>
                    <h6 className="devtext">Hari K</h6>
                    <p className="devtext">
                      <a href="mailto:kimh21@rpi.edu" target="_blank">kimh21@rpi.edu</a>
                    </p>
                  </div>

                  <div className="column">
                    <img src={ProfilePicImage} height="150"></img>
                    <h6 className="devtext">Felix T</h6>
                    <p className="devtext">
                      <a href="mailto:tianf2@rpi.edu" target="_blank">tianf2@rpi.edu</a>
                    </p>
                  </div>
                </div>
            </div>
    
            <hr /> {/* Horizontal rule for another visual break */}
          </div>
          <Footer /> {/* Embedding the Footer component at the bottom */}
        </div>
      );
}

export default AboutUs // Export AboutUs component to be used in the application
