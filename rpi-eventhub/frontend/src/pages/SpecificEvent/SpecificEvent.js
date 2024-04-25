import React from 'react'
import SpecificEventCSS from './SpecificEvent.modular.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import EventHubLogo from "../../assets/EventHubLogo1.svg";
import RPIseal from '../../assets/RF0010-04 Small Seal-RGB-White.svg';
import RPIBridgePhoto from '../../assets/RPIBridgePhoto.jpg'
import ProfilePicImage from '../../assets/ProfilePicImage.svg'

/* function SpecificEvent() {
    return (
        <div>
          <Navbar />
    
          <div className="container-fluid content">
            
            <div className="row">
              <div className="col-7 p-5">
    
                <div className="title text-start first">
                  <h1>Event Name</h1>
                  <h6>RPI EventHub</h6>
                </div>
                
    
                <div className="grid">
    
                    <div className="event picture">
                        <h4>Picture style={{float: 'left'}}</h4>
                        <img 
                        src={EventHubLogo} alt = "EVENT PICTURE"
                        style = {{float: 'left', width: '50%', height: '350px'}} 
                        />
                    </div>
                    
                </div>
                 
            </div>
    
              <div className="Event Information">
                        <h4 className = "textRight">Event Info</h4>
                        Text file that needs to be a argument
              </div>

            </div>

            <hr></hr>

            <div class="developers third">

            </div>

            <hr></hr>

          </div>
          <Footer />
        </div>
      );
} */

function SpecificEvent() {
  return (
    <div><Navbar />
    <div className="container">
      <div className="image-container">
        <img src= {RPIBridgePhoto} alt="Your Image" className="image" />
      </div>
      <div className="text-container">
        <h1>Description of the Events</h1>
        <p>Location: XXX</p>
        <p1>Time: XX/XX/XXXX</p1>
        <p2> Type: XXXXXX</p2>
      </div>
    </div>
    <Footer />
    </div>

  );
}

export default SpecificEvent; 