import React, { useEffect, useState, useRef, useContext } from "react";
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import config from "../../config";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';
import { DateTime } from 'luxon';

const timeZone = 'America/New_York';

const formatTime = (utcDateString) => {
    if (!utcDateString) return 'Unavailable';
    const dateTime = DateTime.fromISO(utcDateString, { zone: 'utc' }).setZone(timeZone);
    return dateTime.toFormat('h:mm a');
};

const formatDateAsEST = (utcDateString) => {
    if (!utcDateString) return 'Unavailable';
    const dateTime = DateTime.fromISO(utcDateString, { zone: 'utc' }).setZone(timeZone);
    return dateTime.toFormat('MMMM dd, yyyy');
};

const CalendarPage = () => {
    const [weekRange, setWeekRange] = useState({ start: "", end: "" });
    const [events, setEvents] = useState([]);
    const [currentStartDate, setCurrentStartDate] = useState(new Date());
    const [mobileStartIndex, setMobileStartIndex] = useState(0);
    const { theme } = useContext(ThemeContext);
    const { isDark } = useColorScheme();
    const calendarRef = useRef(null);

    const parseDateAsEST = (utcDate) => {
        const date = new Date(utcDate);
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();
        return new Date(year, month, day);
    };

    const getWeekRange = (startDate) => {
        const today = startDate || new Date();
        const currentDay = today.getDay();
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - currentDay);

        const lastDayOfWeek = new Date(today);
        lastDayOfWeek.setDate(today.getDate() + (6 - currentDay));

        const formatDate = (date) => {
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            const yy = date.getFullYear();
            return `${mm}/${dd}/${yy}`;
        };

        setWeekRange({
            start: formatDate(firstDayOfWeek),
            end: formatDate(lastDayOfWeek),
        });
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/events`);
            setEvents(response.data);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    };

    const handleWeekChange = (offset) => {
        const newStartDate = new Date(currentStartDate);
        newStartDate.setDate(currentStartDate.getDate() + offset * 7);
        setCurrentStartDate(newStartDate);
        setMobileStartIndex(0);  // Reset mobile view to start of week
        getWeekRange(newStartDate);
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentStartDate(today);
        setMobileStartIndex(0);  // Reset mobile view to start of week
        getWeekRange(today);
    };

    const filterEventsByDay = (day, firstDayOfWeek, lastDayOfWeek) => {
        const filteredEvents = events.filter((event) => {
            const eventDate = new Date(event.startDateTime || event.date);
            eventDate.setHours(0, 0, 0, 0);
            return (
                eventDate.getDay() === day &&
                eventDate >= firstDayOfWeek &&
                eventDate <= lastDayOfWeek
            );
        });

        return filteredEvents.sort((event1, event2) => {
            const time1 = new Date(event1.startDateTime).getTime();
            const time2 = new Date(event2.startDateTime).getTime();
            return time1 - time2;
        });
    };

    const handleMobileScroll = (direction) => {
        if (direction === 'next' && mobileStartIndex < 4) {
            setMobileStartIndex(prev => prev + 3);
        } else if (direction === 'prev' && mobileStartIndex > 0) {
            setMobileStartIndex(prev => prev - 3);
        }
    };

    const loadAllImages = () => {
        const images = calendarRef.current.querySelectorAll("img");
        return Promise.all(
            Array.from(images).map((img) => {
                if (!img.complete) {
                    return new Promise((resolve) => {
                        img.onload = img.onerror = resolve;
                    });
                }
                return Promise.resolve();
            })
        );
    };

    const captureCalendarScreenshot = async () => {
        await loadAllImages();
        if (calendarRef.current) {
            html2canvas(calendarRef.current, { useCORS: true }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = imgData;
                link.download = `calendar-${weekRange.start}-to-${weekRange.end}.png`;
                link.click();
            });
        }
    };

    useEffect(() => {
        getWeekRange(currentStartDate);
        fetchEvents();
    }, [currentStartDate]);

    return (
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-gray-900 text-white' : 'bg-gradient-to-r from-red-400 via-yellow-200 to-blue-400'}`}>
            <NavBar />
            <div className="flex-1 pt-20 px-2 md:px-4">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-4">
                        <button 
                            onClick={captureCalendarScreenshot}
                            className="bg-[#E8495F] hover:bg-[#d13b50] text-white px-4 py-2 rounded transition-colors"
                        >
                            Save Calendar as Image
                        </button>
                    </div>

                    <div ref={calendarRef} className="w-full bg-white p-4 border-2 border-black">
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                            <button 
                                onClick={() => handleWeekChange(-1)}
                                className="bg-[#C2405E] hover:bg-[#b33754] text-white px-4 py-2 rounded text-sm whitespace-nowrap"
                            >
                                Previous Week
                            </button>
                            <button 
                                onClick={goToToday}
                                className="bg-[#C2405E] hover:bg-[#b33754] text-white px-4 py-2 rounded text-sm"
                            >
                                Today
                            </button>
                            <button 
                                onClick={() => handleWeekChange(1)}
                                className="bg-[#C2405E] hover:bg-[#b33754] text-white px-4 py-2 rounded text-sm whitespace-nowrap"
                            >
                                Next Week
                            </button>
                        </div>

                        <h2 className="text-lg md:text-2xl font-bold mb-4 text-black text-center">
                            Week of {weekRange.start} - {weekRange.end}
                        </h2>

                        <div className="md:hidden flex justify-between mb-2">
                            <button 
                                onClick={() => handleMobileScroll('prev')}
                                disabled={mobileStartIndex === 0}
                                className={`px-2 py-1 text-sm ${mobileStartIndex === 0 ? 'text-gray-400' : 'text-black'}`}
                            >
                                ←
                            </button>
                            <button 
                                onClick={() => handleMobileScroll('next')}
                                disabled={mobileStartIndex >= 4}
                                className={`px-2 py-1 text-sm ${mobileStartIndex >= 4 ? 'text-gray-400' : 'text-black'}`}
                            >
                                →
                            </button>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-7 gap-[1px] bg-black">
                            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                                <div 
                                    key={day}
                                    className={`bg-white ${day < mobileStartIndex || day >= mobileStartIndex + 3 ? 'md:block hidden' : 'block'}`}
                                >
                                    <h3 className="text-xs md:text-sm font-bold p-2 border-b border-black text-center text-black truncate">
                                        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][day]}
                                    </h3>
                                    <div className="min-h-[100px] p-1 space-y-1">
                                        {filterEventsByDay(
                                            day,
                                            parseDateAsEST(weekRange.start),
                                            parseDateAsEST(weekRange.end)
                                        ).length > 0 ? (
                                            filterEventsByDay(
                                                day,
                                                parseDateAsEST(weekRange.start),
                                                parseDateAsEST(weekRange.end)
                                            ).map((event) => (
                                                <Link to={`/events/${event._id}`} key={event._id} className="block">
                                                    <div className="p-1 border border-black hover:bg-gray-50">
                                                        <h4 className="text-[10px] md:text-xs font-bold mb-1 text-black truncate">
                                                            {event.title}
                                                        </h4>
                                                        {event.image ? (
                                                            <img
                                                                src={`${config.apiUrl}/proxy/image/${event._id}`}
                                                                alt={event.title}
                                                                className="w-full h-auto"
                                                                loading="lazy"
                                                            />
                                                        ) : (
                                                            <div className="w-full p-1 text-[10px] text-center bg-gray-100 text-gray-600">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-500 text-center pt-2">No events</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CalendarPage;