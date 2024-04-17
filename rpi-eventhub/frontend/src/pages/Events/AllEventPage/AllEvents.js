import React from 'react';
import './AllEvents.css';
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import EventPoster from "../../../components/EventPosterOnly/EventPoster";

const events = [
    {
        id: 1,
        title: 'RPI Osu! Club Tournament',
        posterSrc: 'https://media.discordapp.net/attachments/1031967779613577216/1223416822791934054/Fall_24_Invatational.png?ex=662c3bb4&is=6619c6b4&hm=a826dd3d39b9e2a9b3d256675b34ee9b97f1106eafaac8fb026d634198ab12a2&=&format=webp&quality=lossless&width=518&height=671',
        description: 'Join us for the ultimate Osu! showdown on July 27th, 2024; from 6pm to 8pm at the McKinney Room, Union.'
    },
    {
        id: 2,
        title: 'RPI Chess Club Finals',
        posterSrc: 'https://media.discordapp.net/attachments/665684489174777884/1196944218229309541/RPI_Chess_Tournament_Jan_27.png?ex=663170ab&is=661efbab&hm=57d8dd02b652839e5dcf4fb2d0094a34c1175c96d013dde1efb2cb470a8e5484&=&format=webp&quality=lossless&width=521&height=675',
        description: 'Witness the grand finals of the RPI Chess Club on August 15th, 2024; from 2pm to 5pm at the Union Games Room.'
    },
    {
        id: 3,
        title: 'Tech Talks',
        posterSrc: 'https://cdn.discordapp.com/attachments/1031967779613577216/1222692630656454766/TROY_EARTH_DAY_CELEBRATION_POSTER.png?ex=6629993f&is=6617243f&hm=ae2d353da0fd1a3dfef0e20685d55177e8c0e2a85a79eca1fb51f8d5ba1c8797&',
        description: 'Explore the latest in technology innovations.'
    },
    {
        id: 4,
        title: 'Art Exhibition',
        posterSrc: 'https://media.discordapp.net/attachments/1031967779613577216/1228509108198445127/Nerdy_Bake_Sale_Poster.png?ex=662c4d43&is=6619d843&hm=a81ae172face00bacfc524fa7e7b0747da9d344243b0feaf3406420a5e4b98c5&=&format=webp&quality=lossless&width=474&height=671',
        description: 'A display of stunning contemporary art pieces.'
    },
    {
        id: 5,
        title: 'Music Festival',
        posterSrc: 'https://media.discordapp.net/attachments/1033092383287554160/1228786902350692393/acapocalypse7_adjusted.png?ex=662d4ffb&is=661adafb&hm=346bf00ec0cb2acc20ed0bb08c8b0d1abb3d33c8e13f3ebbe32048e80192247d&=&format=webp&quality=lossless&width=297&height=385',
        description: 'A weekend of music from top bands and new artists.'
    },
    {
        id: 6,
        title: 'Film Screening',
        posterSrc: 'https://cdn.discordapp.com/attachments/1033092383287554160/1227386872980832286/golem_poster_v2.png?ex=6631729a&is=661efd9a&hm=a8d303d422cf916448ea58a56fd218307126eaf5621e7da81df405b9ad7878bb&',
        description: 'An evening of groundbreaking films.'
    },
    {
        id: 7,
        title: 'Comedy Night',
        posterSrc: 'https://media.discordapp.net/attachments/896193766791196692/1227076461354025020/image.png?ex=66305182&is=661ddc82&hm=41b968965e07709a9d2ea7ae32efbeb3a8f50ce14f7d809a67e9de31e41d5865&=&format=webp&quality=lossless&width=509&height=669',
        description: 'Laugh out loud with the country\'s best comedians.'
    },
    {
        id: 8,
        title: 'Poetry Slam',
        posterSrc: 'https://cdn.discordapp.com/attachments/1033092383287554160/1225833201721675886/LOST_IN_SPACE.png?ex=662bcba2&is=661956a2&hm=ca56b515ff59b6a1a9e15913e6d2ef3e1d617e1567b2c6ad9399f29d95728db3&',
        description: 'An intimate night of poetry readings.'
    },
    {
        id: 9,
        title: 'Hackathon',
        posterSrc: 'https://media.discordapp.net/attachments/1209673292739514378/1219854704352301056/CANDIDATE_DEBATES_GMUP_1.png?ex=6631bb39&is=661f4639&hm=6a8045caf3a490eddfe7331823b53fd810cad01cb98b2570f0fafc0ea5839384&=&format=webp&quality=lossless&width=518&height=671',
        description: 'A contest of creativity and coding skill.'
    },
    {
        id: 10,
        title: 'Science Fair',
        posterSrc: 'https://media.discordapp.net/attachments/1033092383287554160/1219248535770366003/gm_week_flier_1.webp?ex=662f86af&is=661d11af&hm=aa7c8ad75a1c65d7fcdf3c64f477ab8ce869eaae618f2d78aabb11725a9a6308&=&format=webp&width=518&height=671',
        description: 'A showcase of scientific discovery and research.'
    },
    {
        id: 11,
        title: 'Cooking Class',
        posterSrc: 'https://media.discordapp.net/attachments/1033092383287554160/1209347910865649675/Hockey_night_flyer_feb_23_2024.jpg?ex=66306c02&is=661df702&hm=87647e824c521df7007025b358e8571a8be3607731b029f1feab391a8fc550d5&=&format=webp&width=474&height=671',
        description: 'Learn new recipes and cooking techniques.'
    },
    {
        id: 12,
        title: 'Book Reading',
        posterSrc: 'https://media.discordapp.net/attachments/1033092383287554160/1207508599920664608/Monthly_Standard_Average.png?ex=6629bb04&is=66174604&hm=34a2f484169237e542aea6e0cf6d626a1e7681c0d08a7f0199d99b2d0777a5d4&=&format=webp&quality=lossless&width=502&height=671',
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