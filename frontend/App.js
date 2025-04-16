import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CareerList from './pages/CareerList';
import CareerDetails from './pages/CareerDetails';
import AssessmentList from './pages/AssessmentList';
import AssessmentDetails from './pages/AssessmentDetails';
import AssessmentResults from './pages/AssessmentResults';
import SavedCareers from './pages/SavedCareers';

// Layout components (these would be created separately)
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/careers" element={<CareerList />} />
              <Route path="/careers/:id" element={<CareerDetails />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/assessments" element={<AssessmentList />} />
                <Route path="/assessments/:id" element={<AssessmentDetails />} />
                <Route path="/assessment-results/:id" element={<AssessmentResults />} />
                <Route path="/saved-careers" element={<SavedCareers />} />
              </Route>

              {/* Catch-all Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;