import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { EventHubLogo2, HamburgerMenuClose, HamburgerMenuOpen } from "./Icons";
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
  const { isLoggedIn, emailVerified, logout } = useAuth();
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
      ? "text-blue-500"
      : "text-gray-700 hover:text-blue-500";
  };

  return (
    <>
      <nav className={`bg-white shadow-md ${isDark ? 'bg-gray-800' : ''}`}>
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold text-blue-500">
              <EventHubLogo2 className="w-8 h-8" />
            </NavLink>
            <ul className={`flex space-x-4 ml-4 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              <li>
                <NavLink to="/" className={getNavLinkClass("/")}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/all-events" className={getNavLinkClass("/all-events")}>
                  Events
                </NavLink>
              </li>
              <li>
                <NavLink to="/about-us" className={getNavLinkClass("/about-us")}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/calendar" className={getNavLinkClass("/calendar")}>
                  Calendar
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="flex items-center space-x-4">
            <CreateEventModal />
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Sign Out
                </button>
                {!emailVerified && <VerifyModal />}
              </div>
            ) : (
              <>
                <LoginModal />
                <SignupModal />
              </>
            )}
            <DarkModeToggle />
          </div>
          <div className="md:hidden" onClick={handleClick}>
            {click ? (
              <HamburgerMenuClose className="w-6 h-6" />
            ) : (
              <HamburgerMenuOpen className="w-6 h-6" />
            )}
          </div>
        </div>
        <div className={`md:hidden ${click ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <NavLink to="/" className={getNavLinkClass("/")} onClick={handleClick}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/all-events" className={getNavLinkClass("/all-events")} onClick={handleClick}>
                Events
              </NavLink>
            </li>
            <li>
              <NavLink to="/about-us" className={getNavLinkClass("/about-us")} onClick={handleClick}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/calendar" className={getNavLinkClass("/calendar")} onClick={handleClick}>
                Calendar
              </NavLink>
            </li>
            <li>
              <CreateEventModal />
            </li>
            {isLoggedIn ? (
              <div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Sign Out
                </button>
                {!emailVerified && <VerifyModal />}
              </div>
            ) : (
              <>
                <li>
                  <LoginModal />
                </li>
                <li>
                  <SignupModal />
                </li>
              </>
            )}
            <li>
              <DarkModeToggle />
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;