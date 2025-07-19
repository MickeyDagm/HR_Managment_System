import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/UI/Button';
import { mockJobPostings, mockCompanies, approveJobPost } from '../../data/mockData';
import { JobPosting } from '../../types';

const AdminJobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const foundJob = mockJobPostings.find(job => job.id === id);
    setJob(foundJob || null);
    setLoading(false);
  }, [id]);

  const handleApproveJob = () => {
    if (job) {
      approveJobPost(job.id); // Updates mockJobPostings
      setJob({ ...job, approved: 'approved' });
      toast.success('Job posting approved successfully!');
      setTimeout(() => navigate('/admin/job-postings'), 1000); // Navigate back after 1s
    }
  };

  const handleRejectJob = () => {
    if (job) {
      const jobIndex = mockJobPostings.findIndex(j => j.id === job.id);
      if (jobIndex !== -1) {
        mockJobPostings[jobIndex] = { ...mockJobPostings[jobIndex], approved: 'rejected' };
      }
      setJob({ ...job, approved: 'rejected' });
      toast.success('Job posting rejected successfully!');
      setTimeout(() => navigate('/job-postings'), 1000); // Navigate back after 1s
    }
  };

  const handlePostToWeb = () => {
    if (job) {
      // Prepare job data for backend processing
      const jobDataForBackend = {
        id: job.id,
        title: job.title,
        department: job.department,
        companyId: job.companyId,
        location: job.location,
        salary: job.salary,
        employmentType: job.employmentType,
        experience: job.experience,
        education: job.education,
        description: job.description,
        postedDate: job.postedDate,
        expiryDate: job.expiryDate,
        approved: 'posted' // New status for posted jobs
      };
      
      // Log data for now (replace with API call in production)
      console.log('Prepared job data for backend:', JSON.stringify(jobDataForBackend, null, 2));

      // Update mockJobPostings with new status
      const jobIndex = mockJobPostings.findIndex(j => j.id === job.id);
      if (jobIndex !== -1) {
        mockJobPostings[jobIndex] = { ...mockJobPostings[jobIndex], approved: 'posted' };
      }
      setJob({ ...job, approved: 'posted' });
      toast.success('Job posting prepared for web successfully!');
      setTimeout(() => navigate('/job-postings'), 1000); 
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="bg-gradient-to-r from-[#72c02c] to-[#72c02c] rounded-xl p-6 text-white mb-3">
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
        </div>
        <p className="text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-4">
        <div className="bg-gradient-to-r from-[#72c02c] to-[#72c02c] rounded-xl p-6 text-white mb-3">
          <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
        </div>
        <p className="text-gray-600">The job posting could not be found.</p>
        <Button onClick={() => navigate('/job-postings')} className="mt-4">
          Back to Job Postings
        </Button>
      </div>
    );
  }

  const company = mockCompanies.find(c => c.id === job.companyId);

  return (
    <div className="p-4">
      <div className="bg-gradient-to-r from-[#72c02c] to-[#72c02c] rounded-xl p-6 text-white mb-3">
        <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Job Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Department:</p>
            <p className="text-gray-600">{job.department}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Company:</p>
            <p className="text-gray-600">{company?.name || '—'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Location:</p>
            <p className="text-gray-600">{job.location}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Status:</p>
            <p className="text-gray-600 capitalize">{job.approved}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Applicants:</p>
            <p className="text-gray-600">{job.applicants}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Salary:</p>
            <p className="text-gray-600">{job.salary}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Employment Type:</p>
            <p className="text-gray-600">{job.employmentType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Experience:</p>
            <p className="text-gray-600">{job.experience}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Education:</p>
            <p className="text-gray-600">{job.education}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-700">Description:</p>
            <p className="text-gray-600">{job.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Posted Date:</p>
            <p className="text-gray-600">{job.postedDate}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Expiry Date:</p>
            <p className="text-gray-600">{job.expiryDate}</p>
          </div>
        </div>
        {job.approved === 'pending' && (
          <div className="mt-6 flex gap-4">
            <Button size="sm" onClick={handleApproveJob}>Approve</Button>
            <Button size="sm" className="bg-red-500 hover:bg-red-600" onClick={handleRejectJob}>Reject</Button>
          </div>
        )}
      </div>
      <div className='flex space-x-4'>
        <Button onClick={() => navigate('/job-postings')}>
            Back to Job Postings
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600 focus:ring-blue-600" onClick={handlePostToWeb}>Post to Web</Button>
      </div>
      
    </div>
  );
};

export default AdminJobDetail;