import React from 'react';
import { Clock, Calendar, DollarSign, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockDashboardStats } from '../../data/mockData';
import StatCard from '../../components/UI/StatCard';
import Card from '../../components/UI/Card';
import { NavLink } from 'react-router-dom';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const stats = mockDashboardStats.employee;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-emerald-100">Here's your daily overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon={Clock}
          trend={{ value: 5, isPositive: true }}
          color="emerald"
        />
        <StatCard
          title="Leave Balance"
          value={`${stats.leaveBalance} days`}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Overtime Hours"
          value={`${stats.overtime} hrs`}
          icon={TrendingUp}
          color="orange"
        />
        <StatCard
          title="Warnings"
          value={stats.warnings}
          icon={AlertTriangle}
          color={stats.warnings > 0 ? 'red' : 'emerald'}
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
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
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Leave Request Approved</p>
                <p className="text-xs text-gray-500">Your sick leave for Jan 20 has been approved</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Attendance Logged</p>
                <p className="text-xs text-gray-500">Check-in at 9:00 AM today</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <DollarSign className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Payslip Available</p>
                <p className="text-xs text-gray-500">January 2024 payslip is ready for download</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Attendance Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month's Attendance</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Attendance chart visualization</p>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeDashboard;