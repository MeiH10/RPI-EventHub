import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
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

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-links active' : 'nav-links';
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink to="/" className="nav-logo">
            <span className="icon">
              <EventHubLogo2 />
            </span>
          </NavLink>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                to="/"
                className={getNavLinkClass('/')}
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/about-us"
                className={getNavLinkClass('/about-us')}
                onClick={handleClick}
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/all-events"
                className={getNavLinkClass('/all-events')}
                onClick={handleClick}
              >
                Events
              </NavLink>
            </li>
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
        </div>
      </nav>
    </>
  );
}

export default Navbar;
