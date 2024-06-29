import React, { useState } from 'react';
import './FilterBar.css';

const Filter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onFilterChange(e.target.value, category);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    onFilterChange(searchTerm, e.target.value);
  };

  return (
    <div className="filter-container">
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="filter-search"
      />
      <select value={category} onChange={handleCategoryChange} className="filter-category">
        <option value="">All Categories</option>
        <option value="Sports">Sports</option>
        <option value="Music">Music</option>
        <option value="Tech">Tech</option>
        <option value="Art">Art</option>
        <option value="Academic">Academic</option>
        <option value="Workshop">Workshop</option>
        <option value="Greek Life">Greek Life</option>
        <option value="Free">Free</option>
        <option value="Food/Drink">Food/Drink</option>
        <option value="Conference">Conference</option>
        <option value="Career">Career</option>
      </select>
    </div>
  );
};

export default Filter;

