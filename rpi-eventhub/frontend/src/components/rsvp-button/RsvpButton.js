import RsvpButtonCSS from './RsvpButton.module.css'

const RsvpButton = ({ rsvp }) => {
    return ( 
        //replace /rsvp with link to google form given by club officer
        <a href={rsvp} className={RsvpButtonCSS.rsvpButton} target="_blank" rel="noopener noreferrer">
            RSVP
    </a>

    );
};

//allows other files to import and use the RSVP button
export default RsvpButton;