import axiosInstance from '../utils/axiosConfig';
import API_ENDPOINTS from '../config/api';
import { formatError, logError } from '../utils/errorHandler';

export const getAllAssessments = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ASSESSMENTS);
    return response.data;
  } catch (error) {
    logError(error, 'getAllAssessments');
    throw new Error(formatError(error));
  }
};

export const getAssessmentById = async (id) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ASSESSMENT_DETAILS(id));
    return response.data;
  } catch (error) {
    logError(error, 'getAssessmentById');
    throw new Error(formatError(error));
  }
};

export const submitAssessment = async (id, answers) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.SUBMIT_ASSESSMENT(id),
      { answers }
    );
    return response.data;
  } catch (error) {
    logError(error, 'submitAssessment');
    throw new Error(formatError(error));
  }
};

export const getUserAssessmentResults = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.ASSESSMENT_RESULTS);
    return response.data;
  } catch (error) {
    logError(error, 'getUserAssessmentResults');
    throw new Error(formatError(error));
  }
};