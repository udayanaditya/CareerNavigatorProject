import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCareerById } from '../services/careerService';
import { saveCareer, removeSavedCareer } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { formatError } from '../utils/errorHandler';

const CareerDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  useEffect(() => {
    const fetchCareerDetails = async () => {
      try {
        const data = await getCareerById(id);
        setCareer(data);
        
        // Check if this career is in user's saved careers
        if (user && user.savedCareers) {
          setIsSaved(user.savedCareers.includes(id));
        }
      } catch (err) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchCareerDetails();
  }, [id, user]);
  
  const handleSaveCareer = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    try {
      if (isSaved) {
        await removeSavedCareer(id);
        setIsSaved(false);
      } else {
        await saveCareer(id);
        setIsSaved(true);
      }
    } catch (err) {
      setError(formatError(err));
    } finally {
      setSaveLoading(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading career details...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!career) {
    return <div className="not-found">Career not found</div>;
  }
  
  return (
    <div className="career-details-page">
      <div className="career-header">
        <h2>{career.title}</h2>
        {user && (
          <button 
            className={`btn ${isSaved ? 'btn-outline' : 'btn-primary'}`}
            onClick={handleSaveCareer}
            disabled={saveLoading}
          >
            {saveLoading 
              ? 'Processing...' 
              : isSaved
                ? 'Saved ✓'
                : 'Save Career'
            }
          </button>
        )}
      </div>
      
      <div className="career-meta">
        <span className="career-category">{career.category}</span>
        <span className="career-salary">${career.averageSalary.toLocaleString()} avg. annual salary</span>
        <span className="career-outlook">{career.jobOutlook}% job growth</span>
      </div>
      
      <div className="career-section">
        <h3>Description</h3>
        <p>{career.description}</p>
      </div>
      
      <div className="career-section">
        <h3>Key Responsibilities</h3>
        <ul>
          {career.keyResponsibilities.map((responsibility, index) => (
            <li key={index}>{responsibility}</li>
          ))}
        </ul>
      </div>
      
      <div className="career-section">
        <h3>Required Skills</h3>
        <div className="skills-tags">
          {career.requiredSkills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
      
      <div className="career-section">
        <h3>Education Requirements</h3>
        <p>{career.educationRequirements.join(', ')}</p>
      </div>
      
      <div className="career-section">
        <h3>Similar Careers</h3>
        <div className="similar-careers">
          {career.relatedCareers && career.relatedCareers.map((relatedCareer, index) => (
            <Link key={index} to={`/careers/${relatedCareer._id}`} className="related-career-link">
              {relatedCareer.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerDetails;
