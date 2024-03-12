import './AboutUs.css'
import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import logo from '../../assets/logo.svg';
console.log(logo);

function AboutUs() {
    return (

        <div className="AboutUs">
            <Navbar/>

            <div className="split left">
                <div className="centered">
                    <h1>Mission Statement</h1>
                    <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
                    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt 
                    mollit anim id est laborum.
                    </p>
                </div>
            </div>

            <div className="split right">
                <div className="centered">
                    <img src={logo} alt="Logo"></img>
                </div>
            </div>

            <div className="modal-container">

                <div className="modal-content">
                    <h1>adsadsa</h1>
                </div>

            </div>

            <Footer/>
        </div>
    )
}

export default AboutUs