import React, { useState } from 'react';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import { mockCompanies } from '../../data/mockData';
import { Company } from '../../types';
import Card from '../../components/UI/Card';
import PageHeader from '../../components/UI/PageHeader';

const AdminCompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [filters, setFilters] = useState({
    industry: '',
    status: '',
    search: ''
  });
  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    name: '',
    industry: '',
    location: '',
    email: '',
    phone: '',
    status: 'active'
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      const { name, value } = target;
      setNewCompany(prev => ({ ...prev, [name]: value }));
};


  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `C${(companies.length + 1).toString().padStart(3, '0')}`;
    setCompanies([...companies, { id: newId, ...newCompany, status: newCompany.status || 'active' } as Company]);
    setNewCompany({ name: '', industry: '', location: '', email: '', phone: '', status: 'active' });
  };

  const filteredCompanies = companies.filter(company =>
    (filters.industry ? company.industry === filters.industry : true) &&
    (filters.status ? company.status === filters.status : true) &&
    (filters.search
      ? company.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        company.id.toLowerCase().includes(filters.search.toLowerCase())
      : true)
  );

  const industries = Array.from(new Set(companies.map(company => company.industry)));
  const statuses = ['active', 'inactive'];

  const headers = ['Name', 'Industry', 'Location', 'Email', 'Phone', 'Status'];

  return (
    <div className="p-4">
      <PageHeader title="Company Management" />

        <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Name/ID</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name or ID..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <select
              name="industry"
              value={filters.industry}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c]-500 focus:border-[#72c02c]-500"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c]-500 focus:border-[#72c02c]-500"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>
      <div className='flex justify-end mt-4'>
         <Button size='md'  
            onClick={() => {
              const el = document.getElementById('createCompanyForm');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}>
                Add company
          </Button>
      </div>
     
      <Table headers={headers} className="rounded-lg my-4">
        {filteredCompanies.map(company => (
          <tr key={company.id} className="odd:bg-[#72c02c]-50">
            <td className="px-6 py-4 text-sm text-gray-900">{company.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{company.industry}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{company.location}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{company.email}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{company.phone}</td>
            <td className="px-6 py-4 text-sm text-gray-600 capitalize">{company.status}</td>
          </tr>
        ))}
        {filteredCompanies.length === 0 && (
          <tr>
            <td colSpan={6} className="px-6 py-4 text-sm text-center text-gray-500">
              No companies match the selected filters.
            </td>
          </tr>
        )}
      </Table>


      <div className="mb-6 bg-white p-4 rounded-lg shadow mt-4" id='createCompanyForm'>
        <h2 className="text-xl font-semibold mb-4">Add New Company</h2>
        <form onSubmit={handleAddCompany} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={newCompany.name}
              onChange={handleInputChange}
              placeholder="Company Name"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c]-500 focus:border-[#72c02c]-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input
              type="text"
              name="industry"
              value={newCompany.industry}
              onChange={handleInputChange}
              placeholder="Industry"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c]-500 focus:border-[#72c02c]-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={newCompany.location}
              onChange={handleInputChange}
              placeholder="Location"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c]-500 focus:border-[#72c02c]-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={newCompany.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c]-500 focus:border-[#72c02c]-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={newCompany.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c]-500 focus:border-[#72c02c]-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={newCompany.status}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c]-500 focus:border-[#72c02c]-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <Button type="submit" className="mt-4">Add Company</Button>
          </div>
        </form>
      </div>

 
    </div>
  );
};

export default AdminCompanyList;
