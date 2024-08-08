import React from 'react';
import style from './EventCard.module.css'

const EventCard = ({ title, posterSrc, description }) => {
    return (
        <div className={style.eventCard}>
            <div className={style.eventContent}>
                <div>
                    <h2 className={style.eventTitle}>{title}</h2>
                    <img src={posterSrc} alt="Event Poster" className={style.eventPoster}/>
                    <p className={style.eventDescription}>{description}</p>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
