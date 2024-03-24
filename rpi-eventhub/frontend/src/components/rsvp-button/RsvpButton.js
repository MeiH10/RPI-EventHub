import { Link } from 'react-router-dom';
import './RsvpButton.css';

const RsvpButton = () => {
    return ( 
        //replace /rsvp with link to google form given by club officer
        <Link to="/rsvp" className='rsvp-button'>
            RSVP
        </Link>

    );
};

//allows other files to import and use the RSVP button
export default RsvpButton;