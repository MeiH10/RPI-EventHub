import React from 'react';
import './AllEvents.css';
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import EventPoster from "../../../components/EventPosterOnly/EventPoster";

const events = [
    {
        id: 1,
        title: 'RPI Osu! Club Tournament',
        posterSrc: 'https://i.imgur.com/x09xD4c.jpeg',
        description: 'Join us for the ultimate Osu! showdown on July 27th, 2024; from 6pm to 8pm at the McKinney Room, Union.'
    },
    {
        id: 2,
        title: 'RPI Chess Club Finals',
        posterSrc: 'https://venngage-wordpress-gallery.s3.amazonaws.com/uploads/2018/09/Bike-To-Work-Day-Creative-Horizontal-Event-Flyer-Example4.jpg',
        description: 'Witness the grand finals of the RPI Chess Club on August 15th, 2024; from 2pm to 5pm at the Union Games Room.'
    },
    {
        id: 3,
        title: 'Tech Talks',
        posterSrc: 'https://media.discordapp.net/attachments/665684489174777884/1196944218229309541/RPI_Chess_Tournament_Jan_27.png?ex=663170ab&is=661efbab&hm=57d8dd02b652839e5dcf4fb2d0094a34c1175c96d013dde1efb2cb470a8e5484&=&format=webp&quality=lossless&width=521&height=675',
        description: 'Explore the latest in technology innovations.'
    },
    {
        id: 4,
        title: 'Art Exhibition',
        posterSrc: 'https://via.placeholder.com/320x480',
        description: 'A display of stunning contemporary art pieces.'
    },
    {
        id: 5,
        title: 'Music Festival',
        posterSrc: 'https://via.placeholder.com/340x510',
        description: 'A weekend of music from top bands and new artists.'
    },
    {
        id: 6,
        title: 'Film Screening',
        posterSrc: 'https://via.placeholder.com/360x540',
        description: 'An evening of groundbreaking films.'
    },
    {
        id: 7,
        title: 'Comedy Night',
        posterSrc: 'https://via.placeholder.com/380x420',
        description: 'Laugh out loud with the country\'s best comedians.'
    },
    {
        id: 8,
        title: 'Poetry Slam',
        posterSrc: 'https://via.placeholder.com/400x600',
        description: 'An intimate night of poetry readings.'
    },
    {
        id: 9,
        title: 'Hackathon',
        posterSrc: 'https://via.placeholder.com/420x630',
        description: 'A contest of creativity and coding skill.'
    },
    {
        id: 10,
        title: 'Science Fair',
        posterSrc: 'https://via.placeholder.com/440x660',
        description: 'A showcase of scientific discovery and research.'
    },
    {
        id: 11,
        title: 'Cooking Class',
        posterSrc: 'https://via.placeholder.com/460x490',
        description: 'Learn new recipes and cooking techniques.'
    },
    {
        id: 12,
        title: 'Book Reading',
        posterSrc: 'https://via.placeholder.com/480x720',
        description: 'Join authors reading excerpts from their latest works.'
    }
];


function AllEvents() {
    const scaleFactor = 0.75;

    return (
        <div className="all-events">
            <Navbar />
            <div className="events-display-container">
                {events.map(event => (
                    <EventPoster
                        key={event.id}
                        title={event.title}
                        posterSrc={event.posterSrc}
                        description={event.description}
                        width={event.width}
                        height={event.height}
                        scale={scaleFactor}
                    />
                ))}
            </div>
            <Footer />
        </div>
    );
}

export default AllEvents;