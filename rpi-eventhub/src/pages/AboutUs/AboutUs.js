import React from 'react'
import AbousUsCSS from './AboutUs.modular.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import EventHubLogo from "../../assets/EventHubLogo1.svg";
import RPIseal from "../../assets/RF0010-04 Small Seal-RGB-White.svg";

function AboutUs() {
    return (
        <div>
          <Navbar />
    
          <div className="container-fluid content">
            
            <div className="row">
              <div className="col-7 p-5">
    
                <div className="title text-start">
                  <h1>About Us</h1>
                  <h6>RPI EventHub</h6>
                </div>
                
    
                <div className="grid">
    
                    <div className="about-us-text">
                        <h4>Mission Statement</h4>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                    nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                    reprehenderit in voluptate velit esse cillum dolore eu fugiat 
                    nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                    sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                    
                    
          
                </div>
                 
                

            </div>
    
              <div className="col-5 ">
                <img src={EventHubLogo} alt="logo" width="500" height="400"></img>
              </div>

            </div>

            <hr></hr>

            <div class="developers">
                <h4>Developers</h4>
                <div className="row">

                  <div className="column">
                    <img src={RPIseal} height="150"></img>
                    <h6 className="devtext">
                      <a href="https://www.google.com/" /* <- placeholder for email */ target="_blank">First Last</a>
                    </h6>
                    <p className="devtext">Position</p>
                  </div>

                  <div className="column">
                    <img src={RPIseal} height="150"></img>
                    <h6 className="devtext">
                      <a href="https://www.google.com/" /* <- placeholder for email */ target="_blank">First Last</a>
                    </h6>
                    <p className="devtext">Position</p>
                  </div>

                  <div className="column">
                    <img src={RPIseal} height="150"></img>
                    <h6 className="devtext">
                      <a href="https://www.google.com/" /* <- placeholder for email */ target="_blank">First Last</a>
                    </h6>
                    <p className="devtext">Position</p>
                  </div>

                  <div className="column">
                    <img src={RPIseal} height="150"></img>
                    <h6 className="devtext">
                      <a href="https://www.google.com/" /* <- placeholder for email */ target="_blank">First Last</a>
                    </h6>
                    <p className="devtext">Position</p>
                  </div>

                  <div className="column">
                    <img src={RPIseal} height="150"></img>
                    <h6 className="devtext">
                      <a href="https://www.google.com/" /* <- placeholder for email */ target="_blank">First Last</a>
                    </h6>
                    <p className="devtext">Position</p>
                  </div>

                  <div className="column">
                    <img src={RPIseal} height="150"></img>
                    <h6 className="devtext">
                      <a href="https://www.google.com/" /* <- placeholder for email */ target="_blank">First Last</a>
                    </h6>
                    <p className="devtext">Position</p>
                  </div>

                  <div className="column">
                    <img src={RPIseal} height="150"></img>
                    <h6 className="devtext">
                      <a href="https://www.google.com/" /* <- placeholder for email */ target="_blank">First Last</a>
                    </h6>
                    <p className="devtext">Position</p>
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