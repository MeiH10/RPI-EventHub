import React from 'react';
import './ImagePopUp.css';

const ImagePopup = ({ src, alt, txt }) => {
 return (
    <div className="imagePopUp">
      <img src={src} alt={alt} className="PopUp_image" />
      <div className="text"> txt </div>
    </div>
 );
};

export default ImagePopup;