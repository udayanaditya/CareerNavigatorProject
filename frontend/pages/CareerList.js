import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCareers } from '../services/careerService';
import { formatError } from '../utils/errorHandler';

const CareerList = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    educationLevel: '',
    salary: ''
  });
  
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const data = await getAllCareers();
        setCareers(data);
      } catch (err) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchCareers();
  }, []);
  
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };
  
  const applyFilters = () => {
    // This would typically be handled with a server-side filter
    // For now, we'll do client-side filtering
    
    let filteredCareers = [...careers];
    
    if (filters.search) {
      filteredCareers = filteredCareers.filter(career => 
        career.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        career.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category) {
      filteredCareers = filteredCareers.filter(career => 
        career.category === filters.category
      );
    }
    
    if (filters.educationLevel) {
      filteredCareers = filteredCareers.filter(career => 
        career.educationRequirements.includes(filters.educationLevel)
      );
    }
    
    if (filters.salary) {
      // Example: filters.salary could be "50000-75000"
      const [min, max] = filters.salary.split('-').map(Number);
      filteredCareers = filteredCareers.filter(career => 
        career.averageSalary >= min && career.averageSalary <= max
      );
    }
    
    return filteredCareers;
  };
  
  const filteredCareers = filters.search || filters.category || filters.educationLevel || filters.salary
    ? applyFilters()
    : careers;
  
  if (loading) {
    return <div className="loading">Loading careers...</div>;
  }
  
  return (
    <div className="career-list-page">
      <h2>Explore Careers</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            name="search"
            placeholder="Search careers..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="business">Business</option>
            <option value="education">Education</option>
            <option value="creative">Creative Arts</option>
            <option value="trades">Skilled Trades</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="educationLevel">Education Level</label>
          <select
            id="educationLevel"
            name="educationLevel"
            value={filters.educationLevel}
            onChange={handleFilterChange}
          >
            <option value="">All Levels</option>
            <option value="high school">High School</option>
            <option value="certificate">Certificate</option>
            <option value="associate">Associate's Degree</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="doctorate">Doctorate</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="salary">Salary Range</label>
          <select
            id="salary"
            name="salary"
            value={filters.salary}
            onChange={handleFilterChange}
          >
            <option value="">All Ranges</option>
            <option value="0-30000">Under $30,000</option>
            <option value="30000-50000">$30,000 - $50,000</option>
            <option value="50000-75000">$50,000 - $75,000</option>
            <option value="75000-100000">$75,000 - $100,000</option>
            <option value="100000-999999">$100,000+</option>
          </select>
        </div>
      </div>
      
      <div className="career-grid">
        {filteredCareers.length > 0 ? (
          filteredCareers.map(career => (
            <div key={career._id} className="career-card">
              <h3>{career.title}</h3>
              <p className="career-category">{career.category}</p>
              <p className="career-salary">${career.averageSalary.toLocaleString()} avg. salary</p>
              <p className="career-description">{career.description.substring(0, 120)}...</p>
              <Link to={`/careers/${career._id}`} className="btn btn-secondary">View Details</Link>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No careers match your current filters. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerList;