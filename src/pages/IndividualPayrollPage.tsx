import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { getPayrollByEmployee } from '../data/mockData';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import PageHeader from '../components/UI/PageHeader';
import { Helmet } from "react-helmet-async";

interface AdvanceRequest {
  id: string;
  reason: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const EmployeePayroll: React.FC = () => {
  const { user } = useAuth();
  const payrolls = user ? getPayrollByEmployee(user.id) : [];
  const latest = payrolls.length > 0 ? payrolls[payrolls.length - 1] : undefined;
  
  // State for advance payment popup and requests
  const [showAdvancePopup, setShowAdvancePopup] = useState(false);
  const [advanceReason, setAdvanceReason] = useState('');
  const [advanceRequests, setAdvanceRequests] = useState<AdvanceRequest[]>([]);

  const downloadYearlyPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor('#059669');
    doc.text(`${user?.name}'s Yearly Payroll`, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Month', 'Basic Salary', 'Allowances', 'Overtime', 'Bonuses', 'Deductions', 'Taxes', 'Penalties', 'Net Salary']],
      body: payrolls.map(p => [
        `${p.month} ${p.year}`,
        `ETB ${p.basicSalary.toLocaleString()}`,
        `ETB ${p.allowances.toLocaleString()}`,
        `ETB ${p.overtime.toLocaleString()}`,
        `ETB ${p.bonuses.toLocaleString()}`,
        `ETB ${p.deductions.toLocaleString()}`,
        `ETB ${p.taxes.toLocaleString()}`,
        `ETB ${p.penalties.toLocaleString()}`,
        `ETB ${p.netSalary.toLocaleString()}`
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [5, 150, 105] }
    });

    doc.save(`${user?.name}-YearlyPayroll.pdf`);
    toast.success('Yearly summary downloaded successfully');
  };

  const downloadMonthlyPayslip = () => {
    if (!latest) return;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor('#064e3b');
    doc.text('Monthly Payslip', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor('#111827');
    doc.text(`Name: ${user?.name}`, 14, 30);
    doc.text(`Month: ${latest.month} ${latest.year}`, 14, 36);
    doc.text(`Position: ${user?.position}`, 14, 42);
    doc.text(`Department: ${user?.department}`, 14, 48);

    let earningsTableFinalY = 60;
    autoTable(doc, {
      startY: 60,
      head: [['Earnings', 'Amount']],
      body: [
        ['Basic Salary', `ETB ${latest.basicSalary.toLocaleString()}`],
        ['Allowances', `ETB ${latest.allowances.toLocaleString()}`],
        ['Overtime', `ETB ${latest.overtime.toLocaleString()}`],
        ['Bonuses', `ETB ${latest.bonuses.toLocaleString()}`]
      ],
      styles: { fontSize: 11 },
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      didDrawPage: function (data) {
        if (data.cursor) {
          earningsTableFinalY = data.cursor.y;
        }
      }
    });

    let deductionsTableFinalY = earningsTableFinalY + 10;
    autoTable(doc, {
      startY: earningsTableFinalY + 10,
      head: [['Deductions', 'Amount']],
      body: [
        ['Deductions', `ETB ${latest.deductions.toLocaleString()}`],
        ['Taxes', `ETB ${latest.taxes.toLocaleString()}`],
        ['Penalties', `ETB ${latest.penalties.toLocaleString()}`]
      ],
      styles: { fontSize: 11 },
      theme: 'grid',
      headStyles: { fillColor: [239, 68, 68] },
      didDrawPage: function (data) {
        if (data.cursor) {
          deductionsTableFinalY = data.cursor.y;
        }
      }
    });

    doc.setTextColor('#065f46');
    doc.setFontSize(14);
    doc.text(`Net Pay: ETB ${latest.netSalary.toLocaleString()}`, 14, deductionsTableFinalY + 15);

    doc.save(`${user?.name}-${latest.month}-${latest.year}-Payslip.pdf`);
    toast.success('Monthly payslip downloaded successfully');
  };

  const handleAdvanceRequest = () => {
    if (!advanceReason.trim()) {
      toast.error('Please provide a reason for the advance request');
      return;
    }

    const newRequest: AdvanceRequest = {
      id: Math.random().toString(36).substr(2, 9),
      reason: advanceReason,
      date: new Date().toLocaleDateString(),
      status: 'Pending'
    };

    setAdvanceRequests([...advanceRequests, newRequest]);
    setAdvanceReason('');
    setShowAdvancePopup(false);
    toast.success('Advance payment request submitted successfully');
  };

  return (
    <>
    <Helmet>
      <title>Payroll | HR Management System</title>
    </Helmet>
    <div className="space-y-6">
      <PageHeader title='Payroll History'/>

      <div className="flex justify-between">
        <div className="flex space-x-4">
          <Button onClick={downloadMonthlyPayslip}>
            📄 Download Monthly Payslip
          </Button>
          <Button onClick={downloadYearlyPdf}>
            📁 Download Yearly Summary
          </Button>
        </div>
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-600" 
          onClick={() => setShowAdvancePopup(true)}
        >
          Request for Advance Payment
        </Button>
      </div>

      {/* Advance Payment Request Popup */}
      {showAdvancePopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Advance Payment Request</h2>
            <textarea
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-emerald-500"
              rows={4}
              value={advanceReason}
              onChange={(e) => setAdvanceReason(e.target.value)}
              placeholder="Enter reason for advance payment..."
            />
            <div className="mt-4 flex justify-end space-x-2">
              <Button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => {
                  setAdvanceReason('');
                  setShowAdvancePopup(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleAdvanceRequest}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-[#72c02c] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Month</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Basic Salary</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Allowances</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Overtime</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Bonuses</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Deductions</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Taxes</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Penalties</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Net Salary</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrolls.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-3 text-sm text-gray-700">{record.month} {record.year}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">ETB {record.basicSalary.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">ETB {record.allowances.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">ETB {record.overtime.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">ETB {record.bonuses.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-red-500">- ETB {record.deductions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-red-500">- ETB {record.taxes.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-red-500">- ETB {record.penalties.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-700">ETB {record.netSalary.toLocaleString()}</td>
                </tr>
              ))}
              {payrolls.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-3 text-center text-sm text-gray-500">
                    No payroll records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pending Advance Requests Section */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Advance Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-[#72c02c] text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Reason</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {advanceRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-4 py-3 text-sm text-gray-700">{request.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{request.reason}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{request.status}</td>
                </tr>
              ))}
              {advanceRequests.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-center text-sm text-gray-500">
                    No pending advance requests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </>
  );
};

export default EmployeePayroll;
