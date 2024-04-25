import React, { useState, useEffect } from 'react';
import './Confetti.modular.css';

const Confetti = () => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const animationFrame = () => {
      const newConfetti = {
        left: `${Math.random() * 100}vw`, // Random hoz position
        animationDuration: `${Math.random() * 2 + 1}s`, // Random animation duration
        backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`, // Random color
        opacity: Math.random() * 0.8 + 0.2, // Random opacity
      };

      setConfetti((prevConfetti) => [...prevConfetti, newConfetti]);

      setTimeout(() => {
        setConfetti((prevConfetti) => prevConfetti.slice(1));
      }, 2000);
    };

    const intervalId = setInterval(animationFrame, 200);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="confetti-container">
      {confetti.map((confettiPiece, index) => (
        <div
          key={index}
          className="confetti"
          style={{
            left: confettiPiece.left,
            animationDuration: confettiPiece.animationDuration,
            backgroundColor: confettiPiece.backgroundColor,
            opacity: confettiPiece.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
