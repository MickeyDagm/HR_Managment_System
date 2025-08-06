import React, { useState } from 'react';
import { Clock, Calendar, TrendingUp, CheckCircle, XCircle, TrendingDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockAttendanceRecords } from '../data/mockData';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import StatCard from '../components/UI/StatCard';
import { Helmet } from "react-helmet-async";

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string>('');
  
  const employeeAttendance = mockAttendanceRecords.filter(record => record.employeeId === user?.id);

  const handleCheckIn = () => {
    const now = new Date();
    setCheckInTime(now.toLocaleTimeString());
    setIsCheckedIn(true);
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime('');
  };

  const totalHours = employeeAttendance.reduce((sum, record) => sum + (record.hoursWorked || 0), 0);
  const workingDays = 22; 
  const attendanceRate = Math.round((employeeAttendance.length / workingDays) * 100);

  return (
    <>
    <Helmet>
        <title>Attendance | HR Management System</title>
      </Helmet>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <div className="text-sm text-gray-500">
          Today: {new Date().toLocaleDateString()}
        </div>
      </div>
      {/* Check In/Out Section */}
      <Card>
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#def8ca] rounded-full mb-4">
              <Clock className="w-10 h-10 text-[#72c02c]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isCheckedIn ? 'Checked In' : 'Ready to Check In'}
            </h2>
            {isCheckedIn && (
              <p className="text-gray-600">Check-in time: {checkInTime}</p>
            )}
          </div>
          <div className="flex justify-center space-x-4">
            {!isCheckedIn ? (
              <Button onClick={handleCheckIn} size="lg">
                <CheckCircle className="w-5 h-5 mr-2" />
                Check In
              </Button>
            ) : (
              <Button onClick={handleCheckOut} variant="secondary" size="lg">
                <XCircle className="w-5 h-5 mr-2" />
                Check Out
              </Button>
            )}
          </div>
        </div>
      </Card>
      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Hours"
          value={`${totalHours} hrs`}
          icon={Clock}
          color="emerald"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={attendanceRate>=30 ? TrendingUp : TrendingDown}
          color={attendanceRate>=70 ? "emerald" : attendanceRate>=50 ? "blue" : attendanceRate>=30 ? "orange" : "red"}
        />
        <StatCard
          title="Working Days"
          value={`${employeeAttendance.length}/${workingDays}`}
          icon={Calendar}
          color="blue"
        />
      </div>
      {/* Attendance History */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeeAttendance.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.checkIn || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.checkOut || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.hoursWorked || 0} hrs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'present' ? 'bg-green-100 text-green-800' :
                      record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
    </>
  );
};
export default Attendance;