import RsvpButtonCSS from './RsvpButton.module.css';
import ReactGA from 'react-ga4';

const handleRSVPClick = () => {
  ReactGA.event({
    category: 'RSVP',
    Action: 'RSVP Sent'
  });
};

const RsvpButton = ({ rsvp }) => {
  return (
    // Replace /rsvp with link to Google Form given by club officer
    <a
      href={rsvp} 
      onClick={handleRSVPClick}
      className={RsvpButtonCSS.rsvpButton}
      target="_blank"
      rel="noopener noreferrer"
    >
      RSVP
    </a>
  );
};

// Allows other files to import and use the RSVP button
export default RsvpButton;
