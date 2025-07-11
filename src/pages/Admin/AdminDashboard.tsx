import React from 'react';
import { Users, Briefcase, Settings, Building, TrendingUp, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockDashboardStats } from '../../data/mockData';
import StatCard from '../../components/UI/StatCard';
import Card from '../../components/UI/Card';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const stats = mockDashboardStats.admin;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-emerald-100">Welcome, {user?.name}! System overview and controls</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalEmployees}
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Active Sessions"
          value={stats.activeEmployees}
          icon={Shield}
          color="blue"
        />
        <StatCard
          title="System Health"
          value="98.5%"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Storage Used"
          value="2.4 GB"
          icon={Building}
          color="orange"
        />
        <StatCard
          title="API Requests"
          value="1,234"
          icon={Settings}
          color="purple"
        />
        <StatCard
          title="Job Posts"
          value={stats.openJobs}
          icon={Briefcase}
          color="blue"
        />
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Logs */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent System Logs</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">User Login</p>
                <p className="text-xs text-gray-500">john.doe@company.com - 2 mins ago</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Success
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Database Backup</p>
                <p className="text-xs text-gray-500">Scheduled backup completed - 1 hour ago</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Success
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Failed Login Attempt</p>
                <p className="text-xs text-gray-500">Invalid credentials - 3 hours ago</p>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Warning
              </span>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Add New Employee</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Create Job Posting</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">System Settings</span>
            </button>
          </div>
        </Card>
      </div>

      {/* System Performance */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Performance metrics visualization would go here</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;