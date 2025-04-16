import axiosInstance from '../utils/axiosConfig';
import API_ENDPOINTS from '../config/api';
import { formatError, logError } from '../utils/errorHandler';

export const getAllCareers = async (filters = {}) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.CAREERS, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    logError(error, 'getAllCareers');
    throw new Error(formatError(error));
  }
};

export const getCareerById = async (id) => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.CAREER_DETAILS(id));
    return response.data;
  } catch (error) {
    logError(error, 'getCareerById');
    throw new Error(formatError(error));
  }
};

export const getCareerRecommendations = async (userPreferences) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINTS.CAREER_RECOMMENDATIONS,
      userPreferences
    );
    return response.data;
  } catch (error) {
    logError(error, 'getCareerRecommendations');
    throw new Error(formatError(error));
  }
};