import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';

function FilterBar({ tags, onFilterChange, filteredCount }) {
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedTime, setSelectedTime] = useState('');

    const handleTagChange = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    useEffect(() => {
        onFilterChange({ tags: selectedTags, time: selectedTime });
    }, [selectedTags, selectedTime, onFilterChange]);

    return (
        <div className={styles.sidebar}>
            <h2>Filters</h2>
            <div className={styles.filterSection}>
                <h3>Filtered Results: {filteredCount}</h3>
            </div>
            <div className={styles.filterSection}>
                <h3>Tags</h3>
                {tags.map((tag) => (
                    <div key={tag} className={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            id={tag}
                            value={tag}
                            onChange={() => handleTagChange(tag)}
                        />
                        <label htmlFor={tag}>{tag}</label>
                    </div>
                ))}
            </div>
            <div className={styles.filterSection}>
                <h3>Time</h3>
                <select onChange={handleTimeChange} value={selectedTime}>
                    <option value="">All</option>
                    <option value="past">Past Events</option>
                    <option value="upcoming">Upcoming Events</option>
                    <option value="today">Happening Today</option>


                </select>
            </div>
        </div>
    );
}

export default FilterBar;
