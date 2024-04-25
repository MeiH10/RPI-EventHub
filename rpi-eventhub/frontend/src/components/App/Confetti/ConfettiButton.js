//Packages the previous confetti component into a button so that it can be applied to some of the buttons
//can be attached to stuff like the RSVP button

import React, { useState } from 'react';
import Confetti from './Confetti.js';

const ConfettiButton = ({ children }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  // State to track whether to show confetti
  const handleClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000); // Hide confetti after 2 seconds
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {showConfetti && <Confetti />}
      <button onClick={handleClick}>{children}</button>
    </div>
  );
};

export default ConfettiButton;