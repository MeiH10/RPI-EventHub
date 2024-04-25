//Packages the previous confetti component into 

import React, { useState } from 'react';
import Confetti from './Confetti.js';

const ConfettiButton = ({ children }) => {
  const [showConfetti, setShowConfetti] = useState(false);

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