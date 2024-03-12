import React from 'react';
import './ImagePopUp.css';

const ImagePopup = ({ src, alt }) => {
 return (
    <div className="imagePopUp">
      <img src={src} alt={alt} className="PopUp_image" />
      <div className="text">Some text abt event</div>
    </div>
 );
};

export default ImagePopup;