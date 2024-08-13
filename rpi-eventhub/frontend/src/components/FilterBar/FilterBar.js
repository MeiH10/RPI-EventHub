import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';

function FilterBar({ tags, onFilterChange, filteredCount }) {
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedTime, setSelectedTime] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);  // State to control the drawer

    const handleTagChange = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleTimeChange = (time) => {
        setSelectedTime((prev) =>
            prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
        );
    };

    const clearAll = () => {
        setSelectedTags([]);
        setSelectedTime([]);
    };

    useEffect(() => {
        onFilterChange({ tags: selectedTags, time: selectedTime });
    }, [selectedTags, selectedTime, onFilterChange]);

    const toggleDrawer = () => {
        setIsDrawerOpen(prevState => !prevState);
    };

    return (
        <>
            <button className={styles.drawerToggleBtn} onClick={toggleDrawer}>
                {isDrawerOpen ? 'Close Filters' : 'Open Filters'}
            </button>
            <div className={`${styles.sidebar} ${isDrawerOpen ? styles.open : ''}`}>
                <div className={styles.filterSection}>
                    <h3 className={styles.filterBarTags}>Filtered Results: {filteredCount}</h3>
                </div>
                <div className={styles.separator}></div>
                <div className={styles.filterSection}>
                    <h3 className={styles.filterBarTags}>By Tags</h3>
                    {tags.sort().map((tag) => (
                        <div key={tag} className={styles.checkboxWrapper}>
                            <input
                                type="checkbox"
                                id={tag}
                                value={tag}
                                checked={selectedTags.includes(tag)}
                                onChange={() => handleTagChange(tag)}
                            />
                            <label htmlFor={tag} className={styles.filterBarTags}>{tag}</label>
                        </div>
                    ))}
                </div>
                <div className={styles.separator}></div>
                <div className={styles.filterSection}>
                    <h3 className={styles.filterBarTags}>By Time</h3>
                    {['past', 'upcoming', 'today'].map((time) => (
                        <div key={time} className={styles.checkboxWrapper}>
                            <input
                                type="checkbox"
                                id={time}
                                value={time}
                                checked={selectedTime.includes(time)}
                                onChange={() => handleTimeChange(time)}
                            />
                            <label className={styles.filterBarTags} htmlFor={time}>{time.charAt(0).toUpperCase() + time.slice(1)}</label>
                        </div>
                    ))}
                </div>
                <div className={styles.separator}></div>
                <button onClick={clearAll} className={styles.clearButton}>Clear All</button>
            </div>
        </>
    );
}

export default FilterBar;
