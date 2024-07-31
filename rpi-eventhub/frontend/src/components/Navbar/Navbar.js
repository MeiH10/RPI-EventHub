import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { EventHubLogo2, HamburgerMenuClose, HamburgerMenuOpen } from "./Icons";
import CreateEventModal from "../CreateEventModal/CreateEventModal";
import LoginModal from "../LoginModal/LoginModal";
import SignupModal from "../SignupModal/SignupModal";
import { DarkModeToggle } from "../DarkMode/DarkMode";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from 'react-router-dom';
import VerifyModal from "../VerifyModal/VerifyModal";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const { isLoggedIn, emailVerified, logout } = useAuth(); // Destructure emailVerified
  const location = useLocation();

  const handleClick = () => setClick(!click);
  const handleLogout = () => {
    logout();
    handleClick(); // Optionally close any open menus
  };

  const getNavLinkClass = (path) => {
    return location.pathname === path ? `${styles.navLinks} ${styles.active}` : styles.navLinks;
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <NavLink to="/" className={styles.navLogo}>
            <span className={styles.icon}>
              <EventHubLogo2 />
            </span>
          </NavLink>
          <ul className={click ? `${styles.navMenu3} ${styles.active}` : styles.navMenu3}>
          <ul className={click ? `${styles.navMenu} ${styles.active}` : styles.navMenu}>

          <li className={styles.navItem}>
              <NavLink
                to="/"
                className={getNavLinkClass('/')}
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
            
          <li className={styles.navItem}>
              <NavLink
                to="/all-events"
                className={getNavLinkClass('/all-events')}
                onClick={handleClick}
              >
                Events
              </NavLink>
            </li>

            <li className={styles.navItem}>
              <NavLink
                to="/about-us"
                className={getNavLinkClass('/about-us')}
                onClick={handleClick}
              >
                About
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/calendar"
                className={getNavLinkClass('/calendar')}
                onClick={handleClick}
              >
                Calendar
              </NavLink>
            </li>

            </ul>
            <ul className={click ? `${styles.navMenu2} ${styles.active}` : styles.navMenu2}>
            <li className={styles.navItem}>
              <CreateEventModal />
            </li>
              {isLoggedIn ? (
                <div>
                    <button onClick={handleLogout} className={`${styles.navItem} btn-danger btn`}>Sign Out</button>
                    {!emailVerified && <VerifyModal />}
                </div>
                
              ) : (
                <>
                  <li className={styles.navItem}>
                    <LoginModal />
                  </li>
                  <li className={styles.navItem}>
                    <SignupModal />
                  </li>
                  <li className={styles.navItem}>
                <DarkModeToggle /> {/* Add DarkModeToggle here */}
              </li>
                </>
              )}
              </ul>
              </ul>
          
          <div className={styles.navIcon} onClick={handleClick}>
            {click ? (
              <span className={styles.icon}>
                <HamburgerMenuClose  />
              </span>
            ) : (
              <span className={styles.icon}>
                <HamburgerMenuOpen />
              </span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
