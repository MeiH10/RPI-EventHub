import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';
import './FilterBar.tailwind.css';
import { useColorScheme } from '../../hooks/useColorScheme';

function FilterBar({ tags, sortOrder, setSortOrder, sortMethod, setSortMethod, onFilterChange, filteredCount, changeView, showICS, onUnselectAll, onDownloadICS }) {
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedTime, setSelectedTime] = useState(['upcoming', 'today']);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isListView, setIsListView] = useState(false);
    const { isDark } = useColorScheme();
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
           
            <button className='hidden p-4 bg-[var(--clear-button-bg-color)] text-[var(--clear-button-text-color)] border-0 cursor-pointer text-base fixed top-[55px] z-[999] rounded-lg m-0' onClick={toggleDrawer}>
                <div className={`${styles.iconWrapper} ${isDrawerOpen ? styles.iconOpen : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                         className='scale-100 opacity-100' viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path
                            d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                         className='scale-100 opacity-100' viewBox="0 0 16 16">
                        <path d="M2 2 L14 14 M14 2 L2 14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </div>
            </button>
            <div className="w-[300px] h-[600px] bg-[#AB2328] p-6 bg-[var(--sidebar-bg-color)] rounded-[10px] box-border sticky top-[14rem] z-[1000] font-[Afacad,'Helvetica Neue',sans-serif] overflow-y-auto overflow-x-hidden scrollbar-thin text-[22px]">
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
                <div className='px-2.5 py-2 w-max bg-[var(--clear-button-bg-color)] text-[var(--clear-button-text-color)] border-none rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-[var(--clear-button-hover-bg-color)] hover:text-white' onClick={handleViewChange}>
                    {isListView ?
                        <div>
                            <i className='text-base bg-[var(--clear-button-bg-color)] text-[var(--clear-button-text-color)] mr-2.5'>
                            </i>
                            <span className='text-base text-[var(--clear-button-text-color)]'>Grid View </span>
                        </div>
                        :
                        <div>
                            <i className='text-base bg-[var(--clear-button-bg-color)] text-[var(--clear-button-text-color)] mr-2.5'>
                            </i>
                            <span className='text-base text-[var(--clear-button-text-color)]'>List View </span>
                        </div>
                    }
                </div>
                <div className='bg-[#FFFFFF] pl-4 pr-4 pt-3 pb-3 font-[Afacad] rounded'>
                    <label className='' htmlFor="sortMethod">Sort by:</label><br></br>
                    <select className='bg-[#AB2328] rounded text-white pr-[150px]'
                        id="sortMethod"
                        value={sortMethod}
                        onChange={(e) => setSortMethod(e.target.value)}
                    >
                        <option value="date" className="text-black dark:text-white">Date</option>
                        <option value="likes" className="text-black dark:text-white">Likes</option>
                        <option value="title" className="text-black dark:text-white">Title</option>
                    </select><br></br>
                    <label className='' htmlFor="sortOrder">Order:</label><br></br>
                    <select className='bg-[#AB2328] rounded text-white pr-[90px]'
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="asc" className="text-black dark:text-white">Ascending</option>
                        <option value="desc" className="text-black dark:text-white">Descending</option>
                    </select>
                </div>
                <div className='h-px bg-[var(--separator-bg-color)] my-3'></div>
                <div className='mb-3 relative w-full'>
                    <h3 className='rounded-sm p-0 text-[1.1em] text-[var(--tags-label-color)] cursor-pointer font-[Afacad]' >Filtered Results: {filteredCount}</h3>
                </div>
                <div className='h-px bg-[var(--separator-bg-color)] my-3'></div>
                <div className='mb-3 relative w-full font-[Afacad]'>
                    <h3 className='rounded-sm p-0 text-[1.1em] text-[var(--tags-label-color)] cursor-pointer font-[Afacad]'>By Tags</h3>
                    {tags.sort().map((tag) => (
                        <div key={tag} className='flex items-start mb-2.5 w-full gap-2.5'>
                            <input
                                type="checkbox"
                                id={tag}
                                value={tag}
                                checked={selectedTags.includes(tag)}
                                onChange={() => handleTagChange(tag)}
                            />
                            <label htmlFor={tag} className='rounded-sm p-0 text-[1.1em] text-[var(--tags-label-color)] cursor-pointer'>{tag}</label>
                        </div>
                    ))}
                </div>
                <div className='h-px bg-[var(--separator-bg-color)] my-3'></div>
                <div className='mb-3 relative w-full font-[Afacad]'>
                    <h3 className='rounded-sm p-0 text-[1.1em] text-[var(--tags-label-color)] cursor-pointer font-[Afacad]'>By Time</h3>
                    {['past', 'upcoming', 'today'].map((time) => (
                        <div key={time} className='flex items-start mb-2.5 w-full gap-2.5'>
                            <input
                                type="checkbox"
                                id={time}
                                value={time}
                                checked={selectedTime.includes(time)}
                                onChange={() => handleTimeChange(time)}
                            />
                            <label className='rounded-sm p-0 text-[1.1em] text-[var(--tags-label-color)] cursor-pointer'
                                   htmlFor={time}>{time.charAt(0).toUpperCase() + time.slice(1)}</label>
                        </div>
                    ))}
                </div>
                <div className='h-px bg-[var(--separator-bg-color)] my-3'></div>
                <button onClick={clearAll} className='mt-3 px-5 py-2.5 bg-[var(--clear-button-bg-color)] text-[var(--clear-button-text-color)] border-none rounded cursor-pointer text-base hover:bg-[var(--clear-button-hover-bg-color)]'>Clear All</button>
            </div>
        </>
    );

}

export default FilterBar;