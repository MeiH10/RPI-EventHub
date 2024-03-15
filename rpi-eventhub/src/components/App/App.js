import './App.css';
import Navbar from '../Navbar/Navbar';
import logo from "./logo.svg";
import logo2 from "./nyc.jpg"
import React from 'react';
import { motion } from 'framer-motion';   
import HoverImagePopup from '../ImagePopUp/ImagePopUp';

function App() {

  const title = "Hello World";
  return (
    <div className="App">

      <Navbar></Navbar>

      <div className="content">
        <h1>{title}</h1>
      </div>
      <motion.img
        
        src = {logo}
        alt="IMAGE HERE"  
        style = {{width: '400px', height: '300px'}}
        animate={{ y: [10, 30, 10], x: [0,0, 0]}}
        transition={{
          duration:  5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        
      />
      <div>
        <HoverImagePopup src= {logo2} alt="Insert image here"/>

      </div>
    </div>
  )
}

export default App;
