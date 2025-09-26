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
    const fcRef = useRef(null);
    const [isSmall, setIsSmall] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    useEffect(() => {
        const onResize = () => setIsSmall(window.innerWidth < 768);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

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

    const renderEventContent = (eventInfo) => {
        const { image } = eventInfo.event.extendedProps;
        return (
            <div style={{
                width: isSmall ? '100%' : '244px',
                display: 'flex',    
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                margin: '0 auto',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                textAlign: 'left',
                border: '2px solid black',
                background: isDark ? '#222' : '#fff',
                paddingLeft: '4px',
                paddingRight: '4px',
                marginBottom: '4px',
                marginTop: '4px',
                backgroundColor: isDark ? '#AB2328' : 'white',
            }}>

            <span
                style={{
                    fontSize: '120%',
                    color: isDark ? '#fff' : '#000',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    width: '100%',
                    display: 'block'
                }}
                >
                {eventInfo.event.title}
            </span>
            <b
            style={{
                fontSize: '120%',
                color: isDark ? '#fff' : '#000',
                fontWeight: 'normal',
                textAlign: 'left',
                width: '100%',
                display: 'block'
            }}
            >
            {eventInfo.timeText}
            </b>


            {showFlyers && image && (
                <img
                    src={image}
                    alt={eventInfo.event.title}
                    style={{
                        objectFit: 'cover',
                        display: 'block',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginBottom: '5px'
                    }}
                />
            )}
        </div>
        );
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
        <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#383838]' : 'bg-[#F4F1EA]'}`}>
            <NavBar />
            <div className="flex-1 pt-20 px-2 md:px-4">

                <div className="max-w-[1900px] mx-auto">
                    <h1 className="text-[75px] md:text-[85px] lg:text-[100px] font-bold text-center mt-[-25px] md:mt-[20px] lg:mt-[30px] tracking-wide font-sans text-[#D6001C]">Calendar</h1>
                    <div className="text-center mb-2 space-y-2">
                        <div className="flex items-center justify-between w-full">
                            <label className="inline-flex items-center cursor-pointer max-w-[130px]">
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

                            <button 
                                onClick={captureCalendarScreenshot}
                                className="bg-[#AB2328] hover:bg-[#d13b50] text-white px-4 py-2 rounded transition-colors"
                            >
                                Save Calendar as Image
                            </button>

                        </div>
                    </div>


                    <div ref={calendarRef} className={`w-full p-4 mb-[45px] border-[5px] border-[#AB2328] ${isDark ? 'bg-[#777777]' : 'bg-white'} ${isSmall ? 'overflow-x-auto' : ''}`}>
                        <div className="w-full pt-[15px] pb-[20px]">
                            <div className={isSmall ? '' : 'min-w-[768px]'}>
                            <FullCalendar
                                ref={fcRef}
                                timeZone='America/New_York'
                                plugins={[ dayGridPlugin, interactionPlugin ]}

                                views={{
                                    threeDay: {
                                        type: 'dayGrid',
                                        duration: { days: 3 },
                                        buttonText: 'Days'
                                    }
                                }}

                                initialView={isSmall ? 'threeDay' : 'dayGridWeek'}
                                buttonText={{ month: 'Months', week: 'Weeks', day: 'Day', today: 'Today' }}
                                customButtons={{
                                    dayToday: {
                                        text: 'Today',
                                        click: () => {
                                            try {
                                                if (fcRef && fcRef.current && typeof fcRef.current.getApi === 'function') {
                                                    const api = fcRef.current.getApi();
                                                    api.today();
                                                    api.changeView('dayGridDay');
                                                }
                                            } catch (e) {
                                            }
                                        }
                                    }
                                }}

                                eventTimeFormat={{
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    meridiem: 'short'
                                }}
                                headerToolbar={isSmall ? {
                                    left: 'prev,next',
                                    center: 'title',
                                    right: 'threeDay,dayToday'
                                } : {
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,dayGridWeek,threeDay'
                                }}
                                dayHeaderFormat={{ weekday: 'short', month: 'numeric', day: 'numeric' }}
                                events={events}
                                eventClick={(info) => {
                                    info.jsEvent.preventDefault();
                                    window.location.href = info.event.url;
                                }}
                                height="auto"
                                contentHeight="auto"
                                aspectRatio={2.2}
                                eventContent={renderEventContent}
                            />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CalendarPage;