import React from 'react';
import "./Navbar.css"; // Make sure this path is correct.

const Navbar = () => {
    return ( 
        <nav className="navbar navbar-light bg-light">
            <a className="navbar-brand text-primary" href="#">
                Bootstrap
            </a>
            <p className="text-primary">RPI EventHub</p>

        </nav>
    );
}
 
export default Navbar;
