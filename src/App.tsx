import React, { Suspense, lazy }  from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
const Layout = lazy(()=> import('./components/Layout/Layout'));
const Login = lazy(()=> import('./pages/Login'));
const Profile = lazy(()=> import('./pages/Profile'));
const Attendance = lazy(()=> import('./pages/IndividualAttendance'));
const EmployeeList = lazy(()=> import('./pages/EmployeeList'));
const EmployeePayroll = lazy(()=> import('./pages/IndividualPayrollPage'));
const EmployeeLeavePage = lazy(()=> import('./pages/IndividualLeaveRequest'));
const PayrollManagement = lazy(()=> import('./pages/PayrollManagement'));
const HRAttendance = lazy(()=> import('./pages/AttendanceManagement'));
const HRLeaveManagement = lazy(()=> import('./pages/LeaveManagement'));
const HRJobPosting = lazy(()=> import('./pages/JobPosting'));
const HREmployeeDetails = lazy(()=> import('./pages/EmployeeDetails'));
const HRRecruitment = lazy(()=> import('./pages/ApplicantList'));
const HRApplicantDetails = lazy(()=> import('./pages/ApplicantDetails'));
const PremiumFeatureMessage = lazy(()=> import('./pages/PremiumFeaturesPage'));
const AdminPermissions = lazy(()=> import('./pages/AdminPermission'));
const AllUserDashboard = lazy(()=> import('./pages/AllUserDashboard'));
const PaymentPage = lazy(()=> import('./pages/PaymentPage'));
const NotFound = lazy(()=> import('./pages/NotFound'));
const LoadingPage = lazy(() => import('./pages/Loading'));

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
          <Suspense fallback={<LoadingPage />}>
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
                    
                {/* <Route path="user-records" element={<AdminUserList/>} />
                <Route path="company-records" element={<AdminCompanyList/>} />
                <Route path="job-postings" element={<AdminJobPosting/>} />
                <Route path="/job-details/:id" element={<AdminJobDetail />} />
                <Route path="/user-details/:id" element={<AdminUserDetails />} /> */}

                <Route path='/premium' element={<PremiumFeatureMessage/>}/>  

                <Route path='/payment' element={<PaymentPage/>}/>

                <Route path='*' element={<NotFound />} />

              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
      <p className='text-sm text-center mb-3'><em>Powered By</em> <span className='text-[#72c02c] font-bold'>GEEZ WEB TECHNOLOGIES</span></p>
    </>
  );
};

export default App;