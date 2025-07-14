import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { mockApplicants, mockJobPostings } from '../../data/mockData';
import { Applicant } from '../../types';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';

const HRRecruitment: React.FC = () => {
  const [filteredApplicants, setFilteredApplicants] = useState<Applicant[]>([]);
  const [filters, setFilters] = useState({
    jobTitle: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    setFilteredApplicants(mockApplicants);
  }, []);

  useEffect(() => {
    let result = [...mockApplicants];

    if (filters.jobTitle) {
      result = result.filter(app => app.jobTitle === filters.jobTitle);
    }
    if (filters.status) {
      result = result.filter(app => app.status === filters.status);
    }
    if (filters.search) {
      result = result.filter(app =>
        app.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredApplicants(result);
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const jobTitles = Array.from(new Set(mockJobPostings.map(job => job.title)));
  const statuses = ['pending', 'reviewed', 'interview_scheduled', 'rejected', 'hired'];

  const headers = [
    'Name',
    'Email',
    'Phone',
    'Job Title',
    'Applied Date',
    'Status',
    'Actions'
  ];

  return (
    <div className="p-4">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white mb-3">
        <h1 className="text-2xl font-bold mb-2">Recruitment Management</h1>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <select
              name="jobTitle"
              value={filters.jobTitle}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Jobs</option>
              {jobTitles.map(title => (
                <option key={title} value={title}>{title}</option>
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
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <Table headers={headers} className="rounded-lg">
        {filteredApplicants.map((app) => (
          <tr key={app.id} className="odd:bg-emerald-50">
            <td className="px-6 py-4 text-sm text-gray-900">{app.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{app.email}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{app.phone}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{app.jobTitle}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{app.appliedDate}</td>
            <td className="px-6 py-4 text-sm capitalize text-gray-600">{app.status}</td>
            <td className="px-6 py-4 text-sm">
              <NavLink to={`/applicant-details/${app.id}`}>
                <Button size="sm">View Details</Button>
              </NavLink>
            </td>
          </tr>
        ))}
        {filteredApplicants.length === 0 && (
          <tr>
            <td colSpan={7} className="px-6 py-4 text-sm text-center text-gray-500">
              No applicants match the selected filters.
            </td>
          </tr>
        )}
      </Table>
    </div>
  );
};

export default HRRecruitment;