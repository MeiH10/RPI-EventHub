import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { EventHubLogo2, HamburgerMenuClose, HamburgerMenuOpen } from "./Icons";
import CreateEventModal from "../CreateEventModal/CreateEventModal";
import LoginModal from "../LoginModal/LoginModal";
import SignupModal from "../SignupModal/SignupModal";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const { isLoggedIn, logout } = useAuth(); // Destructure isLoggedIn and logout from useAuth

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
                exact
                to="/about-us"
                activeClassName="active"
                className="nav-links"
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
                <li className="nav-item">
                <LoginModal />

                </li>
                <li className="nav-item">
                <SignupModal />

                </li>

                </>
              )}
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            {click ? (
              <span className="icon">
                <HamburgerMenuOpen />
              </span>
            ) : (
              <span className="icon">
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
