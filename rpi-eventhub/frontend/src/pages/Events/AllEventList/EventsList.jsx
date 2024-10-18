import React from "react";
import { useEvents } from '../../../context/EventsContext';
import styles from './EventsList.module.css';
import {Link} from "react-router-dom";

const EventsListCard = ({ event, selected, onSelect}) => {
    return (
        <Link to={`/events/${event._id}`}>
            <div className={`${styles.eventCard} ${selected && 'border-8 border-indigo-400'}`} style={{ transition: 'border-width 0.25s ease, border-color 0.25s ease' }}>
                <div className={styles.eventCardContainer}>
                    <div>
                        <h3>
                            {event.title}
                            <small className={styles.tags}>
                                {event.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>{tag}</span>
                                ))}
                            </small>
                        </h3>
                        <p>{event.description}</p>
                        <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" className='absolute right-4 top-4 h-5 w-5' onClick={(e) => {e.stopPropagation() 
                            onSelect()}} checked={selected}/>
                    </div>
                </div>
            </div>
        </Link>

    )
}


// function EventsList({events, selectedEventIds}) {

//     return (
//         <div className={styles.eventListView}>
//             {events.map((event) => (
//                 <EventsListCard selected={selectedEventIds.includes(event._id)} onSelect={() => null} key={event._id} event={event}/>
//             ))}
//         </div>
//     )
// }

export default EventsListCard;