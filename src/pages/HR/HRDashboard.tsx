// src/pages/HR/HRDashboard.tsx

import React from 'react';
import {
  Users,
  UserCheck,
  Calendar,
  Briefcase,
  Clock,
  Hourglass,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  mockEmployees,
  mockAttendanceRecords,
  mockLeaveRequests,
  mockJobPostings
} from '../../data/mockData';
import StatCard from '../../components/UI/StatCard';
import Card from '../../components/UI/Card';
import { NavLink } from 'react-router-dom';


const HRDashboard: React.FC = () => {
  const { user } = useAuth();

  // Calculated values
  const totalEmployees = mockEmployees.length;
  const activeEmployees = mockEmployees.filter(emp => emp.status === 'active').length;
  const today = new Date().toISOString().split('T')[0];

  const onLeave = mockLeaveRequests.filter(
    (leave) =>
      leave.status === 'approved' &&
      new Date(leave.startDate) <= new Date(today) &&
      new Date(leave.endDate) >= new Date(today)
  ).length;

  const lateToday = mockAttendanceRecords.filter(
    (att) => att.date === today && att.status === 'late'
  ).length;

  const pendingRequests = mockLeaveRequests.filter(
    (leave) => leave.status === 'pending'
  ).length;

  const openJobs = mockJobPostings.filter(
    (job) => job.status === 'active'
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">HR Dashboard</h1>
        <p className="text-emerald-100">
          Welcome, {user?.name}! 
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NavLink 
          to="/employees"
          >
          <StatCard title="Total Employees" 
            value={totalEmployees} 
            icon={Users} 
            color="emerald" 
          />
        </NavLink>
        <NavLink 
          to="/employees"
          > 
          <StatCard title="Active Employees" 
            value={activeEmployees} 
            icon={UserCheck} 
            color="blue" 
          />
        </NavLink>
        <NavLink 
          to="/leave-management"
          > 
          <StatCard title="On Leave Today" 
            value={onLeave} 
            icon={Calendar} 
            color="orange" 
          />
        </NavLink>
        <NavLink 
          to="/attendance-overview"
          > 
          <StatCard title="Late Arrivals" 
            value={lateToday} 
            icon={Clock} 
            color="red" 
          />
        </NavLink>
        <NavLink 
          to="/leave-management"
          >
          <StatCard title="Pending Requests" 
            value={pendingRequests} 
            icon={Hourglass} 
            color="purple" 
          />
        </NavLink>
        <NavLink 
          to="/job-post"
          >
          <StatCard title="Open Job Posts" 
            value={openJobs} 
            icon={Briefcase} 
            color="emerald" 
          />
        </NavLink>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leave Requests</h3>
          <div className="space-y-3">
            {mockLeaveRequests.slice(0, 3).map((leave) => (
              <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{leave.employeeName}</p>
                  <p className="text-xs text-gray-500 capitalize">{leave.type} Leave - {leave.days} {leave.days > 1 ? 'days' : 'day'}</p>
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
          </div>
        </Card>

        {/* Department Overview */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Overview</h3>
          <div className="space-y-3">
            {Object.entries(
              mockEmployees.reduce((acc: Record<string, number>, emp) => {
                acc[emp.department] = (acc[emp.department] || 0) + 1;
                return acc;
              }, {})
            ).map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{dept}</span>
                <span className="text-sm font-medium text-gray-900">{count} employees</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Attendance Overview */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance Overview</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Attendance chart visualization</p>
        </div>
      </Card>
    </div>
  );
};

export default HRDashboard;
