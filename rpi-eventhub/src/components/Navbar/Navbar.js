import React from 'react';
import "./Navbar.css"; // Make sure this path is correct.
import eventHubLogo from '../../assets/EventHubLogo1.jpg'; // Corrected import statement

const Navbar = () => {
    return (
        <nav className="navbar navbar-light bg-light">
            <a className="navbar-brand" href="#">
                <img src={eventHubLogo} width="30" height="30" alt="" />
            </a>
        </nav>
    );
}

export default Navbar;
