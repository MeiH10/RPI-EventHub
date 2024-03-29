import React from 'react'
import AbousUsCSS from './AboutUs.modular.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import EventHubLogo from "../../assets/EventHubLogo1.svg";
import RPIseal from '../../assets/RF0010-04 Small Seal-RGB-White.svg';
import RPIBridgePhoto from '../../assets/RPIBridgePhoto.jpg'
import ProfilePicImage from '../../assets/ProfilePicImage.svg'

function AboutUs() {
    return (
        <div>
          <Navbar />
    
          <div className="container-fluid content">
            
            <div className="row">
              <div className="col-7 p-5">
    
                <div className="title text-start first">
                  <h1>About Us</h1>
                  <h6>RPI EventHub</h6>
                </div>
                
    
                <div className="grid">
    
                    <div className="about-us-text second">
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
    
              <div className="col-5 p-5 second">
                <img src={RPIBridgePhoto} alt="logo" width="480"></img>
              </div>

            </div>

            <hr></hr>

            <div class="developers third">
                <h4>Developers</h4>
                <div className="row">

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

            <hr></hr>

          </div>
          <Footer />
        </div>
      );
}

export default AboutUs