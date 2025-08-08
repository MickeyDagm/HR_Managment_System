import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { mockJobPostings, mockEmployees, mockDepartment } from '../data/mockData';
import { JobPosting } from '../types';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import PageHeader from '../components/UI/PageHeader';
import { Helmet } from "react-helmet-async";

const HRJobPosting: React.FC = () => {
  const { user } = useAuth();
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(mockJobPostings);
  const [filteredPostings, setFilteredPostings] = useState<JobPosting[]>(mockJobPostings);
  const [formData, setFormData] = useState({
    title: '',
    deadline: '',
    description: '',
    city: '',
    country: '',
    experienceRange: '',
    department: '',
    customCategory: '',
    educationLevel: '',
    fieldOfStudy: '',
    type: undefined as JobPosting['type'] | undefined,
    employmentType: '' as JobPosting['employmentType'],
    salary: ''
  });
  const [filters, setFilters] = useState({
    status: '',
    department: ''
  });
  const [showPreview, setShowPreview] = useState(false);

  // Predefined country and city options
  const countryOptions = ['Ethiopia', 'Uganda', 'Rwanda', 'Kenya'];
  const cityOptions: { [key: string]: string[] } = {
    Ethiopia: ['Addis Ababa', 'Adama', 'Gondar', 'Bahir Dar'],
    Uganda: ['Kampala', 'Gulu', 'Mbarara', 'Jinja'],
    Rwanda: ['Kigali', 'Gisenyi', 'Ruhengeri', 'Butare'],
    Kenya: ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret']
  };

  // Predefined field of study options
  const fieldOfStudyOptions = [
    'Computer Science',
    'Engineering',
    'Business Administration',
    'Medicine',
    'Law',
    'Education',
    'Economics',
    'Custom'
  ];

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    let result = [...jobPostings];

    if (filters.status) {
      result = result.filter(job => job.status === filters.status);
    }
    if (filters.department) {
      result = result.filter(job => 
        job.department.includes(filters.department) 
      );
    }

    setFilteredPostings(result);
  }, [filters, jobPostings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Reset city when country changes
    if (name === 'country') {
      setFormData(prev => ({ ...prev, country: value, city: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handlePreview = () => {
    if (
      !formData.title.trim() ||
      !formData.deadline.trim() ||
      !formData.description.trim() ||
      !formData.city.trim() ||
      !formData.country.trim() ||
      !formData.experienceRange.trim() ||
      !formData.department.trim() ||
      (formData.department === 'custom' && !formData.customCategory.trim()) ||
      !formData.educationLevel.trim() ||
      !formData.fieldOfStudy.trim() ||
      !formData.type ||
      !formData.employmentType.trim() ||
      !formData.salary.trim()
    ) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Preview generated successfully');
    setShowPreview(true);
  };

  const handleRequestPost = () => {
    const newJob: JobPosting = {
      id: String(jobPostings.length + 1),
      title: formData.title,
      department: mockEmployees.find(emp => emp.id === user?.id)?.department || 'Unknown',
      description: formData.description,
      experience: formData.experienceRange,
      education: formData.educationLevel,
      educationField: formData.fieldOfStudy,
      salary: formData.salary,
      type: formData.type as JobPosting['type'],
      employmentType: formData.employmentType,
      location: `${formData.city}, ${formData.country}`,
      postedDate: new Date().toISOString().split('T')[0],
      expiryDate: formData.deadline,
      status: 'pending',
      applicants: 0,
      companyId: user?.companyId,
      approved: "pending"
    };

    setJobPostings([...jobPostings, newJob]);
    toast.success('Job posting request sent to admin');
    setFormData({
      title: '',
      deadline: '',
      description: '',
      city: '',
      country: '',
      experienceRange: '',
      department: '',
      customCategory: '',
      educationLevel: '',
      fieldOfStudy: '',
      type: undefined,
      employmentType: 'part-time',
      salary: ''
    });
    setShowPreview(false);
  };

  const departments = Array.from(
      new Set(
        mockEmployees.map(emp => {
          const dept = mockDepartment.find(dept => dept.id === emp.department);
          return dept ? dept.name : '';
        }).filter(name => name !== '') 
      )
    );
  const statuses = ['active', 'closed', 'draft', 'pending'];

  return (
    <>
    <Helmet>
      <title>Job Posting | HR Management System</title>
    </Helmet>
    <div className="space-y-6">
      <PageHeader title='Job Post Management'/>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Postings</h2>
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                name="department"
                value={filters.department}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-[#72c02c] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Position</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Department</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Location</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Employment Type</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Salary</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Posted Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Expiry Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Applicants</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPostings.map((job) => (
                <tr key={job.id}>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.employmentType || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.salary}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.postedDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.expiryDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{job.applicants || 0}</td>
                  <td className="px-4 py-3 text-sm capitalize text-gray-700">{job.status}</td>
                </tr>
              ))}
              {filteredPostings.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-3 text-center text-sm text-gray-500">
                    No job postings match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {!showPreview ? (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Job Posting</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                min={today}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
                rows={4}
                placeholder="Describe the job responsibilities and requirements"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
              >
                <option value="">Select Country</option>
                {countryOptions.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
                disabled={!formData.country}
              >
                <option value="">Select City</option>
                {formData.country && cityOptions[formData.country]?.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Range</label>
              <select
                name="experienceRange"
                value={formData.experienceRange}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
              >
                <option value="">Select Experience Range</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
              >
                <option value="">Select department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
                <option value="custom">Custom</option>
              </select>
              {formData.department === 'custom' && (
                <input
                  type="text"
                  name="customCategory"
                  value={formData.customCategory}
                  onChange={handleInputChange}
                  className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
                  placeholder="Enter custom category"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
              >
                <option value="">Select Education Level</option>
                <option value="High School">High School</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
              {formData.fieldOfStudy === 'Custom' ? (
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
                  placeholder="Enter custom field of study"
                />
              ) : (
                <select
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
                >
                  <option value="">Select Field of Study</option>
                  {fieldOfStudyOptions.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type of Work</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
              >
                <option value="">Select Type of Work</option>
                <option value="Permanent">Permanent</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
              >
                <option value="">Select Employment Type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
                placeholder=""
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handlePreview} className="bg-[#72c02c] hover:bg-[#72c02c] text-white focus:ring-[#72c02c]">
              Watch Preview
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Posting Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Position</h3>
                <p className="text-gray-900">{formData.title}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Application Deadline</h3>
                <p className="text-gray-900">{formData.deadline}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Location</h3>
                <p className="text-gray-900">{formData.city}, {formData.country}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Experience Range</h3>
                <p className="text-gray-900">{formData.experienceRange} years</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Description</h3>
                <p className="text-gray-900">{formData.description}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Job Category</h3>
                <p className="text-gray-900">{formData.department === 'custom' ? formData.customCategory : formData.department}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Education Level</h3>
                <p className="text-gray-900">{formData.educationLevel}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Field of Study</h3>
                <p className="text-gray-900">{formData.fieldOfStudy}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Type of Work</h3>
                <p className="text-gray-900">{formData.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Employment Type</h3>
                <p className="text-gray-900">{formData.employmentType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Salary</h3>
                <p className="text-gray-900">{formData.salary}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex space-x-4">
            <Button onClick={() => setShowPreview(false)} className="bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-600">
              Back to Edit
            </Button>
            <Button onClick={handleRequestPost} className="bg-[#72c02c] hover:bg-[#72c02c] text-white focus:ring-[#72c02c]">
              Request to Post
            </Button>
          </div>
        </Card>
      )}
    </div>
    </>
  );
};

export default HRJobPosting;