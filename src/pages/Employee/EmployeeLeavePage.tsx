import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { useAuth } from '../../contexts/AuthContext';
import { mockLeaveRequests } from '../../data/mockData';
import { LeaveRequest } from '../../types';
import PageHeader from '../../components/UI/PageHeader';

const EmployeeLeavePage: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>(
    mockLeaveRequests.filter(l => l.employeeId === user?.id)
  );

  const [formData, setFormData] = useState<{
    type: 'annual' | 'sick' | 'personal' | 'maternity' | 'emergency',
    startDate: string,
    endDate: string,
    reason: string
  }>({
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate || !formData.reason) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const newLeave: LeaveRequest = {
      id: String(Date.now()),
      employeeId: user?.id!,
      employeeName: user?.name!,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: 1, 
      reason: formData.reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };

    try {
      setLeaves(prev => [newLeave, ...prev]);
      setFormData({ type: 'annual', startDate: '', endDate: '', reason: '' });
      toast.success('Leave request submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit leave request.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title='Leave Management'/>'

      {/* Apply for Leave */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for Leave</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
            >
              <option value="annual">Annual</option>
              <option value="sick">Sick</option>
              <option value="maternity">Maternity</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
              placeholder="Write a short reason..."
              required
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" className="w-full md:w-auto">
              Submit Leave Request
            </Button>
          </div>
        </form>
      </Card>

      {/* Leave Tracking Section */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Request History</h3>
        {leaves.length === 0 ? (
          <p className="text-gray-500">No leave requests submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {leaves.map((leave) => (
              <div
                key={leave.id}
                className="p-3 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-200"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave
                  </p>
                  <p className="text-xs text-gray-500">
                    {leave.startDate} - {leave.endDate}
                  </p>
                  <p className="text-xs text-gray-500 italic">Reason: {leave.reason}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    leave.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : leave.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {leave.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmployeeLeavePage;
