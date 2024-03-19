import './AboutUs.css'
import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

function AboutUs() {
    return (
        <div className="AboutUs">
            <Navbar/>
            <div class="about">About Us Page</div>
            <Footer/>
        </div>
    )
}

export default AboutUs