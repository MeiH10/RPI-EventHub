import styles from './Banner.module.css';
import { Link } from 'react-router-dom';

function Banner() {
    return (
        <div className={styles.banner}>
            <h1>ALL EVENTS, IN ONE PLACE.</h1>
            <div className={styles.searchBarContainer}>
                <input className={styles.searchInput} type="text" placeholder="Search for an event!" />
                <button className={styles.searchButton}>Search</button>
            </div>
            <div>
                <h2><Link to="/all-events">See all events</Link></h2>
            </div>
        </div>
    );
}

export default Banner;
