import React, { useEffect, useState } from 'react';
import Table from '../components/UI/Table';
import { mockEmployees, mockLeaveRequests, mockDepartment } from '../data/mockData';
import { Employee } from '../types/index';
import Button from '../components/UI/Button';
import { NavLink } from 'react-router-dom';
import PageHeader from '../components/UI/PageHeader';
import { Helmet } from "react-helmet-async";

const EmployeeList: React.FC = () => {
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    position: '',
    search: ''
  });

  useEffect(() => {
    setFilteredEmployees(mockEmployees);
  }, []);

  useEffect(() => {
    let result = [...mockEmployees];

    if (filters.department) {
      result = result.filter(emp => emp.department === filters.department);
    }
    if (filters.status) {
      if (filters.status === 'on_leave') {
        const today = new Date('2025-07-14');
        result = result.filter(emp =>
          mockLeaveRequests.some(
            req =>
              req.employeeId === emp.id &&
              req.status === 'approved' &&
              new Date(req.startDate) <= today &&
              new Date(req.endDate) >= today
          )
        );
      } else if (filters.status === 'not_on_leave') {
        const today = new Date('2025-07-14');
        result = result.filter(emp =>
          !mockLeaveRequests.some(
            req =>
              req.employeeId === emp.id &&
              req.status === 'approved' &&
              new Date(req.startDate) <= today &&
              new Date(req.endDate) >= today
          )
        );
      } else {
        result = result.filter(emp => emp.status === filters.status);
      }
    }
    if (filters.position) {
      result = result.filter(emp => emp.position === filters.position);
    }
    if (filters.search) {
      result = result.filter(emp =>
        emp.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredEmployees(result);
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const isEmployeeOnLeave = (employeeId: string): boolean => {
    const today = new Date('2025-07-14');
    return mockLeaveRequests.some(
      req =>
        req.employeeId === employeeId &&
        req.status === 'approved' &&
        new Date(req.startDate) <= today &&
        new Date(req.endDate) >= today
    );
  };
  const getDepartmentName = (departmentId: string): string => {
    const department = mockDepartment.find(dept => dept.id === departmentId);
    return department ? department.name : 'Unknown';
  }

  const departments = Array.from(
    new Set(
      mockEmployees.map(emp => {
        const dept = mockDepartment.find(dept => dept.id === emp.department);
        return dept ? dept.name : '';
      }).filter(name => name !== '') 
    )
  );
  const statuses = Array.from(new Set(mockEmployees.map(emp => emp.status)));
  const statusOptions = [...statuses, 'on_leave', 'not_on_leave'];
  const positions = Array.from(new Set(mockEmployees.map(emp => emp.position)));

  const headers = [
    'Name',
    'Employee ID',
    'Department',
    'Position',
    'Email',
    'Phone',
    'Status',
    'Manager',
    'Actions'
  ];

  return (
    <>
    <Helmet>
      <title>Employee List | HR Management System</title>
    </Helmet>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <select
              name="position"
              value={filters.position}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Positions</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
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
            <td className="px-6 py-4 text-sm text-gray-600">{getDepartmentName(emp.department)}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
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
    </>
  );
};

export default EmployeeList;