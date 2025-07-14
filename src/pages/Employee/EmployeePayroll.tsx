// src/pages/Employee/EmployeePayroll.tsx

import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { getPayrollByEmployee } from '../../data/mockData';
import Card from '../../components/UI/Card';
import  Button  from '../../components/UI/Button';

const EmployeePayroll: React.FC = () => {
  const { user } = useAuth();
  const payrolls = user ? getPayrollByEmployee(user.id) : [];
  const latest = payrolls.length > 0 ? payrolls[payrolls.length - 1] : undefined; // latest payslip for monthly PDF

  const downloadYearlyPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor('#059669'); // emerald
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

    // Box layout
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
      headStyles: { fillColor: [16, 185, 129] }, // emerald
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
      headStyles: { fillColor: [239, 68, 68] }, // red
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

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Payroll History</h1>
        <p className="text-emerald-100">Here’s your payroll record, {user?.name}</p>
      </div>

      <div className="flex justify-between">
        <div className="flex space-x-4">
          <Button onClick={downloadMonthlyPayslip}>
            📄 Download Monthly Payslip
          </Button>
          <Button onClick={downloadYearlyPdf}>
            📁 Download Yearly Summary
          </Button>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-600" onClick={() => toast.success('Request for advance payment submitted')}>
          Request for Advance Payment
        </Button>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-emerald-600 text-white">
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
    </div>
  );
};

export default EmployeePayroll;
