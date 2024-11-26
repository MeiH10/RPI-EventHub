import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../../components/Navbar/Navbar";
import Footer from '../../components/Footer/Footer';
import EventCard from '../../components/EventCard/EventCard';
import Masonry from 'react-masonry-css';
import styles from './SearchResults.module.css';

const SearchResults = () => {
  const location = useLocation();
  const { results } = location.state || { results: [] };
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto p-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">Events that match your search</h1>
        </div>
        <div>
          {results.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex -ml-4 w-auto"
              columnClassName="pl-4 bg-clip-padding"
            >
              {results.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </Masonry>
          ) : (
            <p className="text-center text-xl">No events match your search.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;