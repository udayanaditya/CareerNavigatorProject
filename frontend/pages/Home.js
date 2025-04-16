import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Discover Your Dream Career</h1>
        <p>Find the perfect career path based on your skills, interests, and values.</p>
        
        {user ? (
          <div className="action-buttons">
            <Link to="/assessments" className="btn btn-primary">Take an Assessment</Link>
            <Link to="/careers" className="btn btn-secondary">Explore Careers</Link>
          </div>
        ) : (
          <div className="action-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
          </div>
        )}
      </div>
      
      <div className="features-section">
        <div className="feature">
          <h3>Personalized Assessments</h3>
          <p>Take our specialized assessments to discover your strengths, interests, and values.</p>
        </div>
        <div className="feature">
          <h3>Career Matching</h3>
          <p>Get matched with careers that align with your unique profile and preferences.</p>
        </div>
        <div className="feature">
          <h3>Detailed Insights</h3>
          <p>Learn about salary ranges, required education, job outlook, and more for each career.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;