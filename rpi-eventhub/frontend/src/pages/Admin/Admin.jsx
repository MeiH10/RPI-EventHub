import React from 'react';
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CalendarCSS from "./Calendar.module.css";
import axios from "axios";
import config from "../../config";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';



const MyComponent = () => {
  return (
    <div className="bg-blue-500 text-white p-4">
      This is a Tailwind CSS styled component.
    </div>
    
  );
};

export default MyComponent;



