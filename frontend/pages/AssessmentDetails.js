import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssessmentById, submitAssessment } from '../services/assessmentService';
import { formatError } from '../utils/errorHandler';

const AssessmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const data = await getAssessmentById(id);
        setAssessment(data);
        
        // Initialize answers object
        const initialAnswers = {};
        data.questions.forEach((question, index) => {
          initialAnswers[index] = '';
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setError(formatError(err));
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssessment();
  }, [id]);
  
  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentQuestion]: e.target.value
    });
  };
  
  const goToNextQuestion = () => {
    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = Object.keys(answers).filter(index => !answers[index]);
    if (unansweredQuestions.length > 0) {
      setError(`Please answer all questions before submitting. ${unansweredQuestions.length} questions remain unanswered.`);
      return;
    }
    
    setSubmitting(true);
    try {
      // Format the answers for submission
      const formattedAnswers = Object.keys(answers).map(index => ({
        questionId: assessment.questions[index]._id,
        response: answers[index]
      }));
      
      const result = await submitAssessment(id, formattedAnswers);
      navigate(`/assessment-results/${result._id}`);
    } catch (err) {
      setError(formatError(err));
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading assessment...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  if (!assessment) {
    return <div className="not-found">Assessment not found</div>;
  }
  
  const question = assessment.questions[currentQuestion];
  
  return (
    <div className="assessment-details-page">
      <h2>{assessment.title}</h2>
      
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${((currentQuestion + 1) / assessment.questions.length) * 100}%` }}
        />
        <span className="progress-text">
          Question {currentQuestion + 1} of {assessment.questions.length}
        </span>
      </div>
      
      <div className="question-card">
        <h3 className="question-text">{question.text}</h3>
        
        <div className="answer-options">
          {question.type === 'multipleChoice' ? (
            question.options.map((option, index) => (
              <div key={index} className="answer-option">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={answers[currentQuestion] === option}
                  onChange={handleAnswerChange}
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))
          ) : question.type === 'scale' ? (
            <div className="scale-container">
              <span className="scale-label">{question.scaleLabels.start}</span>
              <div className="scale-options">
                {[1, 2, 3, 4, 5].map(value => (
                  <div key={value} className="scale-option">
                    <input
                      type="radio"
                      id={`scale-${value}`}
                      name={`question-${currentQuestion}`}
                      value={value}
                      checked={answers[currentQuestion] === value.toString()}
                      onChange={handleAnswerChange}
                    />
                    <label htmlFor={`scale-${value}`}>{value}</label>
                  </div>
                ))}
              </div>
              <span className="scale-label">{question.scaleLabels.end}</span>
            </div>
          ) : (
            <textarea
              value={answers[currentQuestion] || ''}
              onChange={handleAnswerChange}
              placeholder="Type your answer here..."
              rows={4}
            />
          )}
        </div>
        
        <div className="question-navigation">
          <button 
            className="btn btn-outline" 
            onClick={goToPreviousQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          
          {currentQuestion < assessment.questions.length - 1 ? (
            <button 
              className="btn btn-primary" 
              onClick={goToNextQuestion}
              disabled={!answers[currentQuestion]}
            >
              Next
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={submitting || !answers[currentQuestion]}
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentDetails;