const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/users/login`,
  REGISTER: `${API_BASE_URL}/users/register`,
  PROFILE: `${API_BASE_URL}/users/profile`,
  
  // Career endpoints
  CAREERS: `${API_BASE_URL}/careers`,
  CAREER_DETAILS: (id) => `${API_BASE_URL}/careers/${id}`,
  CAREER_RECOMMENDATIONS: `${API_BASE_URL}/careers/recommendations`,
  SAVED_CAREERS: `${API_BASE_URL}/users/savedCareers`,
  
  // Assessment endpoints
  ASSESSMENTS: `${API_BASE_URL}/assessments`,
  ASSESSMENT_DETAILS: (id) => `${API_BASE_URL}/assessments/${id}`,
  SUBMIT_ASSESSMENT: (id) => `${API_BASE_URL}/assessments/${id}/submit`,
  ASSESSMENT_RESULTS: `${API_BASE_URL}/users/assessmentResults`,
};

export default API_ENDPOINTS;