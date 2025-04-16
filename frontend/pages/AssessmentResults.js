import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserAssessmentResults } from '../services/assessmentService';
import { getCareerRecommendations } from '../services/careerService';
import { formatError } from '../utils/errorHandler';

const AssessmentResults = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch the specific assessment result
        const results = await getUserAssessmentResults();
        const currentResult = results.find(r => r._id === id);
        
        if (currentResult) {
          setResult(currentResult);
          
          // Fetch career recommendations based on result
          const careerRecommendations = await getCareerRecommendations({
            assessmentResultId: id
          });
          
          setRecommendations(careerRecommendations);
        } else {
          setError('Assessment result not found');
        }
      } catch (err) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [id]);
  
  if (loading) {
    return <div className="loading">Loading assessment results...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!result) {
    return <div className="not-found">Result not found</div>;
  }
  
  return (
    <div className="assessment-results-page">
      <h2>Your Assessment Results</h2>
      
      <div className="result-summary">
        <h3>{result.assessment.title} - Summary</h3>
        <p className="completion-date">
          Completed on {new Date(result.createdAt).toLocaleDateString()}
        </p>
        
        <div className="result-strengths">
          <h4>Your Top Strengths</h4>
          <ul>
            {result.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        
        <div className="result-categories">
          {result.categoryScores.map((category, index) => (
            <div key={index} className="category-score">
              <span className="category-name">{category.name}</span>
              <div className="score-bar-container">
                <div 
                  className="score-bar" 
                  style={{ width: `${category.score}%` }}
                />
                <span className="score-value">{category.score}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="career-recommendations">
        <h3>Recommended Careers</h3>
        <p>Based on your assessment results, these careers might be a good match for you:</p>
        
        <div className="recommendation-list">
          {recommendations.map(career => (
            <div key={career._id} className="recommendation-card">
              <h4>{career.title}</h4>
              <p className="match-score">
                {career.matchScore}% match with your profile
              </p>
              <p className="recommendation-description">
                {career.description.substring(0, 100)}...
              </p>
              <Link to={`/careers/${career._id}`} className="btn btn-secondary">
                View Career Details
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      <div className="next-steps">
        <h3>Next Steps</h3>
        <div className="steps-container">
          <div className="step">
            <h4>1. Explore Recommendations</h4>
            <p>Click on any recommended career to learn more about the role, requirements, and outlook.</p>
          </div>
          <div className="step">
            <h4>2. Take Another Assessment</h4>
            <p>Complete more assessments to get a more comprehensive profile.</p>
            <Link to="/assessments" className="btn btn-outline">View Assessments</Link>
          </div>
          <div className="step">
            <h4>3. Save Interesting Careers</h4>
            <p>Bookmark careers that interest you to revisit them later.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;