import React from 'react';
import {
  Users,
  UserCheck,
  Calendar,
  Briefcase,
  Building,
  Users2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  mockEmployees,
  mockLeaveRequests,
  mockJobPostings
} from '../../data/mockData';
import StatCard from '../../components/UI/StatCard';
import Card from '../../components/UI/Card';
import { NavLink } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';

// Mock data for branches (since not provided in original context)
const mockBranches = [
  { id: '1', name: 'Addis Ababa Branch', location: 'Addis Ababa, Ethiopia', employeeCount: 50 },
  { id: '2', name: 'Nairobi Branch', location: 'Nairobi, Kenya', employeeCount: 30 },
  { id: '3', name: 'Kampala Branch', location: 'Kampala, Uganda', employeeCount: 20 },
];

const OwnerDashboard: React.FC = () => {
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

  const openJobs = mockJobPostings.filter(
    (job) => job.status === 'active'
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <PageHeader title={`Welcome, ${user?.name}!`} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NavLink to="/employees">
          <StatCard
            title="Total Employees"
            value={totalEmployees}
            icon={Users}
            color="emerald"
          />
        </NavLink>
        <NavLink to="/employees">
          <StatCard
            title="Active Employees"
            value={activeEmployees}
            icon={UserCheck}
            color="blue"
          />
        </NavLink>
        <NavLink to="/leave-management">
          <StatCard
            title="On Leave Today"
            value={onLeave}
            icon={Calendar}
            color="orange"
          />
        </NavLink>
        <NavLink to="/job-post">
          <StatCard
            title="Open Job Posts"
            value={openJobs}
            icon={Briefcase}
            color="emerald"
          />
        </NavLink>
      </div>

      {/* Department and Branches Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Branches Overview */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Branches Overview</h3>
          <div className="space-y-3">
            {mockBranches.map((branch) => (
              <div key={branch.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{branch.name}</p>
                  <p className="text-xs text-gray-500">{branch.location}</p>
                </div>
                <span className="text-sm font-medium text-gray-900">{branch.employeeCount} employees</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OwnerDashboard;