import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Employee/Profile';
import Attendance from './pages/Employee/Attendance';
import EmployeeList from './pages/HR/EmployeeList';
import EmployeePayroll from './pages/Employee/EmployeePayroll';
import EmployeeLeavePage from './pages/Employee/EmployeeLeavePage';
import PayrollManagement from './pages/HR/PayrollManagement';
import HRAttendance from './pages/HR/HRAttendance';
import HRLeaveManagement from './pages/HR/HRLeaveManagement';
import HRJobPosting from './pages/HR/HRJobPosting';
import HREmployeeDetails from './pages/HR/HREmployeeDetails';
import HRRecruitment from './pages/HR/HRRecruitment';
import HRApplicantDetails from './pages/HR/HRApplicantDetails';
import AdminUserList from './pages/Admin/AdminUserList';
import AdminCompanyList from './pages/Admin/AdminCompanyList';
import AdminJobPosting from './pages/Admin/AdminJobPosting';
import AdminJobDetail from './pages/Admin/AdminJobDetails';
import AdminUserDetails from './pages/Admin/AdminUserDetails';
import OwnerEmployeeList from './pages/Owner/OwnerEmployeeList';

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
      <Toaster position="bottom-right" />
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
            <Route path="leaves" element={<EmployeeLeavePage/>} />
            <Route path="payroll" element={<EmployeePayroll/>} />
            
            {/* HR Routes */}
            <Route path="employees" element={<EmployeeList/>} />
            <Route path="/employee-details/:employeeId" element={<HREmployeeDetails />} />
            <Route path="attendance-overview" element={<HRAttendance/>} />
            <Route path="leave-management" element={<HRLeaveManagement/>} />
            <Route path="payroll-management" element={<PayrollManagement/>} />
            <Route path="job-post" element={<HRJobPosting/>} />
            <Route path="/recruitment" element={<HRRecruitment />} />
            <Route path="/applicant-details/:applicantId" element={<HRApplicantDetails />} />
            
            {/* Admin Routes */}
            <Route path="user-records" element={<AdminUserList/>} />
            <Route path="company-records" element={<AdminCompanyList/>} />
            <Route path="job-postings" element={<AdminJobPosting/>} />
            <Route path="/job-details/:id" element={<AdminJobDetail />} />
            <Route path="/user-details/:id" element={<AdminUserDetails />} />
          
            {/*Owner Routes*/}
            <Route path='/owner-emp-list' element={<OwnerEmployeeList/>}/>
            
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;