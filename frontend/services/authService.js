import axiosInstance from '../utils/axiosConfig';
import API_ENDPOINTS from '../config/api';
import { formatError, logError } from '../utils/errorHandler';

export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    
    if (response.data) {
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    logError(error, 'loginUser');
    throw new Error(formatError(error));
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, userData);
    
    if (response.data) {
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    
    return response.data;
  } catch (error) {
    logError(error, 'registerUser');
    throw new Error(formatError(error));
  }
};

export const logoutUser = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userInfo');
};

export const getCurrentUser = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};