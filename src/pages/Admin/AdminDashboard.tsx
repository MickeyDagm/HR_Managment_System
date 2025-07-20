import React from 'react';
import { Users, Briefcase,  Building2, Hourglass } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  mockEmployees,
  mockJobPostings,
  mockCompanies,
  getPendingUsers,
  getPendingJobPosts,
  mockApplicants
} from '../../data/mockData';
import StatCard from '../../components/UI/StatCard';
import Card from '../../components/UI/Card';
import { NavLink } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const totalEmployees = mockEmployees.length + mockApplicants.length;
  const totalCompanies = mockCompanies.length;
  const pendingAprovalUsers = getPendingUsers().length;
  const totalJobPosts = mockJobPostings.length;
  const totalPendingJobPosts = getPendingJobPosts().length; 

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <PageHeader title={`Welcome, ${user?.name}`} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NavLink
          to="/user-records">
            <StatCard title="Total users" value={totalEmployees} icon={Users} color="emerald" />
        </NavLink>
        <NavLink
          to="/user-record">
            <StatCard title="Pending User Approval" value={pendingAprovalUsers} icon={Hourglass} color="purple" />
        </NavLink>
        <NavLink
          to="/company-records">
            <StatCard title="Total Companies" value={totalCompanies} icon={Building2} color="emerald" />
        </NavLink>
        <NavLink
          to="/job-postings">
            <StatCard title="Total Job posts" value={totalJobPosts}icon={Briefcase} color="purple" />
        </NavLink>
        <NavLink
          to="/job-postings">
            <StatCard title="Pending Job posts" value={totalPendingJobPosts} icon={Hourglass} color="purple" />
        </NavLink>
      </div>

      {/* Logs and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <NavLink
                to="/user-record"
                className="w-full flex items-center space-x-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">View Users</span>
              </NavLink>
              <NavLink
                to="/company-record"
                className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">View Companies</span>
              </NavLink>
              <NavLink
                to="/job-postings"
                className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Job Posts</span>
                </NavLink>
            </div>
          </Card>
          {/* Performance Metrics */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Performance</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Performance metrics visualization would go here</p>
            </div>
        </Card>
      </div> 
    </div>
  );
};

export default AdminDashboard;
