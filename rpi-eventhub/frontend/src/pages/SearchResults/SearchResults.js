// src/pages/SearchResults/SearchResults.jsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './SearchResults.module.css';
import Navbar from "../../components/Navbar/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../../components/Footer/Footer';
import EventCard from '../../components/EventCard/EventCard';
import Masonry from 'react-masonry-css';

const SearchResults = () => {
    const location = useLocation();
    const { results } = location.state || { results: [] };
    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    };
    return (
        <div className='outterContainer' >
            <Navbar />
        <div className={`${styles.container} container-fluid containerFluid`}>
            
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>Events that match your search</h1>
            </div>
            <div className={styles.eventsContainer}>





                {results.length > 0 ? (


                <Masonry
                breakpointCols={breakpointColumnsObj}
                className={styles.myMasonryGrid}
                columnClassName={styles.myMasonryGridColumn}
                >
                {results.map((event) => (
                    <EventCard key={event._id} event={event} />
                ))}
                </Masonry>




                ) : (
                    <p className={styles.noResults}>No events match your search.</p>
                )}
            </div>
        </div>
        <Footer></Footer>
    </div>
    );
};

export default SearchResults;
