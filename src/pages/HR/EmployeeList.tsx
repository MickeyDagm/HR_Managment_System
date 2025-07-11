// src/pages/Employee/EmployeeList.tsx

import React, { useEffect, useState } from 'react';
import Table from '../../components/UI/Table';
import { mockEmployees } from '../../data/mockData';
import { Employee } from '../../types/index'; 
import Button from '../../components/UI/Button';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Later replace with API call:
    // const res = await fetch('/api/employees');
    // const data = await res.json();
    // setEmployees(data);

    setEmployees(mockEmployees); // Using mock for now
  }, []);

  const headers = [
    'Name',
    'Employee ID',
    'Department',
    'Position',
    'Email',
    'Phone',
    'Status',
    'Manager',
    'Actions'
  ];

  return (
    <div className="p-4">
       <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-6 text-white mb-3">
            <h1 className="text-2xl font-bold mb-2">Employee List</h1>
      </div>
      <Table headers={headers} className='rounded-lg'>
        {employees.map((emp) => (
          <tr key={emp.id} className='odd:bg-emerald-50 '>
            <td className="px-6 py-4 text-sm text-gray-900">{emp.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{emp.employeeId}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{emp.email}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{emp.phone}</td>
            <td className="px-6 py-4 text-sm capitalize text-gray-600">{emp.status}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{emp.manager || '—'}</td>
            <td className="px-6 py-4 text-sm">
              <Button size="sm">View Details</Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
};

export default EmployeeList;
