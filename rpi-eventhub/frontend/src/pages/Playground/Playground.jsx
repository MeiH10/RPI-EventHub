import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RsvpButton from '../../components/RSVPButton/RsvpButton';
import HoverImagePopup from '../../components/ImagePopUp/ImagePopUp';
import logo from "./logo.svg";
import logo2 from "./nyc.jpg";
import styles from './Playground.module.css';

const Playground = () => {
  const title = "Hello World";

  return (
    <div className={styles.App}>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
      </div>
      <motion.img
        src={logo}
        alt="IMAGE HERE"
        className="w-96 h-72 mx-auto"
        animate={{ y: [10, 30, 10], x: [0, 0, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <div className="mt-4">
        <HoverImagePopup src={logo2} alt="Insert image here" />
      </div>
      <Footer />
      <RsvpButton />
    </div>
  );
};

export default Playground;