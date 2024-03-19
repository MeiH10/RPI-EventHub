import './App.css';

import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer'; 
import RsvpButton from '../rsvp-button/RsvpButton';
import logo from "./logo.svg";
import logo2 from "./nyc.jpg"
import React from 'react';
import { motion } from 'framer-motion';   
import HoverImagePopup from '../ImagePopUp/ImagePopUp';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";
import Home from '../../pages/Home/Home';
import Playground from '../../pages/Playground/Playground';

function App() {

  const title = "Hello World";
  return (

    // <Home></Home>
    <Playground></Playground>
    // <div className="App">
    //     <Navbar />
    //   <div className="content">
    //     <h1>{title}</h1>
        
    //   </div>
    //   <motion.img
        
    //     src = {logo}
    //     alt="IMAGE HERE"  
    //     style = {{width: '400px', height: '300px'}}
    //     animate={{ y: [10, 30, 10], x: [0,0, 0]}}
    //     transition={{
    //       duration:  5,
    //       repeat: Infinity,
    //       ease: "easeInOut",
    //     }}
        
    //   />
    //   <div>
    //     <HoverImagePopup src= {logo2} alt="Insert image here"/>

    //   </div>
    //   <Footer />
    //   <RsvpButton />
    // </div>
  )
}

export default App;
