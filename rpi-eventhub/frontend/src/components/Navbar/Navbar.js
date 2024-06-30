import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { EventHubLogo2, HamburgerMenuClose, HamburgerMenuOpen } from "./Icons";
import CreateEventModal from "../CreateEventModal/CreateEventModal";
import LoginModal from "../LoginModal/LoginModal";
import SignupModal from "../SignupModal/SignupModal";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const { isLoggedIn, logout } = useAuth(); // Destructure isLoggedIn and logout from useAuth
  const location = useLocation();

  const handleClick = () => setClick(!click);
  const handleLogout = () => {
    logout();
    handleClick(); // Optionally close any open menus
  };

  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  

 

 

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          
            
          <ul className={click ? "nav-menu active" : "nav-menu"}>
          <NavLink exact to="/" className="nav-logo">
            <span className="icon">
              <EventHubLogo2 />
            </span>
          </NavLink>
          <li className="nav-item">
              <NavLink
                exact
                to="/all-events"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Events
              </NavLink>
            </li>
           { <li className="nav-item">
              <NavLink
                exact
                to="/calendar"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Calendar
              </NavLink>
            </li>}
            <li className="nav-item">
              <NavLink
                to="/about-us"
                className={getNavLinkClass('/about-us')}
                onClick={handleClick}
              >
                About
              </NavLink>
            </li>
            </ul>
            <ul className={click ? "nav-menu active" : "nav-menu2"}>
            <li className="nav-item">
              <CreateEventModal /> 
            </li>
              {isLoggedIn ? (

            <button onClick={handleLogout} className="nav-item btn-danger btn">Sign Out</button>


              ) : (
                <>
                  <li className={styles.navItem}>
                    <LoginModal />
                  </li>
                  <li className={styles.navItem}>
                    <SignupModal />
                  </li>
                </>
              )}
          </ul>
          <div className={styles.navIcon} onClick={handleClick}>
            {click ? (
              <span className={styles.icon}>
                <HamburgerMenuOpen />
              </span>
            ) : (
              <span className={styles.icon}>
                <HamburgerMenuClose />
              </span>
            )}
          </div> 
          
            
          <div className ="hamburger">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
                onClick={handleClick}
          </div>

            
        </div>
      </nav>
    </>
  );
}

export default Navbar;
