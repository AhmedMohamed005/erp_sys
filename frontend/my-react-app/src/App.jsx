import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './components/LoginPage';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import CompanyDashboard from './components/CompanyDashboard';
import UserDashboard from './components/UserDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route wrapper that reads from AuthContext (reactive state)
const ProtectedRoute = ({ allowedRole, children }) => {
  const { isAuthenticated, userRole } = useAuth();
  if (!isAuthenticated || userRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Redirect authenticated users to their dashboard
const AuthRedirect = () => {
  const { isAuthenticated, userRole } = useAuth();
  if (isAuthenticated) {
    if (userRole === 'super_admin') return <Navigate to="/super-admin" replace />;
    if (userRole === 'admin') return <Navigate to="/company-dashboard" replace />;
    if (userRole === 'user') return <Navigate to="/user-dashboard" replace />;
  }
  return <LoginPage />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthRedirect />} />
      <Route path="/login" element={<AuthRedirect />} />
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRole="super_admin">
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company-dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute allowedRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
