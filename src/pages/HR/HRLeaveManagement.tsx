import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { mockLeaveRequests } from '../../data/mockData';
import { LeaveRequest } from '../../types';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import PageHeader from '../../components/UI/PageHeader';

const HRLeaveManagement: React.FC = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [filters, setFilters] = useState({
    employeeId: '',
    status: '',
    type: ''
  });
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>(mockLeaveRequests);

  useEffect(() => {
    let result = [...mockLeaveRequests];

    if (filters.employeeId) {
      result = result.filter(req => req.employeeId === filters.employeeId);
    }
    if (filters.status) {
      result = result.filter(req => req.status === filters.status);
    }
    if (filters.type) {
      result = result.filter(req => req.type === filters.type);
    }

    setFilteredRequests(result);
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAction = (requestId: string, action: 'approved' | 'rejected', comments: string = '') => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: action, approvedBy: user?.name, comments }
        : req
    ));
    toast.success(`Leave request ${action} successfully`);
  };

  const downloadLeaveReportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor('#059669');
    doc.text('Leave Requests Report', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Employee', 'Type', 'Start Date', 'End Date', 'Days', 'Reason', 'Status', 'Applied Date', 'Comments']],
      body: filteredRequests.map(req => [
        req.employeeName,
        req.type,
        req.startDate,
        req.endDate,
        req.days,
        req.reason,
        req.status,
        req.appliedDate,
        req.comments || '—'
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [5, 150, 105] }
    });

    doc.save(`Leave-Report-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('Leave report downloaded successfully');
  };

  const employeesOnLeave = leaveRequests.filter(req => 
    req.status === 'approved' && 
    new Date(req.startDate) <= new Date() && 
    new Date(req.endDate) >= new Date()
  );

  const uniqueStatuses = Array.from(new Set(mockLeaveRequests.map(req => req.status)));
  const uniqueTypes = ['annual', 'sick', 'personal', 'maternity', 'emergency'];
//   const employees = mockEmployees;

  return (
    <div className="space-y-6">
      <PageHeader title='Leave Request Management'/>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={downloadLeaveReportPdf}>
          📄 Download Leave Report
        </Button>
      </div>


      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-[#72c02c] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Employee</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Start Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">End Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Days</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Reason</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Applied Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Comments</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.employeeName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.startDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.endDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.days}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.reason}</td>
                  <td className="px-4 py-3 text-sm capitalize text-gray-700">{req.status}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.appliedDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.comments || '—'}</td>
                  <td className="px-4 py-3 text-sm">
                    {req.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          className="bg-[#72c02c] hover:bg-[#72c02c] text-white focus:ring-[#72c02c]"
                          size="sm"
                          onClick={() => handleAction(req.id, 'approved', 'Approved by HR')}
                        >
                          Approve
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white focus:ring-red-600"
                          size="sm"
                          onClick={() => handleAction(req.id, 'rejected', 'Rejected by HR')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-3 text-center text-sm text-gray-500">
                    No leave requests match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Employees Currently on Leave</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-[#72c02c] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Employee</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Start Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Return Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Days</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeesOnLeave.map((req) => (
                <tr key={req.id}>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.employeeName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.startDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.endDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{req.days}</td>
                </tr>
              ))}
              {employeesOnLeave.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center text-sm text-gray-500">
                    No employees currently on leave.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default HRLeaveManagement;