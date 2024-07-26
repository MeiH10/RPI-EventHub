import React from 'react';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import RsvpButton from '../../components/rsvp-button/RsvpButton';
import HoverImagePopup from '../../components/ImagePopUp/ImagePopUp';
import logo from "./logo.svg";
import logo2 from "./nyc.jpg";
import styles from './Playground.module.css';

const Playground = () => {
  const title = "Hello World";

  return (
    <div className={styles.App}>
      <Navbar />
      <div className={`${styles.content} containerFluid`}>
        <h1>{title}</h1>
      </div>
      <motion.img
        src={logo}
        alt="IMAGE HERE"
        style={{ width: '400px', height: '300px' }}
        animate={{ y: [10, 30, 10], x: [0, 0, 0] }}
        transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
        }}
      />
      <div>
        <HoverImagePopup src={logo2} alt="Insert image here" />
      </div>
      <Footer />
      <RsvpButton />
    </div>
  );
};

export default Playground;
