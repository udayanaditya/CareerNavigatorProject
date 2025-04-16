import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    // Redirect to the login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;