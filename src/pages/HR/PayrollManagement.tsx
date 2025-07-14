import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { mockPayrollRecords, mockEmployees } from '../../data/mockData';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { PayrollRecord } from '../../types';

const HRPayroll: React.FC = () => {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>(mockPayrollRecords);

  const handleApprovePayment = (payrollId: string) => {
    setPayrolls(payrolls.map(record => 
      record.id === payrollId ? { ...record, status: 'approved' } : record
    ));
    toast.success('Payment approved successfully');
  };

  const downloadMonthlyPdf = (month: string, year: number) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor('#059669');
    doc.text(`Payroll for ${month} ${year}`, 14, 20);

    const monthlyPayrolls = payrolls.filter(p => p.month === month && p.year === year);

    autoTable(doc, {
      startY: 30,
      head: [['Employee', 'Basic Salary', 'Allowances', 'Overtime', 'Bonuses', 'Deductions', 'Taxes', 'Penalties', 'Net Salary', 'Status']],
      body: monthlyPayrolls.map(p => [
        p.employeeName,
        `ETB ${p.basicSalary.toLocaleString()}`,
        `ETB ${p.allowances.toLocaleString()}`,
        `ETB ${p.overtime.toLocaleString()}`,
        `ETB ${p.bonuses.toLocaleString()}`,
        `ETB ${p.deductions.toLocaleString()}`,
        `ETB ${p.taxes.toLocaleString()}`,
        `ETB ${p.penalties.toLocaleString()}`,
        `ETB ${p.netSalary.toLocaleString()}`,
        p.status || 'pending'
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [5, 150, 105] }
    });

    doc.save(`Payroll-${month}-${year}.pdf`);
    toast.success(`Monthly payroll for ${month} ${year} downloaded successfully`);
  };

  const downloadYearlyPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor('#059669');
    doc.text('Yearly Payroll Summary', 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Employee', 'Month', 'Basic Salary', 'Allowances', 'Overtime', 'Bonuses', 'Deductions', 'Taxes', 'Penalties', 'Net Salary', 'Status']],
      body: payrolls.map(p => [
        p.employeeName,
        `${p.month} ${p.year}`,
        `ETB ${p.basicSalary.toLocaleString()}`,
        `ETB ${p.allowances.toLocaleString()}`,
        `ETB ${p.overtime.toLocaleString()}`,
        `ETB ${p.bonuses.toLocaleString()}`,
        `ETB ${p.deductions.toLocaleString()}`,
        `ETB ${p.taxes.toLocaleString()}`,
        `ETB ${p.penalties.toLocaleString()}`,
        `ETB ${p.netSalary.toLocaleString()}`,
        p.status || 'pending'
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [5, 150, 105] }
    });

    doc.save('Yearly-Payroll-Summary.pdf');
    toast.success('Yearly payroll summary downloaded successfully');
  };

  const uniqueMonths = Array.from(new Set(payrolls.map(p => `${p.month} ${p.year}`)));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Payroll Management</h1>
        {/* <p className="text-emerald-100">Manage employee payrolls, {user?.name}</p> */}
      </div>

      <div className="flex justify-between">
        <div className="flex space-x-4">
          {uniqueMonths.map((monthYear, index) => (
            <Button key={index} onClick={() => {
              const [month, year] = monthYear.split(' ');
              downloadMonthlyPdf(month, parseInt(year));
            }}>
              📄 Download {monthYear}
            </Button>
          ))}
          <Button onClick={downloadYearlyPdf}>
            📁 Download Yearly Summary
          </Button>
        </div>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payroll Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Employee</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Month</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Basic Salary</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Allowances</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Overtime</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Bonuses</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Deductions</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Taxes</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Penalties</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Net Salary</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payrolls.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-3 text-sm text-gray-700">{record.employeeName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{record.month} {record.year}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">ETB {record.basicSalary.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">ETB {record.allowances.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">ETB {record.overtime.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">ETB {record.bonuses.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-red-500">- ETB {record.deductions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-red-500">- ETB {record.taxes.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-red-500">- ETB {record.penalties.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-700">ETB {record.netSalary.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{record.status || 'pending'}</td>
                  <td className="px-4 py-3 text-sm">
                    {record.status !== 'approved' && (
                      <Button
                        className="bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-600"
                        onClick={() => handleApprovePayment(record.id)}
                      >
                        Approve
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {payrolls.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-4 py-3 text-center text-sm text-gray-500">
                    No payroll records available.
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

export default HRPayroll;