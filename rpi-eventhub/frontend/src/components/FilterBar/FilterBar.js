import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';

function FilterBar({ tags, onFilterChange, filteredCount }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTime, setSelectedTime] = useState([]);

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

  return (
    <div className={styles.sidebar}>
      <div className={styles.filterSection}>
        <h3>Filtered Results: {filteredCount}</h3>
      </div>
      <div className={styles.separator}></div>
      <div className={styles.filterSection}>
        <h3>By Tags</h3>
        {tags.map((tag) => (
          <div key={tag} className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              id={tag}
              value={tag}
              checked={selectedTags.includes(tag)}
              onChange={() => handleTagChange(tag)}
            />
            <label htmlFor={tag}>{tag}</label>
          </div>
        ))}
      </div>
      <div className={styles.separator}></div>
      <div className={styles.filterSection}>
        <h3>By Time</h3>
        {['past', 'upcoming', 'today'].map((time) => (
          <div key={time} className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              id={time}
              value={time}
              checked={selectedTime.includes(time)}
              onChange={() => handleTimeChange(time)}
            />
            <label htmlFor={time}>{time.charAt(0).toUpperCase() + time.slice(1)}</label>
          </div>
        ))}
      </div>
      <div className={styles.separator}></div>
      <button onClick={clearAll} className={styles.clearButton}>Clear All</button>
    </div>
  );
}

export default FilterBar;
