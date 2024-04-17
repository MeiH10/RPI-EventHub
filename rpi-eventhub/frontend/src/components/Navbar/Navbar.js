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

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
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
