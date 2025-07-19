
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/UI/Button';
import { mockUsers, mockApplicants, mockCompanies, approveEmployee, rejectEmployee } from '../../data/mockData';
import { User, Applicant } from '../../types';
import PageHeader from '../../components/UI/PageHeader';

const AdminUserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entity, setEntity] = useState<User | Applicant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const user = mockUsers.find(user => user.id === id);
    const applicant = mockApplicants.find(applicant => applicant.id === id);
    setEntity(user || applicant || null);
    setLoading(false);
  }, [id]);

  const handleApprove = () => {
    if (entity) {
      approveEmployee(entity.id);
      setEntity(prev => {
        if (!prev) return null;
        if ('role' in prev) {
          return { ...prev, approved: 'approved' } as User;
        }
        return { ...prev, approved: 'approved' } as Applicant;
      });
      toast.success(`${'role' in entity ? 'User' : 'Applicant'} approved successfully!`);
      setTimeout(() => navigate('/user-records'), 1000);
    }
  };

  const handleReject = () => {
    if (entity) {
      rejectEmployee(entity.id);
      setEntity(prev => {
        if (!prev) return null;
        if ('role' in prev) {
          return { ...prev, approved: 'rejected' } as User;
        }
        return { ...prev, approved: 'rejected' } as Applicant;
      });
      toast.success(`${'role' in entity ? 'User' : 'Applicant'} rejected successfully!`);
      setTimeout(() => navigate('/user-records'), 1000);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white mb-3">
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
        </div>
        <p className="text-gray-600">Loading details...</p>
      </div>
    );
  }

  if (!entity) {
    return (
      <div className="p-4">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white mb-3">
          <h1 className="text-2xl font-bold mb-2">Not Found</h1>
        </div>
        <p className="text-gray-600">The user or applicant could not be found.</p>
        <Button onClick={() => navigate('/user-records')} className="mt-4">
          Back to User Management
        </Button>
      </div>
    );
  }

  const company = mockCompanies.find(c => c.id === entity.companyId);
  const isUser = 'role' in entity;

  return (
    <div className="p-4">
      <PageHeader title={entity.name}/>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">{isUser ? 'User' : 'Applicant'} Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Name:</p>
            <p className="text-gray-600">{entity.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Email:</p>
            <p className="text-gray-600">{entity.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Phone:</p>
            <p className="text-gray-600">{entity.phone || '—'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Company:</p>
            <p className="text-gray-600">{company?.name || '—'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Approval Status:</p>
            <p className="text-gray-600 capitalize">{entity.approved}</p>
          </div>
          {isUser && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-700">Role:</p>
                <p className="text-gray-600">{entity.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Employee ID:</p>
                <p className="text-gray-600">{entity.employeeId || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Department:</p>
                <p className="text-gray-600">{entity.department || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Position:</p>
                <p className="text-gray-600">{entity.position || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Date of Hire:</p>
                <p className="text-gray-600">{entity.dateOfHire || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Address:</p>
                <p className="text-gray-600">{entity.address || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Salary:</p>
                <p className="text-gray-600">{entity.salary ? `ETB ${entity.salary.toLocaleString()}` : '—'}</p>
              </div>
            </>
          )}
          {!isUser && (
            <>
              <div>
                <p className="text-sm font-medium text-gray-700">Job ID:</p>
                <p className="text-gray-600">{entity.jobId || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Job Title:</p>
                <p className="text-gray-600">{entity.jobTitle || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Applied Date:</p>
                <p className="text-gray-600">{entity.appliedDate || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Resume:</p>
                <p className="text-gray-600">{entity.resume || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Cover Letter:</p>
                <p className="text-gray-600">{entity.coverLetter || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Skills:</p>
                <p className="text-gray-600">{entity.skills?.join(', ') || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Experience:</p>
                <p className="text-gray-600">{entity.experience || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Education:</p>
                <p className="text-gray-600">{entity.education || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Interview Date:</p>
                <p className="text-gray-600">{entity.interviewDate || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Interview Time:</p>
                <p className="text-gray-600">{entity.interviewTime || '—'}</p>
              </div>
            </>
          )}
        </div>
        {entity.approved === 'pending' && (
          <div className="mt-6 flex gap-4">
            <Button size="sm" onClick={handleApprove}>Approve</Button>
            <Button size="sm" className="bg-red-500 hover:bg-red-600" onClick={handleReject}>Reject</Button>
          </div>
        )}
      </div>
      <Button onClick={() => navigate('/user-records')} className="mt-4">
        Back to User Management
      </Button>
    </div>
  );
};

export default AdminUserDetail;