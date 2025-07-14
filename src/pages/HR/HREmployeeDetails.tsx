import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { mockEmployees, mockLeaveRequests } from '../../data/mockData';
import { Employee, LeaveRequest } from '../../types';
import Card from '../../components/UI/Card';
import userLogo from '../../assets/user_logo.jpg';

const HREmployeeDetails: React.FC = () => {
  const { user } = useAuth();
  const { employeeId } = useParams<{ employeeId: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredLeaves, setFilteredLeaves] = useState<LeaveRequest[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    type: ''
  });

  useEffect(() => {
    const foundEmployee = mockEmployees.find(emp => emp.id === employeeId);
    if (!foundEmployee) {
      toast.error('Employee not found');
      return;
    }
    setEmployee(foundEmployee);

    const employeeLeaves = mockLeaveRequests.filter(req => req.employeeId === employeeId);
    setLeaveRequests(employeeLeaves);
    setFilteredLeaves(employeeLeaves);
  }, [employeeId]);

  useEffect(() => {
    let result = [...leaveRequests];

    if (filters.status) {
      result = result.filter(req => req.status === filters.status);
    }
    if (filters.type) {
      result = result.filter(req => req.type === filters.type);
    }

    setFilteredLeaves(result);
  }, [filters, leaveRequests]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Mock attendance calculation (since not in mock data, using static value for demo)
  const calculateAttendance = (employeeId: string): number => {
    const leaves = mockLeaveRequests.filter(req => req.employeeId === employeeId && req.status === 'approved');
    const totalLeaveDays = leaves.reduce((sum, req) => sum + req.days, 0);
    const workingDaysInYear = 260; // Assumption: 5 days/week * 52 weeks
    const attendancePercentage = ((workingDaysInYear - totalLeaveDays) / workingDaysInYear) * 100;
    return Math.round(attendancePercentage * 10) / 10; // Round to 1 decimal
  };

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Employee Details</h1>
          <p className="text-emerald-100">Loading employee data...</p>
        </div>
      </div>
    );
  }

  const uniqueStatuses = Array.from(new Set(mockLeaveRequests.map(req => req.status)));
  const uniqueTypes = Array.from(new Set(mockLeaveRequests.map(req => req.type)));
  const attendancePercentage = calculateAttendance(employee.id);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Employee Details</h1>
        {/* <p className="text-emerald-100">Viewing details for {employee.name}, {user?.name}</p> */}
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Avatar Centered */}
          <div className="md:col-span-1 flex justify-center ">
            <div className="w-32 h-32">
              <img
                src={employee?.avatar || userLogo}
                alt={employee?.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          </div>

          {/* Personal Details */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Full Name</h3>
              <p className="text-gray-900">{employee.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Employee ID</h3>
              <p className="text-gray-900">{employee.employeeId}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Email</h3>
              <p className="text-gray-900">{employee.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Phone</h3>
              <p className="text-gray-900">{employee.phone}</p>
            </div>
            <div className="sm:col-span-2">
              <h3 className="text-sm font-medium text-gray-700">Address</h3>
              <p className="text-gray-900">{employee.address}</p>
            </div>
          </div>
        </div>
      </Card>


      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Department</h3>
            <p className="text-gray-900">{employee.department}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Position</h3>
            <p className="text-gray-900">{employee.position}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Date of Hire</h3>
            <p className="text-gray-900">{employee.dateOfHire}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Salary</h3>
            <p className="text-gray-900">ETB {employee.salary.toLocaleString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Manager</h3>
            <p className="text-gray-900">{employee.manager}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Status</h3>
            <p className="text-gray-900 capitalize">{employee.status}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">Attendance</h3>
            <p className="text-gray-900">{attendancePercentage}%</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {employee.skills?.map((skill, index) => (
            <span
              key={index}
              className="inline-block bg-emerald-100 text-emerald-800 text-sm font-medium px-2.5 py-0.5 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave History</h2>
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Start Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">End Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Days</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Reason</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Applied Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Comments</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeaves.map((req) => (
                <tr key={req.id}>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.startDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.endDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.days}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.reason}</td>
                  <td className="px-4 py-3 text-sm capitalize text-gray-700">{req.status}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.appliedDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.comments || '—'}</td>
                </tr>
              ))}
              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-3 text-center text-sm text-gray-500">
                    No leave requests match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default HREmployeeDetails;