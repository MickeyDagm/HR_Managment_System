import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import EmployeeDashboard from './Employee/EmployeeDashboard';
import HRDashboard from './HR/HRDashboard';
import AdminDashboard from './Admin/AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'employee':
      return <EmployeeDashboard />;
    case 'hr':
      return <HRDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div>Access denied</div>;
  }
};

export default Dashboard;