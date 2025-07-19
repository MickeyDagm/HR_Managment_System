import React from 'react';
import { Clock, Calendar, DollarSign, TrendingUp, CheckCircle, TrendingDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  mockAttendanceRecords,
  mockLeaveRequests,
  mockPayrollRecords
} from '../../data/mockData';
import StatCard from '../../components/UI/StatCard';
import Card from '../../components/UI/Card';
import { NavLink } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const employeeId = user?.id;

  const attendanceRecords = mockAttendanceRecords.filter(r => r.employeeId === employeeId);
  const leaveRequests = mockLeaveRequests.filter(r => r.employeeId === employeeId);
  const payrollRecords = mockPayrollRecords.filter(p => p.employeeId === employeeId);
  

  // === 1. Attendance Rate Calculation ===
  const workingDays = 22;
  const attendanceRate = Math.round((attendanceRecords.length / workingDays) * 100);

  // === 2. Leave Balance ===
  const totalLeave = 20;
  const leaveUsed = leaveRequests.reduce((sum, leave) => sum + leave.days, 0);
  const leaveBalance = totalLeave - leaveUsed;

  // === 3. Overtime Payment & Net Pay ===
  const lastPayroll = payrollRecords[payrollRecords.length - 1];
  const overtimeETB = lastPayroll?.overtime ?? 0;
  const netPay = lastPayroll?.netSalary ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title={`Welcome back, ${user?.name}!`} description='Here is your latest dashboard overview'/>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NavLink
          to="/attendance">
          <StatCard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            icon={attendanceRate>=30 ? TrendingUp : TrendingDown}
            color={attendanceRate>=70 ? "emerald" : attendanceRate>=50 ? "blue" : attendanceRate>=30 ? "orange" : "red"}
            trend={{ value: 2, isPositive: true }}
          />
        </NavLink>
        <NavLink
          to="/leaves">
          <StatCard
            title="Available Leave Days"
            value={`${leaveBalance} days`}
            icon={Calendar}
            color="blue"
          />
        </NavLink>
        <NavLink
          to="/payroll">
          <StatCard
            title="Overtime Payment"
            value={`ETB ${overtimeETB.toLocaleString()}`}
            icon={overtimeETB>=1000 ? TrendingUp : TrendingDown}
            color={overtimeETB>=1500 ? "emerald" : overtimeETB>=1000 ? "orange" : "red"}
          />
        </NavLink>
        <NavLink
          to="/payroll">
          <StatCard
            title="Net Salary"
            value={`ETB ${netPay.toLocaleString()}`}
            icon={DollarSign}
            color="emerald"
          />
        </NavLink>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <NavLink
              to="/attendance"
              className="w-full flex items-center space-x-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Check In/Out</span>
            </NavLink>
            <NavLink
              to="/leaves"
              className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Apply for Leave</span>
            </NavLink>
            <NavLink
              to="/payroll"
              className="w-full flex items-center space-x-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">View Payslip</span>
            </NavLink>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {leaveRequests[0] && (
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Leave Request</p>
                  <p className="text-xs text-gray-500">
                    Your leave ({leaveRequests[0].type}) for {leaveRequests[0].startDate} to {leaveRequests[0].endDate} is {leaveRequests[0].status}.
                  </p>
                </div>
              </div>
            )}
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
            {lastPayroll && (
              <div className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Payslip Available</p>
                  <p className="text-xs text-gray-500">
                    Your payslip for {lastPayroll.month} {lastPayroll.year} is ready
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Attendance Chart Placeholder */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month's Attendance</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Attendance chart will appear here</p>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;
