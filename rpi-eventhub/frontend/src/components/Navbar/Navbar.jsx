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
import { useNavigate, useLocation } from "react-router-dom";
import VerifyModal from "../VerifyModal/VerifyModal";
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';

const BANNED = 0;
const UNVERIFIED = 1;
const VERIFIED = 2;
const OFFICER = 3;
const ADMIN = 4;

const Navbar = () => {
  const navigate = useNavigate();
  
  const [click, setClick] = useState(false);
  const [showCreate, setShowCreate] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const { isLoggedIn, emailVerified, role, logout, manageMode, setManageMode } = useAuth();
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
          <div onClick={() => navigate("/")} className="p-2 rounded-md mr-5 duration-150 hover:bg-red-500 hover:text-white hover:font-bold hover:shadow-sm cursor-pointer">Home</div>
          <div onClick={() => navigate("/all-events")} className="p-2 rounded-md mr-5 duration-150 hover:bg-red-500 hover:text-white hover:font-bold hover:shadow-sm cursor-pointer">Events</div>
          <div onClick={() => navigate("/about-us")} className="p-2 rounded-md mr-5 duration-150 hover:bg-red-500 hover:text-white hover:font-bold hover:shadow-sm cursor-pointer">About</div>
          <div onClick={() => navigate("/calendar")} className="p-2 rounded-md mr-5 duration-150 hover:bg-red-500 hover:text-white hover:font-bold hover:shadow-sm cursor-pointer">Calendar</div>
        </div>
        <div className="hidden lg:block">
          <NavLink onClick={() => setShowCreate(true)} className={"px-3 py-2 bg-red-600 hover:bg-red-800 rounded-md mr-5 duration-150 text-white text-md font-normal hover:font-bold hover:shadow-sm"}>
            Create Event
          </NavLink> 
          <NavLink onClick={() => setShowLogin(true)} className={`px-3 py-2 bg-red-600 hover:bg-red-800 rounded-md mr-5 duration-150 text-white font-normal hover:font-bold hover:shadow-sm`}>{isLoggedIn ? 'Manage Events' : 'Login'}</NavLink> 
          <NavLink onClick={isLoggedIn ? handleLogout : () => setShowSignup(true)} className={`px-3 py-2 bg-red-600 hover:bg-red-800 rounded-md mr-5 duration-150 text-white font-normal hover:font-bold hover:shadow-sm`}>{isLoggedIn ? "Sign Out" : "Signup"}</NavLink> 
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
        <CreateEventModal show={showCreate} setShow={setShowCreate} />
        <LoginModal show={showLogin} setShow={setShowLogin} />
        <SignupModal show={showSignup} setShow={setShowSignup} />
        {!emailVerified && <VerifyModal />}
      </nav>
    </>
  );
};

export default Navbar;