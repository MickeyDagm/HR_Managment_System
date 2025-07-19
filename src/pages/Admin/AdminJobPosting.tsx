import React, { useEffect, useState } from 'react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import { NavLink } from 'react-router-dom';
import { mockJobPostings, mockCompanies } from '../../data/mockData';
import { JobPosting } from '../../types';
import PageHeader from '../../components/UI/PageHeader';

const AdminJobPosting: React.FC = () => {
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [filters, setFilters] = useState({
    department: '',
    company: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    setFilteredJobs(mockJobPostings);
  }, []);

  useEffect(() => {
    let result = [...mockJobPostings];

    if (filters.department) {
      result = result.filter(job => job.department === filters.department);
    }
    if (filters.company) {
      result = result.filter(job => job.companyId === filters.company);
    }
    if (filters.status) {
      result = result.filter(job => job.approved === filters.status);
    }
    if (filters.search) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.id.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredJobs(result);
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const departments = Array.from(new Set(mockJobPostings.map(job => job.department)));
  const companies = Array.from(new Set(mockCompanies.map(company => company.id)));
  const statuses = ['pending', 'approved', 'rejected'];

  const headers = ['Title', 'Department', 'Company', 'Location', 'Status', 'Applicants', 'Actions'];

  return (
    <div className="p-4">
      <PageHeader title="Job Postings Management" />

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Title/ID</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by title or ID..."
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Table headers={headers} className="rounded-lg">
        {filteredJobs.map(job => (
          <tr key={job.id} className="odd:bg-emerald-50">
            <td className="px-6 py-4 text-sm text-gray-900">{job.title}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{job.department}</td>
            <td className="px-6 py-4 text-sm text-gray-600">
              {mockCompanies.find(c => c.id === job.companyId)?.name || '—'}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{job.location}</td>
            <td className="px-6 py-4 text-sm text-gray-600 capitalize">{job.approved}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{job.applicants}</td>
            <td className="px-6 py-4 text-sm">
              <NavLink to={`/job-details/${job.id}`}>
                <Button size="sm">View Details</Button>
              </NavLink>
            </td>
          </tr>
        ))}
        {filteredJobs.length === 0 && (
          <tr>
            <td colSpan={7} className="px-6 py-4 text-sm text-center text-gray-500">
              No job postings match the selected filters.
            </td>
          </tr>
        )}
      </Table>
    </div>
  );
};

export default AdminJobPosting;