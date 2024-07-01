import styles from './Experimental.module.css';

import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
// import { BrowserRouter as Router,  Route, Routes } from "react-router-dom";
//import Home from '../../pages/Home/Home';
//import Navbar from '../../components/Navbar/Navbar';
//import { Carousel } from 'bootstrap';
import Carousel from '../../components/Carousel/Carousel';

const Experimental = () => {
    // const title = "Hello World";
    return (
  
      <div className={styles.App}>
        <Carousel />
      </div>
    )


}
 
export default Experimental;