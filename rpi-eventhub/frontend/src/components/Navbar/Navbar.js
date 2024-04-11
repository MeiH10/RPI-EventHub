import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { EventHubLogo, HamburgetMenuClose, HamburgetMenuOpen } from "./Icons";
import LoginModal from "../LoginModal/LoginModal"; // Adjust the path as necessary
import SignUpModal from "../SignUpModal/SignUpModal"; // Import the SignUpModal component
import CreateEventModal from "../CreateEventModal/CreateEventModal";


const Navbar = () => {

    const [click, setClick] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);




  const handleClick = () => setClick(!click);
  const toggleLoginModal = () => setIsLoginModalOpen(!isLoginModalOpen);
  const toggleSignUpModal = () => setIsSignUpModalOpen(!isSignUpModalOpen);
  const toggleCreateEventModal = () => setIsCreateEventModalOpen(!isCreateEventModalOpen);

  return (
    <>
      <LoginModal isShowing={isLoginModalOpen} toggle={toggleLoginModal} />
      <SignUpModal isShowing={isSignUpModalOpen} toggle={toggleSignUpModal} />
      <CreateEventModal isShowing={isCreateEventModalOpen} toggle={toggleCreateEventModal} />

      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            {/* <i className="fas fa-code"></i> */}
            <span className="icon">
              <EventHubLogo />
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
            <li className="nav-item">
              <button
                  exact
                  to="/login"
                  activeClassName="active"
                  //className="nav-links"
                  onClick={toggleLoginModal} // This toggles the visibility of the login modal
              >
                Login
              </button>
            </li>
            <li className="nav-item">
              <button
                  exact
                  to="/login"
                  activeClassName="active"
                  //className="nav-links"
                  onClick={toggleSignUpModal}
              >
                Signup
              </button>
            </li>
            <li className="nav-item">
              <button
                  exact
                  to="/login"
                  activeClassName="active"
                  //className="nav-links"
                  onClick={toggleCreateEventModal}
              >
                Create Event
              </button>
            </li>
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            {/* <i className={click ? "fas fa-times" : "fas fa-bars"}></i> */}

            {click ? (
                <span className="icon">
                <HamburgetMenuOpen/>{" "}
              </span>
            ) : (
                <span className="icon">
                <HamburgetMenuClose />
              </span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;