import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';
import { useColorScheme } from '../../hooks/useColorScheme';

function FilterBar({ tags, sortOrder, setSortOrder, sortMethod, setSortMethod, onFilterChange, filteredCount, isListView, setIsListView, showICS, onUnselectAll, onDownloadICS, selectedTags: externalSelectedTags }) {
    const [selectedTags, setSelectedTags] = useState(externalSelectedTags || []);
    const [selectedTime, setSelectedTime] = useState(['upcoming', 'today']);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    //const [isListView, setIsListView] = useState(false);
    const [selectedPostedBy, setSelectedPostedBy] = useState(["student", "rpi"]);
    const { isDark } = useColorScheme();

    const [isExternalUpdate, setIsExternalUpdate] = useState(false);

    // FIXED: Update internal state when external tags change, with flag to prevent cycles
    useEffect(() => {
        if (externalSelectedTags && JSON.stringify(externalSelectedTags) !== JSON.stringify(selectedTags)) {
            setIsExternalUpdate(true);
            setSelectedTags(externalSelectedTags);
        }
    }, [externalSelectedTags]);


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

    const handlePostedByChange = (poster) => {
        setSelectedPostedBy((prev) =>
            prev.includes(poster) ? prev.filter((p) => p !== poster) : [...prev, poster]
        );
    };

    const clearAll = () => {
        setSelectedTags([]);
        setSelectedTime([]);
    };

    useEffect(() => {
        if (isExternalUpdate) {
            setIsExternalUpdate(false);
            return;
        }
        
        onFilterChange({ 
            tags: selectedTags, 
            time: selectedTime, 
            postedBy: selectedPostedBy, 
            sortMethod, 
            sortOrder 
        });
    }, [selectedTags, selectedTime, selectedPostedBy, sortMethod, sortOrder, onFilterChange, isExternalUpdate]);


    const toggleDrawer = () => {
        setIsDrawerOpen((prev) => !prev);
    };

    const handleViewChange = (isList) => {
        if (isListView != isList) {
            setIsListView(isList);
            //changeView(isList);
        }
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
            <div className={`${styles.sidebar} ${isDrawerOpen ? styles.open : ''}`}>
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

                {/* --- NEW VIEW TOGGLE SWITCH --- */}
                <div className={`${styles.viewToggleContainer} ${isDark ? styles.dark : ''}`}>
                    <button
                        className={`${styles.viewToggleButton} ${isListView ? styles.active : ''}`}
                        onClick={() => setIsListView(true)}
                        aria-pressed={isListView}
                    >
                        <div className={styles['viewToggleButtonIndicator']}>
                            <div className={styles['viewToggleButtonIndicatorInner']}></div>
                        </div>
                        List View
                    </button>
                    <button
                        className={`${styles.viewToggleButton} ${!isListView ? styles.active : ''}`}
                        onClick={() => setIsListView(false)}
                        aria-pressed={!isListView}
                    >
                        <div className={styles['viewToggleButtonIndicator']}>
                            <div className={styles['viewToggleButtonIndicatorInner']}></div>
                        </div>
                        Grid View
                    </button>
                </div>
                {/* --- END OF VIEW TOGGLE SWITCH --- */}
                
                <div className={styles.separator}></div>

                <div className={styles.sortContainer}>
                    <div className={styles.sortOptionWrapper}>
                        <label htmlFor="sortMethod">Sort by:</label>
                        <br></br>
                        <select
                            id="sortMethod"
                            value={sortMethod}
                            onChange={(e) => setSortMethod(e.target.value)}
                        >
                            <option value="date" className="text-black dark:text-white">Date</option>
                            <option value="likes" className="text-black dark:text-white">Likes</option>
                            <option value="title" className="text-black dark:text-white">Title</option>
                        </select>
                        <br></br>
                        <label htmlFor="sortOrder">Order:</label>
                        <br></br>
                        <select
                            id="sortOrder"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="asc" className="text-black dark:text-white">Ascending</option>
                            <option value="desc" className="text-black dark:text-white">Descending</option>
                        </select>
                    </div>
                </div>
                <div className={styles.separator}></div>
                <div className={styles.filterSection}>
                    <h3 className={styles.filterBarTags}>Filtered Results: {filteredCount}</h3>
                </div>
                <div className={styles.separator}></div>

                <div className={styles.filterSection}>
                    <h3 className={styles.filterBarTags}>Time:</h3>
                    <div className={`${styles.toggleGroupContainer} ${isDark ? styles.dark : ''}`}>
                        {['past', 'upcoming', 'today'].map((time) => (
                            <button
                                key={time}
                                className={`${styles.filterButton} ${styles.blue} ${selectedTime.includes(time) ? styles.active : ''}`}
                                onClick={() => handleTimeChange(time)}
                            >
                                <div className={styles.filterButtonIndicator}>
                                    <div className={styles.filterButtonIndicatorInner}></div>
                                </div>
                                {time.charAt(0).toUpperCase() + time.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className={styles.separator}></div>

                    <h3 className={styles.filterBarTags}>Author:</h3>
                    <div className={`${styles.toggleGroupContainer} ${isDark ? styles.dark : ''}`}>
                        <button
                            className={`${styles.filterButton} ${styles.green} ${selectedPostedBy.includes("student") ? styles.active : ''}`}
                            onClick={() => handlePostedByChange("student")}
                        >
                             <div className={styles.filterButtonIndicator}>
                                <div className={styles.filterButtonIndicatorInner}></div>
                            </div>
                            Student
                        </button>
                        <button
                            className={`${styles.filterButton} ${styles.green} ${selectedPostedBy.includes("rpi") ? styles.active : ''}`}
                            onClick={() => handlePostedByChange("rpi")}
                        >
                             <div className={styles.filterButtonIndicator}>
                                <div className={styles.filterButtonIndicatorInner}></div>
                            </div>
                            RPI
                        </button>
                    </div>

                    <div className={styles.separator}></div>
                    <h3 className={styles.filterBarTags}>Tags:</h3>
                    <div className={`${styles.toggleGroupContainer} ${isDark ? styles.dark : ''}`}>
                        {tags.sort().map((tag) => (
                            <button
                                key={tag}
                                className={`${styles.filterButton} ${styles.orange} ${selectedTags.includes(tag) ? styles.active : ''}`}
                                onClick={() => handleTagChange(tag)}
                            >
                                 <div className={styles.filterButtonIndicator}>
                                    <div className={styles.filterButtonIndicatorInner}></div>
                                </div>
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.separator}></div>
                <button onClick={clearAll} className={styles.clearButton}>Clear All Filters</button>
            </div>
        </>
    );

}

export default FilterBar;