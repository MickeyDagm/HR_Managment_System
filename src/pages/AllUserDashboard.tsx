import React from 'react';
import {
  Users,
  UserCheck,
  Calendar,
  Briefcase,
  Clock,
  Hourglass,
  Building2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  mockEmployees,
  mockJobPostings,
  mockCompanies,
  getPendingUsers,
  getPendingJobPosts,
  mockApplicants,
  mockAttendanceRecords,
  mockLeaveRequests,
  mockPayrollRecords,
  mockDepartment,
} from '../data/mockData';
import { Features } from '../types/features';
import { computeFinalPermissions } from '../types/levels';
import StatCard from '../components/UI/StatCard';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import { NavLink } from 'react-router-dom';
import HasPermission from '../components/Layout/HasPermission';
import { Helmet } from "react-helmet-async";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const employee = mockEmployees.find(emp => emp.id === user?.id);
  const userPermissions = employee
    ? computeFinalPermissions(employee.level || 'LEVEL_1', employee.customOverrides || [])
    : [];

  // === Admin Dashboard Calculations ===
  const totalEmployees = mockEmployees.length + mockApplicants.length;
  const totalCompanies = mockCompanies.length;
  const pendingApprovalUsers = getPendingUsers().length;
  const totalJobPosts = mockJobPostings.length;
  const pendingJobPosts = getPendingJobPosts().length;

  // === HR Dashboard Calculations ===
  const activeEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
  const today = new Date().toISOString().split('T')[0];
  const onLeave = mockLeaveRequests.filter(
    leave =>
      leave.status === 'approved' &&
      new Date(leave.startDate) <= new Date(today) &&
      new Date(leave.endDate) >= new Date(today)
  ).length;
  const lateToday = mockAttendanceRecords.filter(att => att.date === today && att.status === 'late').length;
  const pendingRequests = mockLeaveRequests.filter(leave => leave.status === 'pending').length;
  const openJobs = mockJobPostings.filter(job => job.status === 'active').length;

  // === Employee Dashboard Calculations ===
  const attendanceRecords = mockAttendanceRecords.filter(r => r.employeeId === user?.id);
  const leaveRequests = mockLeaveRequests.filter(r => r.employeeId === user?.id);
  const payrollRecords = mockPayrollRecords.filter(p => p.employeeId === user?.id);
  const workingDays = 22;
  const attendanceRate = Math.round((attendanceRecords.length / workingDays) * 100);
  const totalLeave = 20;
  const leaveUsed = leaveRequests.reduce((sum, leave) => sum + leave.days, 0);
  const leaveBalance = totalLeave - leaveUsed;
  const lastPayroll = payrollRecords[payrollRecords.length - 1];
  const overtimeETB = lastPayroll?.overtime ?? 0;
  const netPay = lastPayroll?.netSalary ?? 0;

  return (
    <>
      <Helmet>
        <title>Dashboard | HR Management System</title>
      </Helmet>
    <div className="p-3 space-y-8 mx-auto">
      {/* Welcome Header */}
      <PageHeader
        title={`Welcome, ${user?.name}!`}
        description="Your personalized dashboard overview"
      />

       {/* Employee Stats */}
      {(userPermissions.includes(Features.ATTENDANCE_RATE) ||
        userPermissions.includes(Features.AVAILABLE_LEAVE) ||
        userPermissions.includes(Features.OVERTIME_PAYMENT) ||
        userPermissions.includes(Features.PAYROLL_PAGE) ||
        userPermissions.includes(Features.NET_SALARY)) && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Personal Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <HasPermission permission={Features.ATTENDANCE_RATE}>
              <NavLink to="/attendance">
                <StatCard
                  title="Attendance Rate"
                  value={`${attendanceRate}%`}
                  icon={attendanceRate >= 30 ? TrendingUp : TrendingDown}
                  color={attendanceRate >= 70 ? 'emerald' : attendanceRate >= 50 ? 'blue' : attendanceRate >= 30 ? 'orange' : 'red'}
                />
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.AVAILABLE_LEAVE}>
              <NavLink to="/leaves">
                <StatCard title="Available Leave Days" value={`${leaveBalance} days`} icon={Calendar} color="blue" />
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.OVERTIME_PAYMENT}>
              <NavLink to="/payroll">
                <StatCard
                  title="Overtime Payment"
                  value={`ETB ${overtimeETB.toLocaleString()}`}
                  icon={overtimeETB >= 1000 ? TrendingUp : TrendingDown}
                  color={overtimeETB >= 1500 ? 'emerald' : overtimeETB >= 1000 ? 'orange' : 'red'}
                />
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.NET_SALARY}>
              <NavLink to="/payroll">
                <StatCard title="Net Salary" value={`ETB ${netPay.toLocaleString()}`} icon={DollarSign} color="emerald" />
              </NavLink>
            </HasPermission>
          </div>
        </div>
      )}

      {/* HR Stats */}
      {(userPermissions.includes(Features.ACTIVE_EMPLOYEES) ||
        userPermissions.includes(Features.ON_LEAVE_TODAY) ||
        userPermissions.includes(Features.LATE_ARRIVALS) ||
        userPermissions.includes(Features.PENDING_LEAVE_REQUESTS) ||
        userPermissions.includes(Features.OPEN_JOB_POSITIONS)) && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">HR Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <HasPermission permission={Features.ACTIVE_EMPLOYEES}>
              <NavLink to="/employees">
                <StatCard title={`Active Employees (${today})`} value={activeEmployees} icon={UserCheck} color="blue" />
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.ON_LEAVE_TODAY}>
              <NavLink to="/leave-management">
                <StatCard title="On Leave Today" value={onLeave} icon={Calendar} color="orange" />
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.LATE_ARRIVALS}>
              <NavLink to="/attendance-overview">
                <StatCard title="Late Arrivals" value={lateToday} icon={Clock} color="red" />
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.PENDING_LEAVE_REQUESTS}>
              <NavLink to="/leave-management">
                <StatCard title="Pending Requests" value={pendingRequests} icon={Hourglass} color="purple" />
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.OPEN_JOB_POSITIONS}>
              <NavLink to="/job-post">
                <StatCard title="Open Job Posts" value={openJobs} icon={Briefcase} color="emerald" />
              </NavLink>
            </HasPermission>
          </div>
        </div>
      )}

      {/* Admin Stats */}
      {(userPermissions.includes(Features.TOTAL_EMPLOYEES) ||
        userPermissions.includes(Features.PENDING_LEAVE_REQUESTS) ||
        userPermissions.includes(Features.JOB_POSTS)) && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Organization Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <HasPermission permission={Features.TOTAL_EMPLOYEES}>
              <NavLink to="/user-records">
                <StatCard title="Total Users" value={totalEmployees} icon={Users} color="emerald" />
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.PENDING_LEAVE_REQUESTS}>
              <NavLink to="/user-record">
                <StatCard title="Pending User Approval" value={pendingApprovalUsers} icon={Hourglass} color="purple" />
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.TOTAL_EMPLOYEES}>
              <NavLink to="/company-records">
                <StatCard title="Total Branchs" value={totalCompanies} icon={Building2} color="emerald" />
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.JOB_POSTS}>
              <NavLink to="/job-postings">
                <StatCard title="Total Job Posts" value={totalJobPosts} icon={Briefcase} color="purple" />
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.JOB_POSTS}>
              <NavLink to="/job-postings">
                <StatCard title="Pending Job Posts" value={pendingJobPosts} icon={Hourglass} color="purple" />
              </NavLink>
            </HasPermission>
          </div>
        </div>
      )}

      {/* Quick Actions and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <HasPermission permission={Features.EMPLOYEES_LIST}>
              <NavLink
                to="/user-record"
                className="w-full flex items-center space-x-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">View Users</span>
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.TOTAL_EMPLOYEES}>
              <NavLink
                to="/company-record"
                className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">View Companies</span>
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.JOB_POSTS}>
              <NavLink
                to="/job-postings"
                className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Job Posts</span>
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.ATTENDANCE_PAGE}>
              <NavLink
                to="/attendance"
                className="w-full flex items-center space-x-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <Clock className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Check In/Out</span>
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.LEAVE_REQUEST_PAGE}>
              <NavLink
                to="/leaves"
                className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Apply for Leave</span>
              </NavLink>
            </HasPermission>
            <HasPermission permission={Features.PAYROLL_PAGE}>
              <NavLink
                to="/payroll"
                className="w-full flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <DollarSign className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">View Payslip</span>
              </NavLink>
            </HasPermission>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <HasPermission permission={Features.PENDING_LEAVE_REQUESTS}>
              {mockLeaveRequests.slice(0, 3).map(leave => (
                <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{leave.employeeName}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {leave.type} Leave - {leave.days} {leave.days > 1 ? 'days' : 'day'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      leave.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : leave.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>
              ))}
            </HasPermission>
            <HasPermission permission={Features.ATTENDANCE_PAGE}>
              {attendanceRecords[0] && (
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Attendance Logged</p>
                    <p className="text-xs text-gray-500">
                      Checked in at {attendanceRecords[0].checkIn} on {attendanceRecords[0].date}
                    </p>
                  </div>
                </div>
              )}
            </HasPermission>
            <HasPermission permission={Features.PAYROLL_PAGE}>
              {lastPayroll && (
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payslip Available</p>
                    <p className="text-xs text-gray-500">
                      Your payslip for {lastPayroll.month} {lastPayroll.year} is ready
                    </p>
                  </div>
                </div>
              )}
            </HasPermission>
          </div>
        </Card>
      </div>

      {/* Additional Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Overview */}
        <HasPermission permission={Features.TOTAL_EMPLOYEES}>
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
            <div className="space-y-3">
              {Object.entries(
                mockEmployees.reduce((acc: Record<string, number>, emp) => {
                  const dept = mockDepartment.find(d => d.id === emp.department);
                  const deptName = dept ? dept.name : 'Unknown'; // Fallback to 'Unknown' if no match
                  acc[deptName] = (acc[deptName] || 0) + 1;
                  return acc;
                }, {})
              ).map(([deptName, count]) => (
                <div key={deptName} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{deptName}</span>
                  <span className="text-sm font-medium text-gray-900">{count} employees</span>
                </div>
              ))}
            </div>
          </Card>
        </HasPermission>

        {/* System Performance / Attendance Overview
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              {userPermissions.includes(Features.ATTENDANCE_MANAGEMENT)
                ? 'Attendance chart visualization'
                : userPermissions.includes(Features.ATTENDANCE_PAGE)
                ? "This Month's Attendance"
                : 'System performance metrics visualization'}
            </p>
          </div>
        </Card> */}
        <Card>
          <div className="flex items-center justify-center text-[#72c02c] font-semibold text-md w-full h-full p-6 text-center">
            Attendance Overview Chart and Additional Features Coming Soon!
          </div>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Dashboard;