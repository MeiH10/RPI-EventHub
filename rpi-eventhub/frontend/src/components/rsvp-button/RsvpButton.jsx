import RsvpButtonCSS from './RsvpButton.module.css';

const RsvpButton = ({ rsvp }) => {
  return (
    // Replace /rsvp with link to Google Form given by club officer
    <a
      href={rsvp}
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
