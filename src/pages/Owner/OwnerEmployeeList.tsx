import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Table from '../../components/UI/Table';
import { mockEmployees, mockLeaveRequests } from '../../data/mockData';
import { Employee } from '../../types/index';
import Button from '../../components/UI/Button';
import { NavLink } from 'react-router-dom';
import PageHeader from '../../components/UI/PageHeader';

const OwnerEmployeeList: React.FC = () => {
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    role: '',
    search: ''
  });

  // Predefined roles for promotion
  const roleOptions = ['Employee', 'Team Lead', 'Manager', 'Director'];

  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

  useEffect(() => {
    let result = [...employees];

    if (filters.department) {
      result = result.filter(emp => emp.department === filters.department);
    }
    if (filters.status) {
      if (filters.status === 'on_leave') {
        const today = new Date().toISOString().split('T')[0];
        result = result.filter(emp =>
          mockLeaveRequests.some(
            req =>
              req.employeeId === emp.id &&
              req.status === 'approved' &&
              new Date(req.startDate) <= new Date(today) &&
              new Date(req.endDate) >= new Date(today)
          )
        );
      } else if (filters.status === 'not_on_leave') {
        const today = new Date().toISOString().split('T')[0];
        result = result.filter(emp =>
          !mockLeaveRequests.some(
            req =>
              req.employeeId === emp.id &&
              req.status === 'approved' &&
              new Date(req.startDate) <= new Date(today) &&
              new Date(req.endDate) >= new Date(today)
          )
        );
      } else {
        result = result.filter(emp => emp.status === filters.status);
      }
    }
    if (filters.role) {
      result = result.filter(emp => emp.position === filters.role);
    }
    if (filters.search) {
      result = result.filter(emp =>
        emp.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredEmployees(result);
  }, [filters, employees]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (employeeId: string, newRole: string) => {
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === employeeId ? { ...emp, position: newRole } : emp
      )
    );
    toast.success(`Employee role updated to ${newRole}`);
  };

  const isEmployeeOnLeave = (employeeId: string): boolean => {
    const today = new Date().toISOString().split('T')[0];
    return mockLeaveRequests.some(
      req =>
        req.employeeId === employeeId &&
        req.status === 'approved' &&
        new Date(req.startDate) <= new Date(today) &&
        new Date(req.endDate) >= new Date(today)
    );
  };

  const departments = Array.from(new Set(employees.map(emp => emp.department)));
  const statuses = Array.from(new Set(employees.map(emp => emp.status)));
  const statusOptions = [...statuses, 'on_leave', 'not_on_leave'];
  const roles = Array.from(new Set(employees.map(emp => emp.position)));

  const headers = [
    'Name',
    'Employee ID',
    'Department',
    'Role',
    'Email',
    'Phone',
    'Status',
    'Manager',
    'Actions'
  ];

  return (
    <div className="p-4">
      <PageHeader title="Employee Management" />

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Name/ID</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name or ID..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === 'on_leave' ? 'On Leave' : status === 'not_on_leave' ? 'Not On Leave' : status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Table headers={headers} className="rounded-lg">
        {filteredEmployees.map((emp) => (
          <tr key={emp.id} className="odd:bg-emerald-50">
            <td className="px-6 py-4 text-sm text-gray-900">{emp.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{emp.employeeId}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
            <td className="px-6 py-4 text-sm text-gray-600">
              <select
                value={emp.position}
                onChange={(e) => handleRoleChange(emp.id, e.target.value)}
                className="p-1 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              >
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{emp.email}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{emp.phone}</td>
            <td className="px-6 py-4 text-sm capitalize text-gray-600">
              {isEmployeeOnLeave(emp.id) ? 'On Leave' : emp.status}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{emp.manager || '—'}</td>
            <td className="px-6 py-4 text-sm">
              <NavLink to={`/employee-details/${emp.id}`}>
                <Button size="sm">View Details</Button>
              </NavLink>
            </td>
          </tr>
        ))}
        {filteredEmployees.length === 0 && (
          <tr>
            <td colSpan={9} className="px-6 py-4 text-sm text-center text-gray-500">
              No employees match the selected filters.
            </td>
          </tr>
        )}
      </Table>
    </div>
  );
};

export default OwnerEmployeeList;