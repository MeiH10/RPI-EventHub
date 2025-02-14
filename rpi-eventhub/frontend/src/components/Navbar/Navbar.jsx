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
import VerifyModal from "../VerifyModal/VerifyModal";
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';


const Navbar = () => {
  const [click, setClick] = useState(false);
  const { isLoggedIn, emailVerified, logout, manageMode, setManageMode } = useAuth();
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
      <nav className={`flex justify-between font-sans text-lg shadow items-center fixed z-20 px-2 h-16 w-full bg-white`}>
        <div className="flex justify-center items-center">
        <img src={EventHubLogo2} alt="EventHub Logo" className="h-16 w-16 mr-7" />
          <NavLink to="/" className={"p-2 hover:bg-blue-500 rounded-md mr-5 duration-150 hover:text-white hover:font-bold hover:shadow-sm"}>Home</NavLink> 
          <NavLink to="/all-events" className={"p-2 hover:bg-blue-500 rounded-md mr-5 duration-150 hover:text-white hover:font-bold hover:shadow-sm"}>Events</NavLink> 
          <NavLink to="/about-us" className={"p-2 hover:bg-blue-500 rounded-md mr-5 duration-150 hover:text-white hover:font-bold hover:shadow-sm"}>About</NavLink> 
          <NavLink to="/calendar" className={"p-2 hover:bg-blue-500 rounded-md mr-5 duration-150 hover:text-white hover:font-bold hover:shadow-sm"}>Calendar</NavLink> 
        </div>
        <div>
            <NavLink to="/" className={"p-2 hover:bg-emerald-500 rounded-md mr-5 duration-150 hover:text-white hover:font-bold hover:shadow-sm"}>Create Event</NavLink> 
            <NavLink to="/" className={"p-2 hover:bg-blue-500 rounded-md mr-5 duration-150 hover:text-white hover:font-bold hover:shadow-sm"}>Login</NavLink> 
            <NavLink to="/" className={"p-2 hover:bg-gray-500 rounded-md mr-5 duration-150 hover:text-white hover:font-bold hover:shadow-sm"}>Signup</NavLink> 
        </div>
      </nav>
    </>
  );
};

export default Navbar;