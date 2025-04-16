/**
 * Format and handle API errors consistently
 * @param {Error} error - The error object from axios or elsewhere
 * @returns {String} Formatted error message
 */
export const formatError = (error) => {
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        return error.response.data.message;
      }
      return error.response.data;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };
  
  /**
   * Log errors for development purposes
   */
  export const logError = (error, source) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Error in ${source}:`, error);
    }
  };