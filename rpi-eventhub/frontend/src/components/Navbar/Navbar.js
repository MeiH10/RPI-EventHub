import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { EventHubLogo, HamburgetMenuClose, HamburgetMenuOpen } from "./Icons";
import LoginModal from "../LoginModal/LoginModal";
import SignUpModal from "../SignUpModal/SignUpModal";
import CreateEventModal from "../CreateEventModal/CreateEventModal";

const Navbar = () => {
  // State to manage the toggle state of hamburger menu and modals
  const [click, setClick] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);

  // Toggle function for hamburger menu
  const handleClick = () => setClick(!click);

  // Toggle functions for each modal
  const toggleLoginModal = () => setIsLoginModalOpen(!isLoginModalOpen);
  const toggleSignUpModal = () => setIsSignUpModalOpen(!isSignUpModalOpen);
  const toggleCreateEventModal = () => setIsCreateEventModalOpen(!isCreateEventModalOpen);

  return (
    <>
      {/* Modal components */}
      <LoginModal isShowing={isLoginModalOpen} toggle={toggleLoginModal} />
      <SignUpModal isShowing={isSignUpModalOpen} toggle={toggleSignUpModal} />
      <CreateEventModal isShowing={isCreateEventModalOpen} toggle={toggleCreateEventModal} />

      {/* Navigation bar */}
      <nav className="navbar">
        <div className="nav-container">
          {/* Logo and link to home */}
          <NavLink exact to="/" className="nav-logo">
            <span className="icon">
              <EventHubLogo />
            </span>
          </NavLink>

          {/* Navigation menu items, visibility toggles with hamburger menu */}
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink exact to="/" activeClassName="active" className="nav-links" onClick={handleClick}>Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact to="/about-us" activeClassName="active" className="nav-links" onClick={handleClick}>About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink exact to="/events" activeClassName="active" className="nav-links" onClick={handleClick}>Events</NavLink>
            </li>
            <li className="nav-item">
              {/* Button to open login modal */}
              <button exact to="/login" activeClassName="active" onClick={toggleLoginModal}>Login</button>
            </li>
            <li className="nav-item">
              {/* Button to open sign-up modal */}
              <button exact to="/login" activeClassName="active" onClick={toggleSignUpModal}>Signup</button>
            </li>
            <li className="nav-item">
              {/* Button to open event creation modal */}
              <button exact to="/login" activeClassName="active" onClick={toggleCreateEventModal}>Create Event</button>
            </li>
          </ul>

          {/* Hamburger menu icon, toggles on click */}
          <div className="nav-icon" onClick={handleClick}>
            {click ? (
                <span className="icon"><HamburgetMenuOpen/></span>
            ) : (
                <span className="icon"><HamburgetMenuClose/></span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
