
import React, { useEffect, useState } from 'react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import { NavLink } from 'react-router-dom';
import { mockUsers, mockApplicants, mockCompanies } from '../../data/mockData';
import { User, Applicant } from '../../types';
import PageHeader from '../../components/UI/PageHeader';

const AdminUserList: React.FC = () => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<User[]>([]);
  const [filters, setFilters] = useState({
    role: '',
    approved: '',
    company: '',
    search: ''
  });

  useEffect(() => {
    setFilteredUsers(mockUsers);
    setFilteredApplicants(mockApplicants);
    setFilteredEmployees(mockUsers.filter(user => user.role === 'employee'));
  }, []);

  useEffect(() => {
    let usersResult = [...mockUsers];
    let applicantsResult = [...mockApplicants];
    let employeesResult = [...mockUsers].filter(user => user.role === 'employee');

    if (filters.role) {
      usersResult = usersResult.filter(user => user.role === filters.role);
      employeesResult = employeesResult.filter(user => user.role === filters.role);
    }
    if (filters.approved) {
      usersResult = usersResult.filter(user => user.approved === filters.approved);
      applicantsResult = applicantsResult.filter(applicant => applicant.approved === filters.approved);
      employeesResult = employeesResult.filter(user => user.approved === filters.approved);
    }
    if (filters.company) {
      usersResult = usersResult.filter(user => user.companyId === filters.company);
      applicantsResult = applicantsResult.filter(applicant => applicant.companyId === filters.company);
      employeesResult = employeesResult.filter(user => user.companyId === filters.company);
    }
    if (filters.search) {
      usersResult = usersResult.filter(user =>
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (user.employeeId?.toLowerCase().includes(filters.search.toLowerCase()) ?? false)
      );
      applicantsResult = applicantsResult.filter(applicant =>
        applicant.name.toLowerCase().includes(filters.search.toLowerCase())
      );
      employeesResult = employeesResult.filter(user =>
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (user.employeeId?.toLowerCase().includes(filters.search.toLowerCase()) ?? false)
      );
    }

    setFilteredUsers(usersResult);
    setFilteredApplicants(applicantsResult);
    setFilteredEmployees(employeesResult);
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const roles = Array.from(new Set(mockUsers.map(user => user.role)));
  const approvalStatuses = ['pending', 'approved', 'rejected'];
  const companies = Array.from(new Set(mockCompanies.map(company => company.id)));

  const userHeaders = ['Name', 'Email', 'Phone', 'Role', 'Company', 'Approval Status', 'Actions'];
  const applicantHeaders = ['Name', 'Email', 'Phone', 'Company', 'Approval Status', 'Actions'];
  const employeeHeaders = ['Name', 'Email', 'Phone', 'Role', 'Employee ID', 'Company', 'Approval Status', 'Actions'];

  return (
    <div className="p-4">
      <PageHeader title="User Management" />

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Filters</h2>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
            <select
              name="approved"
              value={filters.approved}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Statuses</option>
              {approvalStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <select
              name="company"
              value={filters.company}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Companies</option>
              {companies.map(id => {
                const company = mockCompanies.find(c => c.id === id);
                return <option key={id} value={id}>{company?.name}</option>;
              })}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <Table headers={userHeaders} className="rounded-lg">
          {filteredUsers.map(user => (
            <tr key={user.id} className="odd:bg-emerald-50">
              <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {mockCompanies.find(c => c.id === user.companyId)?.name || '—'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 capitalize">{user.approved}</td>
              <td className="px-6 py-4 text-sm">
                <NavLink to={`/user-details/${user.id}`}>
                  <Button size="sm">View Details</Button>
                </NavLink>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-sm text-center text-gray-500">
                No users match the selected filters.
              </td>
            </tr>
          )}
        </Table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Applicants</h2>
        <Table headers={applicantHeaders} className="rounded-lg">
          {filteredApplicants.map(applicant => (
            <tr key={applicant.id} className="odd:bg-emerald-50">
              <td className="px-6 py-4 text-sm text-gray-900">{applicant.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{applicant.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{applicant.phone || '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {mockCompanies.find(c => c.id === applicant.companyId)?.name || '—'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 capitalize">{applicant.approved}</td>
              <td className="px-6 py-4 text-sm">
                <NavLink to={`/user-details/${applicant.id}`}>
                  <Button size="sm">View Details</Button>
                </NavLink>
              </td>
            </tr>
          ))}
          {filteredApplicants.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-sm text-center text-gray-500">
                No applicants match the selected filters.
              </td>
            </tr>
          )}
        </Table>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Employees</h2>
        <Table headers={employeeHeaders} className="rounded-lg">
          {filteredEmployees.map(employee => (
            <tr key={employee.id} className="odd:bg-emerald-50">
              <td className="px-6 py-4 text-sm text-gray-900">{employee.name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{employee.phone || '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{employee.role}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{employee.employeeId || '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {mockCompanies.find(c => c.id === employee.companyId)?.name || '—'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 capitalize">{employee.approved}</td>
              <td className="px-6 py-4 text-sm">
                <NavLink to={`/user-details/${employee.id}`}>
                  <Button size="sm">View Details</Button>
                </NavLink>
              </td>
            </tr>
          ))}
          {filteredEmployees.length === 0 && (
            <tr>
              <td colSpan={8} className="px-6 py-4 text-sm text-center text-gray-500">
                No employees match the selected filters.
              </td>
            </tr>
          )}
        </Table>
      </div>
    </div>
  );
};

export default AdminUserList;