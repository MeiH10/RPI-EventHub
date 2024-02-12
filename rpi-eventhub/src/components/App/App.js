import React, { useState } from 'react';
import './App.css';
import Navbar from '../Navbar/Navbar';

import logo from '../../assets/logo.svg';
console.log(logo);

function App() {

  const [rotationAngle, setRotationAngle] = useState(0);

  const handleRotateClick = () => {
    // Update the rotation angle on click
    setRotationAngle((prevAngle) => prevAngle + 100); // Rotate by  90 degrees
  };

  const logoStyle = {
    transform: `rotate(${rotationAngle}deg)`,
    transition: 'transform  1s ease-in-out', // Optional: smooth transition
  };

  const title = "aaaaaaaaaakk World";
  return (
    <div className="App">

      <Navbar></Navbar>

      <a href="https://submitty.cs.rpi.edu/home" target="_blank">
        <img id="Logo" src={logo} style={logoStyle} width={250} height={250} alt="Logo" />
      </a>

      <h1>
        <button id="rotateButton" onClick={handleRotateClick}>Rotate Image</button>      
      </h1>

      <div className="content">
        <h1>{title}</h1>
      </div>      
    </div>
  )
}

export default App;
