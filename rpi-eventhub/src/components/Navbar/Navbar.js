import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { RPISeal, HamburgetMenuClose, HamburgetMenuOpen } from "./Icons";

const Navbar = () => {
    return ( 
        <nav class="crumbs">
            <ol>
                <li class="crumb"><a href="google.com">Events</a></li>
                <li class="crumb"><a href="rpi.edu">BMX</a></li>
                <li class="crumb">Jump Bike 3000</li>
                <li class="crumb">LOL</li>

  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <NavLink exact to="/" className="nav-logo">
            {/* <i className="fas fa-code"></i> */}
            <span className="icon">
              <RPISeal />
            </span>

            <span>RPI Event Hub</span>
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

            </li>
          </ul>
          <div className="nav-icon" onClick={handleClick}>
            {/* <i className={click ? "fas fa-times" : "fas fa-bars"}></i> */}

            {click ? (
              <span className="icon">
                <HamburgetMenuOpen />{" "}
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

export default NavBar;