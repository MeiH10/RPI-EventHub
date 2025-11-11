import React, { useState, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { HamburgerMenuClose, HamburgerMenuOpen } from "./Icons";
import EventHubLogo2 from "../../assets/EventHubLogo2.png";
import CreateEventModal from "../CreateEventModal/CreateEventModal";
import LoginModal from "../LoginModal/LoginModal";
import SignupModal from "../SignupModal/SignupModal";
import { DarkModeToggle } from "../DarkMode/DarkMode";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { useColorScheme } from "../../hooks/useColorScheme";

const BANNED = 0;
const UNVERIFIED = 1;
const VERIFIED = 2;
const OFFICER = 3;
const ADMIN = 4;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, role, logout, manageMode, setManageMode } = useAuth();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const { isDark } = useColorScheme();

  const handleToggle = () => setOpen(!open);

  const handleLogout = () => {
    logout();
    if (window.innerWidth <= 960) setOpen(false);
  };

  const navLinkClass = (path) => {
    const isActive = location.pathname === path;
    const active = isDark
      ? "text-yellow-300 border-yellow-300"
      : "text-red-600 border-red-600";
    return `px-3 py-2 border-b-4 border-transparent transition-colors duration-300 ${
      isActive ? active : ""
    } ${isDark ? "text-white" : "text-gray-900"}`;
  };

  return (
    <nav
      className={`fixed z-20 w-full h-[70px] flex items-center justify-center px-5 ${
        isDark ? "bg-[rgb(61,45,45)]" : "bg-white/90"
      } shadow`}
    >
      <div className="flex items-center justify-between w-full h-full">
        {/* Left */}
        <div className="flex items-center h-full">
          <NavLink to="/" className="flex items-center h-full mr-5">
            <img
              src={EventHubLogo2}
              alt="Event Hub Logo"
              className="inline-block align-middle w-24 h-24"
            />
          </NavLink>
          <ul className="hidden lg:flex items-center m-0 list-none text-center">
            <li className="mr-4">
              <NavLink to="/" className={navLinkClass("/")}>
                Home
              </NavLink>
            </li>
            <li className="mr-4">
              <NavLink to="/all-events" className={navLinkClass("/all-events")}>
                Events
              </NavLink>
            </li>
            <li className="mr-4">
              <NavLink to="/about-us" className={navLinkClass("/about-us")}>
                About
              </NavLink>
            </li>
            <li className="mr-4">
              <NavLink to="/calendar" className={navLinkClass("/calendar")}>
                Calendar
              </NavLink>
            </li>
            {role === ADMIN && (
              <li className="mr-4">
                <NavLink to="/admin" className={navLinkClass("/admin")}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
        </div>

        {/* Right */}
        <div className="flex items-center h-full">
          <ul className="hidden lg:flex items-center m-0 list-none text-center">
            {isLoggedIn && role >= VERIFIED && (
              <li className="mr-4">
                <CreateEventModal />
              </li>
            )}
            {isLoggedIn && (
              <li className="mr-4">
                <button
                  onClick={() => setManageMode(!manageMode)}
                  className={`btn ${manageMode ? "btn-warning" : "btn-secondary"}`}
                >
                  {manageMode ? "Managing" : "Manage Events"}
                </button>
              </li>
            )}
            {isLoggedIn ? (
              <li className="mr-4">
                <button onClick={handleLogout} className="btn btn-danger">
                  Sign Out
                </button>
              </li>
            ) : (
              <li className="mr-4">
                <div className="flex gap-4 m-2">
                  <NavLink to="/login">
                    <button className="btn btn-secondary">Log In</button>
                  </NavLink>
                  <NavLink to="/signup">
                    <button className="btn btn-primary">Sign Up</button>
                  </NavLink>
                </div>
              </li>
            )}
            <li>
              <DarkModeToggle />
            </li>
          </ul>

          {/* Hamburger */}
          <button
            className="lg:hidden flex items-center justify-center text-[#e85635]"
            onClick={handleToggle}
            aria-label="Toggle navigation"
          >
            <span className="inline-block align-middle w-12 h-12">
              {open ? <HamburgerMenuClose /> : <HamburgerMenuOpen />}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 z-30 ${
          isDark ? "bg-black/70" : "bg-black/70"
        } transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } shadow-[2px_0_5px_rgba(0,0,0,0.2)]`}
      >
        <ul className="flex flex-col items-start p-5 list-none">
          <li className="w-full my-2">
            <NavLink to="/" className="text-white block" onClick={handleToggle}>
              Home
            </NavLink>
          </li>
          <li className="w-full my-2">
            <NavLink
              to="/all-events"
              className="text-white block"
              onClick={handleToggle}
            >
              Events
            </NavLink>
          </li>
          <li className="w-full my-2">
            <NavLink
              to="/about-us"
              className="text-white block"
              onClick={handleToggle}
            >
              About
            </NavLink>
          </li>
          <li className="w-full my-2">
            <NavLink
              to="/calendar"
              className="text-white block"
              onClick={handleToggle}
            >
              Calendar
            </NavLink>
          </li>
          {role === ADMIN && (
            <li className="w-full my-2">
              <NavLink
                to="/admin"
                className="text-white block"
                onClick={handleToggle}
              >
                Admin
              </NavLink>
            </li>
          )}
          {isLoggedIn && role >= VERIFIED && (
            <li className="w-full my-2">
              <CreateEventModal />
            </li>
          )}
          {isLoggedIn ? (
            <li className="w-full my-2">
              <button onClick={handleLogout} className="btn btn-danger">
                Sign Out
              </button>
            </li>
          ) : (
            <li className="w-full my-2">
              <div className="flex gap-4 m-2">
                <NavLink to="/login">
                  <button className="btn btn-secondary">Sign Up</button>
                </NavLink>
                <NavLink to="/signup">
                  <button className="btn btn-primary">Sign In</button>
                </NavLink>
              </div>
            </li>
          )}
          <li className="w-full my-2">
            <DarkModeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
