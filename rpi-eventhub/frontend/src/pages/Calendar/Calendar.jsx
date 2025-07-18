import React, { useEffect, useState, useRef, useContext } from "react";
import NavBar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import { ThemeContext } from '../../context/ThemeContext';
import { useColorScheme } from '../../hooks/useColorScheme';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from "axios";
import { DateTime } from 'luxon';
import config from "../../config";

const timeZone = 'America/New_York';

const CalendarPage = () => {
    const [weekRange, setWeekRange] = useState({ start: "", end: "" });
    const [events, setEvents] = useState([]);
    const [currentStartDate, setCurrentStartDate] = useState(new Date());
    const [showFlyers, setShowFlyers] = useState(true);
    const { theme } = useContext(ThemeContext);
    const { isDark } = useColorScheme();
    const calendarRef = useRef(null);

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
            const dbEvents = response.data;

            const formattedEvents = dbEvents.map(event => {
            const startUTC = DateTime.fromISO(event.startDateTime, { zone: 'utc' }).setZone(timeZone);
            const endUTC = event.endDateTime 
                ? DateTime.fromISO(event.endDateTime, { zone: 'utc' }).setZone(timeZone)
                : null;

            const sameDay = endUTC && startUTC.hasSame(endUTC, 'day');

            if (sameDay) {
                return {
                id: event._id,
                title: event.title,
                start: startUTC.toISO(),
                end: endUTC.toISO(),
                allDay: false,
                url: `/events/${event._id}`,
                extendedProps: {
                    description: event.description,
                    image: event.image,
                }
                };
            } else {
                return {
                id: event._id,
                title: event.title,
                start: startUTC.toISO(),
                allDay: false,
                url: `/events/${event._id}`,
                extendedProps: {
                    description: event.description,
                    image: event.image,
                }
                };
            }
            });

            setEvents(formattedEvents);
        } catch (error) {
            console.error("Failed to fetch events:", error);
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
            const titles = calendarRef.current.querySelectorAll('.truncate');
            titles.forEach(title => title.classList.remove('truncate'));

            html2canvas(calendarRef.current, { useCORS: true }).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = imgData;
                link.download = `calendar-${weekRange.start}-to-${weekRange.end}.png`;
                link.click();

                titles.forEach(title => title.classList.add('truncate'));
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
                    <div className="text-center mb-4 space-y-2">
                        <button 
                            onClick={captureCalendarScreenshot}
                            className="bg-[#E8495F] hover:bg-[#d13b50] text-white px-4 py-2 rounded transition-colors"
                        >
                            Save Calendar as Image
                        </button>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showFlyers}
                                    onChange={(e) => setShowFlyers(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C2405E]"></div>
                                <span className={`ml-2 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    Show Flyers
                                </span>
                            </label>
                        </div>
                    </div>

                    <div ref={calendarRef} className={`w-full p-4 border-2 ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-black'}`}>
                        <div className="calendar-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <FullCalendar
                            timeZone='America/New_York'
                            plugins={[ dayGridPlugin, interactionPlugin ]}
                            initialView="dayGridWeek"
                            headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek,dayGridDay'
                            }}
                            events={events}
                            eventClick={(info) => {
                            info.jsEvent.preventDefault();
                            window.location.href = info.event.url;
                            }}
                            height="auto"
                        />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CalendarPage;