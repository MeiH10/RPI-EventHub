import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css'; // Ensure this CSS file contains your styles
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import posters
import poster1 from './poster1.jpeg';
import poster2 from './poster2.jpeg';
import poster3 from './poster3.png';
import poster4 from './poster4.jpeg';
import poster5 from './poster5.png';

const poster1_link = "https://media.discordapp.net/attachments/665684489174777884/1196944218229309541/RPI_Chess_Tournament_Jan_27.png?ex=663170ab&is=661efbab&hm=57d8dd02b652839e5dcf4fb2d0094a34c1175c96d013dde1efb2cb470a8e5484&=&format=webp&quality=lossless&width=518&height=671";
const poster2_link = "https://media.discordapp.net/attachments/1033092383287554160/1219248535770366003/gm_week_flier_1.webp?ex=662f86af&is=661d11af&hm=aa7c8ad75a1c65d7fcdf3c64f477ab8ce869eaae618f2d78aabb11725a9a6308&=&format=webp&width=518&height=671";
const poster3_link = "https://media.discordapp.net/attachments/925208759268147322/1228787258338054204/acapocalypse7_adjusted.png?ex=662d5050&is=661adb50&hm=64dc764c181d2e04800c8612d7527baf5ec13ab5b1d828fe3d67d787b75f8188&=&format=webp&quality=lossless&width=518&height=671";
const poster4_link = "https://media.discordapp.net/attachments/925208759268147322/1225833305715511399/LOST_IN_SPACE.png?ex=662bcbba&is=661956ba&hm=e213190417db3eb387694d6532679b0ee99c4e1401582c24f724c6c74519491f&=&format=webp&quality=lossless&width=518&height=671";
const poster5_link = "https://media.discordapp.net/attachments/925208759268147322/1201585074131439758/A_virtual_information_session_and_QA_with_the_Raytheon_chapter_of_Engineers_Without_Borders_including_info_on_their_company_building_your_resume_and_being_a_successful_internshipjob_applicant.png?ex=662fddce&is=661d68ce&hm=79a3a82e1d2c2b39465832d82d749a161ce75cff8b1f0b0a186997d4d465faba&=&format=webp&quality=lossless&width=536&height=671";




const images = [
  { src: poster1_link, caption: "Chess Tournament" },
  { src: poster2_link, caption: "Of a Cappella" },
  { src: poster3_link, caption: "Partial Credit Acapocalypse" },
  { src: poster4_link, caption: "Lost In Space" },
  { src: poster5_link, caption: "Rayrheon Q&A Session" }
];

const ImageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  const goToNext = () => {
    setActiveIndex(current => current === images.length - 1 ? 0 : current + 1);
  };

  const goToPrev = () => {
    setActiveIndex(current => current === 0 ? images.length - 1 : current - 1);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goToNext, 3000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="carousel">
      <div className="main-image">
        <div className="caption-above">{images[activeIndex].caption}</div>
        <img src={images[activeIndex].src} alt={`Slide ${activeIndex}`} />
        <button onClick={() => { goToPrev(); resetTimer(); }} className="prev-button">
          <i className="bi bi-chevron-left"></i>
        </button>
        <button onClick={() => { goToNext(); resetTimer(); }} className="next-button">
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
