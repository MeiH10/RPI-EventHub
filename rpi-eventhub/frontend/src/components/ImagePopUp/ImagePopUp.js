import React from 'react';
import ImagePopUpCSS from './ImagePopUp.module.css'

const ImagePopup = ({ src, alt, txt }) => {
 return (
    <div className={ImagePopUpCSS.imagePopUp}>
      <img src={src} alt={alt} className={ImagePopUpCSS.PopUpImage} />
      <div className={ImagePopUpCSS.text}> txt </div>
    </div>
 );
};

export default ImagePopup;