import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Employee/Profile';
import Attendance from './pages/Employee/Attendance';
import EmployeeList from './pages/HR/EmployeeList';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="attendance" element={<Attendance />} />
            
            {/* Employee Routes */}
            <Route path="leaves" element={<div className='text-emerald-500 text-2xl font-bold text-center'>Leave Management (Employee)</div>} />
            <Route path="payroll" element={<div className='text-emerald-500 text-2xl font-bold text-center'>Payroll (Employee)</div>} />
            
            {/* HR Routes */}
            <Route path="employees" element={<EmployeeList/>} />
            <Route path="attendance-overview" element={<div className='text-emerald-500 text-2xl font-bold text-center'>Attendance Overview (HR)</div>} />
            <Route path="leave-management" element={<div className='text-emerald-500 text-2xl font-bold text-center'>Leave Management (HR)</div>} />
            <Route path="payroll-management" element={<div className='text-emerald-500 text-2xl font-bold text-center'>Payroll Management (HR)</div>} />
            <Route path="recruitment" element={<div className='text-emerald-500 text-2xl font-bold text-center'>Recruitment (HR)</div>} />
            <Route path="reports" element={<div className='text-emerald-500 text-2xl font-bold text-center'>Reports (HR)</div>} />
            
            {/* Admin Routes */}
            <Route path="employee-records" element={<div className='text-emerald-500 text-2xl font-bold text-center'>Employee Records (Admin)</div>} />
            <Route path="job-postings" element={<div className='text-emerald-500 text-2xl font-bold text-center'>Job Postings (Admin)</div>} />
            <Route path="system-controls" element={<div className='text-emerald-500 text-2xl font-bold text-center'>System Controls (Admin)</div>} />
            <Route path="company-settings" element={<div className='text-emerald-500 text-2xl font-bold text-center'>Company Settings (Admin)</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;