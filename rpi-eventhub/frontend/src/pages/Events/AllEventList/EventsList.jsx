import React, { useContext } from "react";
import { useEvents } from '../../../context/EventsContext';
import { Link } from "react-router-dom";
import { ThemeContext } from '../../../context/ThemeContext';
import { useColorScheme } from '../../../hooks/useColorScheme';

function EventsListCard({ event }) {
    return (
        <Link to={`/events/${event._id}`}>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4">
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold mb-2">
                        {event.title}
                        <small className="block mt-2">
                            {event.tags.map(tag => (
                                <span key={tag} className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
                                    {tag}
                                </span>
                            ))}
                        </small>
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{event.description}</p>
                </div>
            </div>
        </Link>
    );
}

function EventsList({ events }) {
    const { theme } = useContext(ThemeContext);
    const { isDark } = useColorScheme();

    const pageStyles = isDark
        ? { backgroundColor: '#120451' }
        : {
            background: `linear-gradient(
                217deg,
                rgba(255, 101, 101, 0.8),
                rgb(255 0 0 / 0%) 70.71%
              ), linear-gradient(127deg, rgba(255, 248, 108, 0.8), rgb(0 255 0 / 0%) 70.71%),
              linear-gradient(336deg, rgba(66, 66, 255, 0.8), rgb(0 0 255 / 0%) 70.71%)`,
        };

    return (
        <div className={`min-h-screen p-8 ${isDark ? 'text-white' : 'text-black'}`} style={pageStyles} data-theme={theme}>
            {events.map((event) => (
                <EventsListCard key={event._id} event={event} />
            ))}
        </div>
    );
}

export default EventsList;