import axiosInstance from '../utils/axiosConfig';
import API_ENDPOINTS from '../config/api';
import { formatError, logError } from '../utils/errorHandler';

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.PROFILE);
    return response.data;
  } catch (error) {
    logError(error, 'getUserProfile');
    throw new Error(formatError(error));
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.PROFILE, userData);
    
    // Update localStorage with new user info
    if (response.data) {
      const currentUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const updatedUserInfo = { ...currentUserInfo, ...response.data };
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    }
    
    return response.data;
  } catch (error) {
    logError(error, 'updateUserProfile');
    throw new Error(formatError(error));
  }
};

export const getSavedCareers = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.SAVED_CAREERS);
    return response.data;
  } catch (error) {
    logError(error, 'getSavedCareers');
    throw new Error(formatError(error));
  }
};

export const saveCareer = async (careerId) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.SAVED_CAREERS, {
      careerId,
    });
    return response.data;
  } catch (error) {
    logError(error, 'saveCareer');
    throw new Error(formatError(error));
  }
};

export const removeSavedCareer = async (careerId) => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.SAVED_CAREERS}/${careerId}`);
    return response.data;
  } catch (error) {
    logError(error, 'removeSavedCareer');
    throw new Error(formatError(error));
  }
};