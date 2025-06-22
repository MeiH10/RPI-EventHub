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
                        className={`${styles.viewToggleButton} ${!isListView ? styles.active : ''}`}
                        onClick={() => setIsListView(false)}
                        aria-pressed={!isListView}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3A1.5 1.5 0 0 1 15 10.5v3A1.5 1.5 0 0 1 13.5 15h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                        </svg>
                        Grid
                    </button>
                    <button
                        className={`${styles.viewToggleButton} ${isListView ? styles.active : ''}`}
                        onClick={() => setIsListView(true)}
                        aria-pressed={isListView}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                        List
                    </button>
                </div>
                {/* --- END OF VIEW TOGGLE SWITCH --- */}
                
                <div className={styles.sortContainer}>
                    <label htmlFor="sortMethod">Sort by</label>
                    <select
                        id="sortMethod"
                        value={sortMethod}
                        onChange={(e) => setSortMethod(e.target.value)}
                    >
                        <option value="date" className="text-black dark:text-white">Date</option>
                        <option value="likes" className="text-black dark:text-white">Likes</option>
                        <option value="title" className="text-black dark:text-white">Title</option>
                    </select>
                    <label htmlFor="sortOrder">Order</label>
                    <select
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="asc" className="text-black dark:text-white">Ascending</option>
                        <option value="desc" className="text-black dark:text-white">Descending</option>
                    </select>
                </div>
                <div className={styles.separator}></div>
                <div className={styles.filterSection}>
                    <h3 className={styles.filterBarTags}>Filtered Results: {filteredCount}</h3>
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

                    <div className={styles.separator}></div>

                    <h3 className={styles.filterBarTags}>Posted by</h3>
                    <div className={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            id="student"
                            value="student"
                            checked={selectedPostedBy.includes("student")}
                            onChange={() => handlePostedByChange("student")}
                        />
                        <label htmlFor="student" className={styles.filterBarTags}>Student</label>
                    </div>
                    <div className={styles.checkboxWrapper}>
                        <input
                            type="checkbox"
                            id="rpi"
                            value="rpi"
                            checked={selectedPostedBy.includes("rpi")}
                            onChange={() => handlePostedByChange("rpi")}
                        />
                        <label htmlFor="rpi" className={styles.filterBarTags}>RPI</label>
                    </div>

                    <div className={styles.separator}></div>
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
                <button onClick={clearAll} className={styles.clearButton}>Clear All</button>
            </div>
        </>
    );

}

export default FilterBar;