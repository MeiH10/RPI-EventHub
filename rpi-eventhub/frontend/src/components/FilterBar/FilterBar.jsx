import React, { useState, useEffect } from 'react';
import { useColorScheme } from '../../hooks/useColorScheme';

function FilterBar({ tags, sortOrder, setSortOrder, sortMethod, setSortMethod, onFilterChange, filteredCount, changeView, showICS, onUnselectAll, onDownloadICS, selectedTags: externalSelectedTags }) {
    const [selectedTags, setSelectedTags] = useState(externalSelectedTags || []);
    const [selectedTime, setSelectedTime] = useState(['upcoming', 'today']);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isListView, setIsListView] = useState(false);
    const [selectedPostedBy, setSelectedPostedBy] = useState(["student", "rpi"]);
    const { isDark } = useColorScheme();
    
    // Additional state for event types
    const [selectedEventTypes, setSelectedEventTypes] = useState(['club']);

    const [isExternalUpdate, setIsExternalUpdate] = useState(false);

    // Handle external tag updates
    useEffect(() => {
        if (externalSelectedTags && JSON.stringify(externalSelectedTags) !== JSON.stringify(selectedTags)) {
            setIsExternalUpdate(true);
            setSelectedTags(externalSelectedTags);
        }
    }, [externalSelectedTags]);

    // Handle view toggle
    const handleViewChange = (view) => {
        const newValue = view === 'list';
        setIsListView(newValue);
        changeView(newValue);
    };

    // Handle time checkbox
    const handleTimeChange = (time) => {
        setSelectedTime((prev) =>
            prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
        );
    };

    // Handle posted by checkbox
    const handlePostedByChange = (poster) => {
        setSelectedPostedBy((prev) =>
            prev.includes(poster) ? prev.filter((p) => p !== poster) : [...prev, poster]
        );
    };

    // Handle event type checkbox
    const handleEventTypeChange = (type) => {
        setSelectedEventTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    // Handle tag selection
    const handleTagChange = (tag) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    // Clear all filters
    const clearAll = () => {
        setSelectedTags([]);
        setSelectedTime([]);
        setSelectedPostedBy([]);
        setSelectedEventTypes([]);
    };

    // Update filters
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
            eventType: selectedEventTypes
        });
    }, [selectedTags, selectedTime, selectedPostedBy, selectedEventTypes, sortMethod, sortOrder, onFilterChange, isExternalUpdate]);

    // Toggle drawer for mobile
    const toggleDrawer = () => {
        setIsDrawerOpen((prev) => !prev);
    };

    // Custom checkbox component that looks like original design
    const CustomCheckbox = ({ isChecked, label, onChange }) => (
        <div className="flex items-center mb-2 cursor-pointer" onClick={onChange}>
            <div className="relative w-6 h-6 mr-3">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-white"></div>
                {isChecked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-2 border-b-2 border-l-2 border-white transform rotate-[-45deg] translate-y-[-25%]"></div>
                    </div>
                )}
            </div>
            <span className="text-white text-lg">{label}</span>
        </div>
    );

    return (
        <>
            {/* Mobile toggle button */}
            <button 
                className="hidden md:hidden fixed top-14 right-3 z-50 p-3 bg-[#AB2328] text-white rounded-lg"
                onClick={toggleDrawer}
            >
                ☰
            </button>
            
            {/* Main filter sidebar - using relative positioning to stay in place */}
            <div className="w-[270px] bg-[#AB2328] text-white rounded-lg p-4 relative mt-[150px]">
                {/* View toggle (List/Grid) */}
                <div className="bg-white rounded p-4 mb-4">
                    <div className="flex items-center mb-2" onClick={() => handleViewChange('list')}>
                        <div className={`w-6 h-6 rounded-full mr-3 ${isListView ? 'bg-[#AB2328]' : 'border-2 border-[#AB2328]'} flex items-center justify-center`}>
                            {isListView && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                        </div>
                        <span className="text-black text-lg">List View</span>
                    </div>
                    <div className="flex items-center" onClick={() => handleViewChange('grid')}>
                        <div className={`w-6 h-6 rounded-full mr-3 ${!isListView ? 'bg-[#AB2328]' : 'border-2 border-[#AB2328]'} flex items-center justify-center`}>
                            {!isListView && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                        </div>
                        <span className="text-black text-lg">Grid View</span>
                    </div>
                </div>
                
                {/* Sort By */}
                <div className="mb-2">
                    <p className="text-white text-lg mb-1">Sort By:</p>
                    <div className="relative">
                        <select 
                            className="w-full appearance-none bg-[#AB2328] border border-white text-white py-2 px-4 rounded cursor-pointer"
                            value={sortMethod}
                            onChange={(e) => setSortMethod(e.target.value)}
                        >
                            <option value="likes">Likes</option>
                            <option value="date">Date</option>
                            <option value="title">Title</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                            ▼
                        </div>
                    </div>
                </div>
                
                {/* Order */}
                <div className="mb-6">
                    <p className="text-white text-lg mb-1">Order:</p>
                    <div className="relative">
                        <select 
                            className="w-full appearance-none bg-[#AB2328] border border-white text-white py-2 px-4 rounded cursor-pointer"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="desc">Descending</option>
                            <option value="asc">Ascending</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                            ▼
                        </div>
                    </div>
                </div>
                
                {/* Filtered Results */}
                <p className="text-white text-lg mb-4">Filtered Results: {filteredCount}</p>
                
                {/* White separator line */}
                <div className="h-px bg-white w-full my-4"></div>
                
                {/* Time Section - With Checkboxes */}
                <div className="mb-6">
                    <p className="text-white text-2xl mb-3">By Time</p>
                    
                    <div 
                        className="flex items-center mb-2 cursor-pointer" 
                        onClick={() => handleTimeChange('past')}
                    >
                        <div className="relative w-6 h-6 mr-3">
                            <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                            {selectedTime.includes('past') && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-2 border-b-2 border-l-2 border-white transform rotate-[-45deg] translate-y-[-25%]"></div>
                                </div>
                            )}
                        </div>
                        <span className="text-white text-lg">Past</span>
                    </div>
                    
                    <div 
                        className="flex items-center mb-2 cursor-pointer" 
                        onClick={() => handleTimeChange('upcoming')}
                    >
                        <div className="relative w-6 h-6 mr-3">
                            <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                            {selectedTime.includes('upcoming') && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-2 border-b-2 border-l-2 border-white transform rotate-[-45deg] translate-y-[-25%]"></div>
                                </div>
                            )}
                        </div>
                        <span className="text-white text-lg">Upcoming</span>
                    </div>
                    
                    <div 
                        className="flex items-center mb-2 cursor-pointer" 
                        onClick={() => handleTimeChange('today')}
                    >
                        <div className="relative w-6 h-6 mr-3">
                            <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                            {selectedTime.includes('today') && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-2 border-b-2 border-l-2 border-white transform rotate-[-45deg] translate-y-[-25%]"></div>
                                </div>
                            )}
                        </div>
                        <span className="text-white text-lg">Today</span>
                    </div>
                </div>
                
                {/* White separator line */}
                <div className="h-px bg-white w-full my-4"></div>
                
                {/* Posted by Section - With Checkboxes */}
                <div className="mb-6">
                    <p className="text-white text-2xl mb-3">Posted by</p>
                    
                    <div 
                        className="flex items-center mb-2 cursor-pointer" 
                        onClick={() => handlePostedByChange('student')}
                    >
                        <div className="relative w-6 h-6 mr-3">
                            <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                            {selectedPostedBy.includes('student') && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-2 border-b-2 border-l-2 border-white transform rotate-[-45deg] translate-y-[-25%]"></div>
                                </div>
                            )}
                        </div>
                        <span className="text-white text-lg">Student</span>
                    </div>
                    
                    <div 
                        className="flex items-center mb-2 cursor-pointer" 
                        onClick={() => handlePostedByChange('rpi')}
                    >
                        <div className="relative w-6 h-6 mr-3">
                            <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                            {selectedPostedBy.includes('rpi') && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-2 border-b-2 border-l-2 border-white transform rotate-[-45deg] translate-y-[-25%]"></div>
                                </div>
                            )}
                        </div>
                        <span className="text-white text-lg">RPI</span>
                    </div>
                </div>
                
                {/* White separator line */}
                <div className="h-px bg-white w-full my-4"></div>
                
                {/* Event Type Section - With Checkboxes */}
                <div className="mb-6">
                    <p className="text-white text-2xl mb-3">Type</p>
                    
                    <div 
                        className="flex items-center mb-2 cursor-pointer" 
                        onClick={() => handleEventTypeChange('club')}
                    >
                        <div className="relative w-6 h-6 mr-3">
                            <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                            {selectedEventTypes.includes('club') && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-2 border-b-2 border-l-2 border-white transform rotate-[-45deg] translate-y-[-25%]"></div>
                                </div>
                            )}
                        </div>
                        <span className="text-white text-lg">Club Event</span>
                    </div>
                    
                    <div 
                        className="flex items-center mb-2 cursor-pointer" 
                        onClick={() => handleEventTypeChange('sports')}
                    >
                        <div className="relative w-6 h-6 mr-3">
                            <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                            {selectedEventTypes.includes('sports') && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-2 border-b-2 border-l-2 border-white transform rotate-[-45deg] translate-y-[-25%]"></div>
                                </div>
                            )}
                        </div>
                        <span className="text-white text-lg">Sports</span>
                    </div>
                    
                    <div 
                        className="flex items-center mb-2 cursor-pointer" 
                        onClick={() => handleEventTypeChange('greek')}
                    >
                        <div className="relative w-6 h-6 mr-3">
                            <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                            {selectedEventTypes.includes('greek') && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-2 border-b-2 border-l-2 border-white transform rotate-[-45deg] translate-y-[-25%]"></div>
                                </div>
                            )}
                        </div>
                        <span className="text-white text-lg">Greek Life</span>
                    </div>
                    
                    <div 
                        className="flex items-center mb-2 cursor-pointer" 
                        onClick={() => handleEventTypeChange('food')}
                    >
                        <div className="relative w-6 h-6 mr-3">
                            <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                            {selectedEventTypes.includes('food') && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-2 border-b-2 border-l-2 border-white transform rotate-[-45deg] translate-y-[-25%]"></div>
                                </div>
                            )}
                        </div>
                        <span className="text-white text-lg">Free Food</span>
                    </div>
                    
                    <div 
                        className="flex items-center mb-2 cursor-pointer" 
                        onClick={() => handleEventTypeChange('creative')}
                    >
                        <div className="relative w-6 h-6 mr-3">
                            <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                            {selectedEventTypes.includes('creative') && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-2 border-b-2 border-l-2 border-white transform rotate-[-45deg] translate-y-[-25%]"></div>
                                </div>
                            )}
                        </div>
                        <span className="text-white text-lg">Creative</span>
                    </div>
                </div>
                
                {/* White separator line */}
                <div className="h-px bg-white w-full my-4"></div>
                
                {/* By Tags */}
                <div className="mb-6">
                    <p className="text-white text-2xl mb-3">By Tags</p>
                    
                    <div className="max-h-[240px] overflow-y-auto pr-1">
                        {tags.sort().map((tag) => (
                            <div 
                                key={tag} 
                                className="flex items-center mb-2 cursor-pointer"
                                onClick={() => handleTagChange(tag)}
                            >
                                <div className="relative w-6 h-6 mr-3">
                                    <div className="w-6 h-6 rounded-full border-2 border-white"></div>
                                    {selectedTags.includes(tag) && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-4 h-2 border-b-2 border-l-2 border-white transform rotate-[-45deg] translate-y-[-25%]"></div>
                                        </div>
                                    )}
                                </div>
                                <span className="text-white text-lg">{tag}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* White separator line */}
                <div className="h-px bg-white w-full my-4"></div>
                
                {/* Clear All Button */}
                <button 
                    onClick={clearAll} 
                    className="w-full bg-white text-[#AB2328] py-3 rounded text-xl font-medium"
                >
                    Clear All
                </button>
                
                {/* ICS Download Options */}
                {showICS && (
                    <div className="mt-4">
                        <button 
                            className="w-full bg-white text-[#AB2328] py-2 rounded mb-2"
                            onClick={onDownloadICS}
                        >
                            Download ICS
                        </button>
                        <button
                            className="w-full bg-white text-[#AB2328] py-2 rounded"
                            onClick={onUnselectAll}
                        >
                            Unselect All
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default FilterBar;