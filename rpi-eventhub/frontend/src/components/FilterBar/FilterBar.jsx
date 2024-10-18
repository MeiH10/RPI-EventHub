import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';

function FilterBar({ tags, onFilterChange, filteredCount, changeView, showICS, onUnselectAll, onDownloadICS }) {
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedTime, setSelectedTime] = useState(['upcoming', 'today']);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [sortMethod, setSortMethod] = useState('likes');
    const [sortOrder, setSortOrder] = useState('desc');
    const [isListView, setIsListView] = useState(false);

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
        onFilterChange({ tags: selectedTags, time: selectedTime, sortMethod, sortOrder });
    }, [selectedTags, selectedTime, sortMethod, sortOrder, onFilterChange]);

    const toggleDrawer = () => {
        setIsDrawerOpen((prev) => !prev);
    };

    const handleViewChange = () => {
        setIsListView((prev) => {
            const newValue = !prev;
            changeView(newValue);
            return newValue;
        });
    };

    return (
        <>
            <button className={styles.drawerToggleBtn} onClick={toggleDrawer}>
                <div className={`${styles.iconWrapper} ${isDrawerOpen ? styles.iconOpen : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                         className={styles.filterIcon} viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path
                            d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                         className={styles.closeIcon} viewBox="0 0 16 16">
                        <path d="M2 2 L14 14 M14 2 L2 14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </div>
            </button>
            <div className={`${styles.sidebar} ${isDrawerOpen ? styles.open : ``}`}>
                {showICS && (
                    <div>
                        <div className='hover:shadow cursor-pointer duration-100 px-3 py-2 bg-white rounded-sm flex justify-center items-center' onClick={onDownloadICS}>
                            <p className='text-md text-black m-0'>Download ICS</p>
                        </div>
                        <div className='hover:shadow cursor-pointer duration-100 px-3 py-2 my-2 bg-red-500 rounded-sm flex justify-center items-center'
                            onClick={onUnselectAll}
                        >
                            <p className='text-md m-0'>Unselect All</p>
                        </div>
                    </div>
                )}
                <div className={styles.changeButton} onClick={handleViewChange}>
                    {isListView ?
                        <div>
                            <i className="bi bi-columns-gap">
                            </i>
                            <span>Grid View </span>
                        </div>
                        :
                        <div>
                            <i className="bi bi-list-nested">
                            </i>
                            <span>List View </span>
                        </div>
                    }
                </div>
                <div className={styles.sortContainer}>
                    <label htmlFor="sortMethod">Sort by</label>
                    <select
                        id="sortMethod"
                        value={sortMethod}
                        onChange={(e) => setSortMethod(e.target.value)}
                    >
                        <option value="date">Date</option>
                        <option value="likes">Likes</option>
                        <option value="title">Title</option>
                    </select>
                    <label htmlFor="sortOrder">Order</label>
                    <select
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                <div className={styles.separator}></div>
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
                            <label className={styles.filterBarTags}
                                   htmlFor={time}>{time.charAt(0).toUpperCase() + time.slice(1)}</label>
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
