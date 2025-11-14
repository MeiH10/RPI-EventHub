import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import { HamburgerMenuClose, HamburgerMenuOpen } from "./Icons";
import EventHubLogo2 from "../../assets/EventHubLogo2.png";
import CreateEventModal from "../CreateEventModal/CreateEventModal";
import LoginModal from "../LoginModal/LoginModal";
import SignupModal from "../SignupModal/SignupModal";
import { DarkModeToggle } from "../DarkMode/DarkMode";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';

const BANNED = 0;
const UNVERIFIED = 1;
const VERIFIED = 2;
const OFFICER = 3;
const ADMIN = 4;

const Navbar = () => {
  const [click, setClick] = useState(false);
  const { isLoggedIn, role, logout, manageMode, setManageMode } = useAuth();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();

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
      <nav className={`${styles.navbar} ${isDark ? styles.darkNavbar : ''}`}>
        <div className={styles.navContainer}>
          <div className={styles.navLeft}>
            <NavLink to="/" className={styles.navLogo}>
              <img src={EventHubLogo2} alt="Event Hub Logo" className={styles.logoSvg} />
            </NavLink>
            <ul className={styles.navMenu}>
              <li className={isDark ? styles.darkNavItem : styles.navItem}>
                <NavLink
                  to="/"
                  className={`${getNavLinkClass("/")} ${isDark ? 'text-white' : ''}`}
                >
                  Home
                </NavLink>
              </li>
              <li className={isDark ? styles.darkNavItem : styles.navItem}>
                <NavLink
                  to="/all-events"
                  className={`${getNavLinkClass("/all-events")} ${isDark ? 'text-white' : ''}`}
                >
                  Events
                </NavLink>
              </li>
              <li className={isDark ? styles.darkNavItem : styles.navItem}>
                <NavLink
                  to="/about-us"
                  className={`${getNavLinkClass("/about-us")} ${isDark ? 'text-white' : ''}`}
                >
                  About
                </NavLink>
              </li>
              <li className={isDark ? styles.darkNavItem : styles.navItem}>
                <NavLink
                  to="/calendar"
                  className={`${getNavLinkClass("/calendar")} ${isDark ? 'text-white' : ''}`}
                >
                  Calendar
                </NavLink>
              </li>
              {(role === ADMIN) && (
                <li className={isDark ? styles.darkNavItem : styles.navItem}>
                  <NavLink to="/admin" 
                  className={`${getNavLinkClass("/admin")} ${isDark ? 'text-white' : ''}`}>
                    Admin
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
          <div className={styles.navRight}>

            <ul className={styles.navMenu2}>
              {isLoggedIn && role >= VERIFIED && (
                <li className={styles.navItem}>
                  <CreateEventModal />
                </li>
              )}
              
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
                </div>
              ) : (
                <div className="flex gap-4 m-2">
                  <NavLink to={'/login'} >
                    <button
                        className={`btn ${manageMode ? 'btn-warning' : 'btn-secondary'}`}
                    >
                      {'Log In'}
                    </button>
                  </NavLink>
                  <NavLink to={'/signup'}>
                    <button
                        className={`btn ${manageMode ? 'btn-warning' : 'btn-primary'}`}
                    >
                      {'Sign Up'}
                    </button>
                  </NavLink>
                </div>
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
            {(role === ADMIN) && (
                <li className={styles.drawerItem}>
                  <NavLink to="/admin" 
                  className={`${getNavLinkClass("/admin")}`}>
                    Admin
                  </NavLink>
                </li>
            )}
            {isLoggedIn && role >= VERIFIED && (
              <li className={styles.drawerItem}>
                <CreateEventModal />
              </li>
            )}
            {isLoggedIn ? (
              <div className={styles.drawerItem}>
                <button
                  onClick={handleLogout}
                  className={`${styles.navItem} btn-danger btn`}
                >
                  Sign Out
                </button>
                {/*{!(role >= VERIFIED) && <VerifyModal />}*/}
              </div>
            ) : (
                <div className="flex gap-4 m-2">
                <NavLink to={'/login'} >
                  <button
                      className={`btn ${manageMode ? 'btn-warning' : 'btn-secondary'}`}
                  >
                    {'Sign Up'}
                  </button>
                </NavLink>
                <NavLink to={'/signup'}>
                  <button
                      className={`btn ${manageMode ? 'btn-warning' : 'btn-primary'}`}
                  >
                    {'Sign In'}
                  </button>
                </NavLink>
              </div>
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