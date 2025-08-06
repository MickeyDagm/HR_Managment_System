import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import { mockAttendanceRecords, mockEmployees } from '../data/mockData';
import { AttendanceRecord } from '../types';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import PageHeader from '../components/UI/PageHeader';

const HRAttendance: React.FC = () => {
  const [filters, setFilters] = useState({
    employeeId: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);

  useEffect(() => {
    let result = [...mockAttendanceRecords];

    // Apply filters
    if (filters.employeeId) {
      result = result.filter(record => record.employeeId === filters.employeeId);
    }
    if (filters.status) {
      result = result.filter(record => record.status === filters.status);
    }
    if (filters.startDate) {
      result = result.filter(record => new Date(record.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      result = result.filter(record => new Date(record.date) <= new Date(filters.endDate));
    }

    setFilteredRecords(result);
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const downloadAttendancePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor('#059669');
    doc.text('Employee Attendance Report', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Employee', 'Date', 'Check In', 'Check Out', 'Hours Worked', 'Status']],
      body: filteredRecords.map(record => {
        const employee = mockEmployees.find(emp => emp.id === record.employeeId);
        return [
          employee?.name ?? 'Unknown',
          record.date ?? '—',
          record.checkIn ?? '—',
          record.checkOut ?? '—',
          record.hoursWorked !== undefined && record.hoursWorked !== null ? record.hoursWorked.toFixed(2) : '—',
          record.status ?? '—'
        ].map(cell => cell ?? '—');
      }),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [5, 150, 105] }
    });

    const fileName = `Attendance-Report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success('Attendance report downloaded successfully');
  };

  const uniqueStatuses = Array.from(new Set(mockAttendanceRecords.map(record => record.status)));
//   const employees = mockEmployees;

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance Management" />

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#72c02c] focus:border-[#72c02c]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={downloadAttendancePdf}>
          📄 Download Attendance Report
        </Button>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-[#72c02c] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Employee</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Check In</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Check Out</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Hours Worked</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => {
                const employee = mockEmployees.find(emp => emp.id === record.employeeId);
                return (
                  <tr key={record.id}>
                    <td className="px-4 py-3 text-sm text-gray-700">{employee?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{record.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{record.checkIn}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{record.checkOut || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {record.hoursWorked !== undefined && record.hoursWorked !== null
                        ? record.hoursWorked.toFixed(2)
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize text-gray-700">{record.status}</td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-3 text-center text-sm text-gray-500">
                    No attendance records match the selected filters.
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

export default HRAttendance;