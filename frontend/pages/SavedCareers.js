import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSavedCareers, removeSavedCareer } from '../services/userService';
import { formatError } from '../utils/errorHandler';

const SavedCareers = () => {
  const [savedCareers, setSavedCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchSavedCareers = async () => {
      try {
        const data = await getSavedCareers();
        setSavedCareers(data);
      } catch (err) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedCareers();
  }, []);
  
  const handleRemoveCareer = async (careerId) => {
    try {
      await removeSavedCareer(careerId);
      setSavedCareers(savedCareers.filter(career => career._id !== careerId));
    } catch (err) {
      setError(formatError(err));
    }
  };
  
  if (loading) {
    return <div className="loading">Loading your saved careers...</div>;
  }
  
  return (
    <div className="saved-careers-page">
      <h2>Your Saved Careers</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {savedCareers.length === 0 ? (
        <div className="empty-state">
          <p>You haven't saved any careers yet.</p>
          <Link to="/careers" className="btn btn-primary">Explore Careers</Link>
        </div>
      ) : (
        <div className="career-grid">
          {savedCareers.map(career => (
            <div key={career._id} className="career-card">
              <h3>{career.title}</h3>
              <p className="career-category">{career.category}</p>
              <p className="career-salary">${career.averageSalary.toLocaleString()} avg. salary</p>
              <p className="career-description">{career.description.substring(0, 100)}...</p>
              <div className="card-actions">
                <Link to={`/careers/${career._id}`} className="btn btn-secondary">
                  View Details
                </Link>
                <button 
                  onClick={() => handleRemoveCareer(career._id)}
                  className="btn btn-outline btn-remove"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedCareers;