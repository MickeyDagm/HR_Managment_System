import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Attendance from './pages/IndividualAttendance';
import EmployeeList from './pages/EmployeeList';
import EmployeePayroll from './pages/IndividualPayrollPage';
import EmployeeLeavePage from './pages/IndividualLeaveRequest';
import PayrollManagement from './pages/PayrollManagement';
import HRAttendance from './pages/AttendanceManagement';
import HRLeaveManagement from './pages/LeaveManagement';
import HRJobPosting from './pages/JobPosting';
import HREmployeeDetails from './pages/EmployeeDetails';
import HRRecruitment from './pages/ApplicantList';
import HRApplicantDetails from './pages/ApplicantDetails';
import AdminUserList from './pages/Admin/AdminUserList';
import AdminCompanyList from './pages/Admin/AdminCompanyList';
import AdminJobPosting from './pages/Admin/AdminJobPosting';
import AdminJobDetail from './pages/Admin/AdminJobDetails';
import AdminUserDetails from './pages/Admin/AdminUserDetails';
import PremiumFeatureMessage from './pages/PremiumFeaturesPage';
import AdminPermissions from './pages/Admin/AdminPermission';
import AllUserDashboard from './pages/AllUserDashboard'
import PaymentPage from './pages/PaymentPage';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-[#72c02c] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xl text-black font-medium">Loading...</p>
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
    <>
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
              <Route path="dashboard" element={<AllUserDashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="attendance" element={<Attendance />} />
              
              {/* Employee Routes */}
              <Route path="leaves" element={<EmployeeLeavePage/>} />
              <Route path="payroll" element={<EmployeePayroll/>} />

              <Route path='permissions' element={<AdminPermissions/>}/>
              
              {/* HR Routes */}
              <Route path="employees" element={<EmployeeList/>} />
              <Route path="/employee-details/:employeeId" element={<HREmployeeDetails />} />
              <Route path="attendance-overview" element={<HRAttendance/>} />
              <Route path="leave-management" element={<HRLeaveManagement/>} />
              <Route path="payroll-management" element={<PayrollManagement/>} />
              <Route path="job-post" element={<HRJobPosting/>} />
              <Route path="/recruitment" element={<HRRecruitment />} />
              <Route path="/applicant-details/:applicantId" element={<HRApplicantDetails />} />
                  
              <Route path="user-records" element={<AdminUserList/>} />
              <Route path="company-records" element={<AdminCompanyList/>} />
              <Route path="job-postings" element={<AdminJobPosting/>} />
              <Route path="/job-details/:id" element={<AdminJobDetail />} />
              <Route path="/user-details/:id" element={<AdminUserDetails />} />

              <Route path='/premium' element={<PremiumFeatureMessage/>}/>  

              <Route path='/payment' element={<PaymentPage/>}/>

            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      <p className='text-sm text-center mb-3'><em>Powered By</em> <span className='text-[#72c02c] font-bold'>GEEZ WEB TECHNOLOGIES</span></p>
    </>
  );
};

export default App;