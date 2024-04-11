import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { EventHubLogo2, HamburgerMenuClose, HamburgerMenuOpen } from "./Icons";
import CreateEventModal from "../CreateEventModal/CreateEventModal";
import LoginModal from "../LoginModal/LoginModal";
import SignupModal from "../SignupModal/SignupModal";


const Navbar = () => {

  const [click, setClick] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const handleClick = () => setClick(!click);
  
  
  return (
    <>
      <nav className="navbar">
        <LoginModal></LoginModal>
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            {/* <i className="fas fa-code"></i> */}
            <span className="icon">
              <EventHubLogo2 />
            </span>
          </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
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
            <li className="nav-item">
              <NavLink
                exact
                to="/events"
                activeClassName="active"
                className="nav-links"
                onClick={handleClick}
              >
                Events
              </NavLink>
            </li>
            <div className="modal-buttons">
              <LoginModal></LoginModal>
              <SignupModal></SignupModal>
              <CreateEventModal></CreateEventModal>
            </div>

            
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            {/* <i className={click ? "fas fa-times" : "fas fa-bars"}></i> */}

            {click ? (
              <span className="icon">
                <HamburgerMenuOpen />{" "}
              </span>
            ) : (
              <span className="icon">
                <HamburgerMenuClose />
              </span>
            )}
          </div>
        </div>
      </nav>

      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} />
      <SignupModal show={showSignup} onHide={() => setShowSignup(false)} />
      <CreateEventModal show={showCreateEvent} onHide={() => setShowCreateEvent(false)} />
    </>
  );
}

export default Navbar;