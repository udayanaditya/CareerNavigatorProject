import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllAssessments } from '../services/assessmentService';
import { formatError } from '../utils/errorHandler';

const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await getAllAssessments();
        setAssessments(data);
      } catch (err) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssessments();
  }, []);
  
  if (loading) {
    return <div className="loading">Loading assessments...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="assessment-list-page">
      <h2>Career Assessments</h2>
      <p className="page-description">
        Take our specialized assessments to discover careers that match your skills, interests, and values.
      </p>
      
      <div className="assessment-grid">
        {assessments.map(assessment => (
          <div key={assessment._id} className="assessment-card">
            <h3>{assessment.title}</h3>
            <p className="assessment-type">{assessment.type}</p>
            <p className="assessment-description">{assessment.description}</p>
            <div className="assessment-meta">
              <span>{assessment.questions.length} questions</span>
              <span>{assessment.estimatedTime} minutes</span>
            </div>
            <Link to={`/assessments/${assessment._id}`} className="btn btn-primary">
              Start Assessment
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentList;