import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { EventHubLogo2, HamburgerMenuClose, HamburgerMenuOpen } from "./Icons";
import CreateEventModal from "../CreateEventModal/CreateEventModal";
import LoginModal from "../LoginModal/LoginModal";
import SignupModal from "../SignupModal/SignupModal";
import { DarkModeToggle } from "../DarkMode/DarkMode";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import VerifyModal from "../VerifyModal/VerifyModal";

const Navbar = () => {
  const [click, setClick] = useState(false);
  const { isLoggedIn, emailVerified, logout, manageMode, setManageMode } = useAuth();
  const location = useLocation();

  const handleClick = () => setClick(!click);

  const handleLogout = () => {
    logout();
    if (window.innerWidth <= 960) {
      handleClick();
    }
  };
  
  const getNavLinkClass = (path) => {
    return location.pathname === path
      ? `${styles.navLinks} ${styles.active}`
      : styles.navLinks;
  };

  const toggleManageMode = () => {
    setManageMode(!manageMode);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navLeft}>
            <NavLink to="/" className={styles.navLogo}>
              <EventHubLogo2 className={styles.logoSvg} />
            </NavLink>
            <ul className={styles.navMenu}>
              <li className={styles.navItem}>
                <NavLink
                  to="/"
                  className={getNavLinkClass("/")}
                >
                  Home
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/all-events"
                  className={getNavLinkClass("/all-events")}
                >
                  Events
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/about-us"
                  className={getNavLinkClass("/about-us")}
                >
                  About
                </NavLink>
              </li>
              <li className={styles.navItem}>
                <NavLink
                  to="/calendar"
                  className={getNavLinkClass("/calendar")}
                >
                  Calendar
                </NavLink>
              </li>
            </ul>
          </div>
          <div className={styles.navRight}>
            <ul className={styles.navMenu2}>
              <li className={styles.navItem}>
                <CreateEventModal />
              </li>
              {isLoggedIn && (
                <li className={styles.navItem}>
                  <button
                    onClick={toggleManageMode}
                    className={`btn ${manageMode ? 'btn-warning' : 'btn-secondary'}`}
                  >
                    {manageMode ? 'Managing' : 'Manage Events'}
                  </button>
                </li>
              )}
              {isLoggedIn ? (
                <div>
                  <button
                    onClick={handleLogout}
                    className={`${styles.navItem} btn-danger btn`}
                  >
                    Sign Out
                  </button>
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

                </>
              )}
                <li className={styles.navItem}>
                  <DarkModeToggle />
                </li>
            </ul>
          </div>
          <div className={styles.navIcon} onClick={handleClick}>
            {click ? (
              <span className={styles.icon}>
                <HamburgerMenuClose />
              </span>
            ) : (
              <span className={styles.icon}>
                <HamburgerMenuOpen />
              </span>
            )}
          </div>
        </div>
        <div className={click ? `${styles.drawer} ${styles.open}` : styles.drawer}>
          <ul className={styles.drawerMenu}>
            <li className={styles.drawerItem}>
              <NavLink
                to="/"
                className={getNavLinkClass("/")}
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
            <li className={styles.drawerItem}>
              <NavLink
                to="/all-events"
                className={getNavLinkClass("/all-events")}
                onClick={handleClick}
              >
                Events
              </NavLink>
            </li>
            <li className={styles.drawerItem}>
              <NavLink
                to="/about-us"
                className={getNavLinkClass("/about-us")}
                onClick={handleClick}
              >
                About
              </NavLink>
            </li>
            <li className={styles.drawerItem}>
              <NavLink
                to="/calendar"
                className={getNavLinkClass("/calendar")}
                onClick={handleClick}
              >
                Calendar
              </NavLink>
            </li>
            <li className={styles.drawerItem}>
              <CreateEventModal />
            </li>
            {isLoggedIn ? (
              <div className={styles.drawerItem}>
                <button
                  onClick={handleLogout}
                  className={`${styles.navItem} btn-danger btn`}
                >
                  Sign Out
                </button>
                {!emailVerified && <VerifyModal />}
              </div>
            ) : (
              <>
                <li className={styles.drawerItem}>
                  <LoginModal />
                </li>
                <li className={styles.drawerItem}>
                  <SignupModal />
                </li>
              </>
            )}

                <li className={styles.navItem}>
                  <DarkModeToggle />
                </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
