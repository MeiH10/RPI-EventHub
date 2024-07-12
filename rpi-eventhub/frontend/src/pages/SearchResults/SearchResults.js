// src/pages/SearchResults/SearchResults.jsx

import React from 'react';
import { useLocation } from 'react-router-dom';
import EventPoster from '../../components/EventPosterOnly/EventPoster'; // Adjust the import path if necessary
import styles from './SearchResults.module.css';
import Navbar from "../../components/Navbar/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../../components/Footer/Footer';

const SearchResults = () => {
    const location = useLocation();
    const { results } = location.state || { results: [] };

    return (
        <div >
            <Navbar />
        <div className={styles.container }>
            
            <div className={styles.titleContainer}>
                <h1 className={styles.title}>Events that match your search</h1>
            </div>
            <div className={styles.eventsContainer}>
                {results.length > 0 ? (
                    results.map(event => (
                        <EventPoster
                            key={event._id}
                            title={event.title}
                            posterSrc={event.image || 'https://via.placeholder.com/300x450'}
                            description={event.description}
                            width={300}
                            height={450}
                            author={event.poster}
                            tags={event.tags}


                        />
                    ))
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
