import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';
import { useColorScheme } from '../../hooks/useColorScheme';

function FilterBar({ tags, sortOrder, setSortOrder, sortMethod, setSortMethod, onFilterChange, filteredCount, changeView, showICS, onUnselectAll, onDownloadICS, selectedTags: externalSelectedTags }) {
    // Preserve existing state management
    const [selectedTags, setSelectedTags] = useState(externalSelectedTags || []);
    const [selectedTime, setSelectedTime] = useState(['upcoming', 'today']);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isListView, setIsListView] = useState(false);
    const [selectedPostedBy, setSelectedPostedBy] = useState(["student", "rpi"]);
    const { isDark } = useColorScheme();
    const [isExternalUpdate, setIsExternalUpdate] = useState(false);

    // New state for radio button selections
    const [timeFilter, setTimeFilter] = useState('future');
    const [posterFilter, setPosterFilter] = useState('student');
    const [eventType, setEventType] = useState('all');

    // Update internal state when external tags change
    useEffect(() => {
        if (externalSelectedTags && JSON.stringify(externalSelectedTags) !== JSON.stringify(selectedTags)) {
            setIsExternalUpdate(true);
            setSelectedTags(externalSelectedTags);
        }
    }, [externalSelectedTags]);

    // Handle tag selection (keep existing functionality)
    const handleTagChange = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    // Map selected time radio button to existing functionality
    const handleTimeFilterChange = (newFilter) => {
        setTimeFilter(newFilter);
        
        // Update time filters to match existing functionality
        if (newFilter === 'future') {
            setSelectedTime(['upcoming']);
        } else if (newFilter === 'present') {
            setSelectedTime(['today']);
        } else if (newFilter === 'past') {
            setSelectedTime(['past']);
        }
    };

    // Map selected poster radio button to existing functionality
    const handlePosterFilterChange = (newFilter) => {
        setPosterFilter(newFilter);
        
        if (newFilter === 'student') {
            setSelectedPostedBy(['student']);
        } else if (newFilter === 'rpi') {
            setSelectedPostedBy(['rpi']);
        }
    };

    // Send filter updates to parent component
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
            sortOrder,
            eventType: eventType !== 'all' ? [eventType] : []
        });
    }, [selectedTags, selectedTime, selectedPostedBy, eventType, sortMethod, sortOrder, onFilterChange, isExternalUpdate]);

    // Toggle drawer
    const toggleDrawer = () => {
        setIsDrawerOpen((prev) => !prev);
    };

    // Handle view change (keep existing functionality)
    const handleViewChange = () => {
        setIsListView((prev) => {
            const newValue = !prev;
            changeView(newValue);
            return newValue;
        });
    };

    // Clear all filters
    const clearAll = () => {
        setSelectedTags([]);
        setTimeFilter('future');
        setPosterFilter('student');
        setEventType('all');
        setSelectedTime(['upcoming']);
        setSelectedPostedBy(['student']);
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
            <div className={`${styles.sidebar} ${isDrawerOpen ? styles.open : ""}`}>
                {/* List/Grid View Selection (using radio buttons) */}
                <div className={styles.filterSection}>
                    <div className={styles.radioOption}>
                        <input 
                            type="radio" 
                            id="listView" 
                            name="viewMode" 
                            checked={isListView} 
                            onChange={() => handleViewChange()} 
                        />
                        <label htmlFor="listView">List View</label>
                    </div>
                    
                    <div className={styles.radioOption}>
                        <input 
                            type="radio" 
                            id="gridView" 
                            name="viewMode" 
                            checked={!isListView} 
                            onChange={() => handleViewChange()} 
                        />
                        <label htmlFor="gridView">Grid View</label>
                    </div>
                </div>

                {/* Sort Options */}
                <div className={styles.sortContainer}>
                    <label htmlFor="sortMethod">Sort By:</label>
                    <select
                        id="sortMethod"
                        value={sortMethod}
                        onChange={(e) => setSortMethod(e.target.value)}
                    >
                        <option value="date">Date</option>
                        <option value="likes">Likes</option>
                        <option value="title">Title</option>
                    </select>
                    
                    <label htmlFor="sortOrder">Order:</label>
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
                
                {/* Filtered Results Count */}
                <div className={styles.filterSection}>
                    <h3 className={styles.filterBarTags}>Filtered Results: {filteredCount}</h3>
                </div>

                <div className={styles.separator}></div>

                {/* Time Filter (using radio buttons) */}
                <div className={styles.filterSection}>
                    <h3 className={styles.filterBarTags}>Time:</h3>
                    <div className={styles.radioOption}>
                        <input 
                            type="radio" 
                            id="future" 
                            name="timeFilter" 
                            checked={timeFilter === 'future'} 
                            onChange={() => handleTimeFilterChange('future')} 
                        />
                        <label htmlFor="future">Future</label>
                    </div>
                    
                    <div className={styles.radioOption}>
                        <input 
                            type="radio" 
                            id="present" 
                            name="timeFilter" 
                            checked={timeFilter === 'present'} 
                            onChange={() => handleTimeFilterChange('present')} 
                        />
                        <label htmlFor="present">Present</label>
                    </div>
                    
                    <div className={styles.radioOption}>
                        <input 
                            type="radio" 
                            id="past" 
                            name="timeFilter" 
                            checked={timeFilter === 'past'} 
                            onChange={() => handleTimeFilterChange('past')} 
                        />
                        <label htmlFor="past">Past</label>
                    </div>
                </div>

                <div className={styles.separator}></div>

                {/* Posted By (using radio buttons) */}
                <div className={styles.filterSection}>
                    <h3 className={styles.filterBarTags}>Posted by:</h3>
                    <div className={styles.radioOption}>
                        <input 
                            type="radio" 
                            id="studentPoster" 
                            name="posterFilter" 
                            checked={posterFilter === 'student'} 
                            onChange={() => handlePosterFilterChange('student')} 
                        />
                        <label htmlFor="studentPoster">Student</label>
                    </div>
                    
                    <div className={styles.radioOption}>
                        <input 
                            type="radio" 
                            id="rpiPoster" 
                            name="posterFilter" 
                            checked={posterFilter === 'rpi'} 
                            onChange={() => handlePosterFilterChange('rpi')} 
                        />
                        <label htmlFor="rpiPoster">RPI</label>
                    </div>
                </div>

                <div className={styles.separator}></div>

                {/* Event Type Filter (new from Figma) */}
                <div className={styles.filterSection}>
                    <h3 className={styles.filterBarTags}>Type:</h3>
                    <div className={styles.radioOption}>
                        <input 
                            type="radio" 
                            id="allEvents" 
                            name="eventType" 
                            checked={eventType === 'all'} 
                            onChange={() => setEventType('all')} 
                        />
                        <label htmlFor="allEvents">Club Event</label>
                    </div>
                    
                    <div className={styles.radioOption}>
                        <input 
                            type="radio" 
                            id="sportsEvents" 
                            name="eventType" 
                            checked={eventType === 'sports'} 
                            onChange={() => setEventType('sports')} 
                        />
                        <label htmlFor="sportsEvents">Sports</label>
                    </div>
                    
                    <div className={styles.radioOption}>
                        <input 
                            type="radio" 
                            id="greekLifeEvents" 
                            name="eventType" 
                            checked={eventType === 'greek'} 
                            onChange={() => setEventType('greek')} 
                        />
                        <label htmlFor="greekLifeEvents">Greek Life</label>
                    </div>
                    
                    <div className={styles.radioOption}>
                        <input 
                            type="radio" 
                            id="freeFood" 
                            name="eventType" 
                            checked={eventType === 'food'} 
                            onChange={() => setEventType('food')} 
                        />
                        <label htmlFor="freeFood">Free food</label>
                    </div>
                    
                    <div className={styles.radioOption}>
                        <input 
                            type="radio" 
                            id="creativeEvents" 
                            name="eventType" 
                            checked={eventType === 'creative'} 
                            onChange={() => setEventType('creative')} 
                        />
                        <label htmlFor="creativeEvents">Creative</label>
                    </div>
                </div>

                <div className={styles.separator}></div>

                {/* Tag Filters (keep existing functionality) */}
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

                {/* ICS Download Options */}
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

                {/* Clear All Button */}
                <button onClick={clearAll} className={styles.clearButton}>Clear All</button>
            </div>
        </>
    );
}

export default FilterBar;