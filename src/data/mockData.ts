import { User, Employee, AttendanceRecord, LeaveRequest, PayrollRecord, JobPosting, Notification, DashboardStats } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Abebe Kebede',
    email: 'abebe.kebede@company.com',
    role: 'employee',
    avatar: '',
    department: 'Engineering',
    position: 'Software Developer',
    employeeId: 'EMP001',
    dateOfHire: '2022-01-15',
    status: 'active',
    salary: 75000,
    phone: '+251-911-234-567',
    address: 'Bole Sub City, Addis Ababa, Ethiopia'
  },
  {
    id: '2',
    name: 'Mulatu Tesfaye',
    email: 'mulatu.tesfaye@company.com',
    role: 'hr',
    avatar: '',
    department: 'Human Resources',
    position: 'HR Manager',
    employeeId: 'HR001',
    dateOfHire: '2021-03-10',
    status: 'active',
    salary: 85000,
    phone: '+251-911-345-678',
    address: 'Gerji Kebele, Addis Ababa, Ethiopia'
  },
  {
    id: '3',
    name: 'Hanna Alemayehu',
    email: 'hana.alemayehu@company.com',
    role: 'admin',
    avatar: '',
    department: 'Administration',
    position: 'System Administrator',
    employeeId: 'ADM001',
    dateOfHire: '2020-06-01',
    status: 'active',
    salary: 90000,
    phone: '+251-911-456-789',
    address: 'kirkos Sub City, Addis Ababa, Ethiopia'
  }
];

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Abebe Kebede',
    email: 'abebe.kebede@company.com',
    role: 'employee',
    avatar: '',
    department: 'Engineering',
    position: 'Software Developer',
    employeeId: 'EMP001',
    dateOfHire: '2022-01-15',
    status: 'active',
    salary: 75000,
    phone: '+251-911-234-567',
    address: 'Bole Sub City, Addis Ababa, Ethiopia',
    manager: 'Mulatu Tesfaye',
    skills: ['React', 'Node.js', 'TypeScript', 'Python'],
    performanceRating: 4.5
  },
  {
    id: '4',
    name: 'Helen Tesfaye',
    email: 'helen.tesfaye@company.com',
    role: 'employee',
    avatar: '',
    department: 'Finance',
    position: 'Senior Accountant',
    employeeId: 'EMP002',
    dateOfHire: '2022-01-15',
    status: 'active',
    salary: 75000,
    phone: '+251-911-234-567',
    address: 'Kality Sub City, Addis Ababa, Ethiopia',
    manager: 'Mulatu Tesfaye',
    skills: ['Digital Marketing', 'SEO', 'Content Creation', 'Analytics'],
    performanceRating: 4.2
  },
  {
    id: '5',
    name: 'Feven Haile',
    email: 'abebe.kebede@company.com',
    role: 'employee',
    avatar: '',
    department: 'Sales',
    position: 'Sales Executive',
    employeeId: 'EMP003',
    dateOfHire: '2022-01-15',
    status: 'active',
    salary: 75000,
    phone: '+251-911-234-567',
    address: 'Yeka Sub City, Addis Ababa, Ethiopia',
    manager: 'Mulatu Tesfaye',
    skills: ['Customer Relations', 'Negotiation', 'CRM Software', 'Lead Generation'],
    performanceRating: 4.0
  },
  {
    id: '5',
    name: 'Melaku Alemu',
    email: 'melaku.alemu@company.com',
    role: 'employee',
    avatar: '',
    department: 'Customer Support',
    position: 'Customer Support Specialist',
    employeeId: 'EMP004',
    dateOfHire: '2022-01-15',
    status: 'active',
    salary: 75000,
    phone: '+251-911-234-567',
    address: 'Arada Sub City, Addis Ababa, Ethiopia',
    manager: 'Mulatu Tesfaye',
    skills: ['Customer Relations', 'Negotiation', 'CRM Software', 'Lead Generation'],
    performanceRating: 4.0
  }
];

// Mock Attendance Records
export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '1',
    date: '2024-01-15',
    checkIn: '09:00',
    checkOut: '17:30',
    hoursWorked: 8.5,
    status: 'present'
  },
  {
    id: '2',
    employeeId: '1',
    date: '2024-01-16',
    checkIn: '09:15',
    checkOut: '17:45',
    hoursWorked: 8.5,
    status: 'late'
  },
  {
    id: '3',
    employeeId: '4',
    date: '2024-01-15',
    checkIn: '08:45',
    checkOut: '17:15',
    hoursWorked: 8.5,
    status: 'present'
  }
];

// Mock Leave Requests
export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Abebe Kebede',
    type: 'annual',
    startDate: '2024-02-01',
    endDate: '2024-02-03',
    days: 3,
    reason: 'Family vacation',
    status: 'pending',
    appliedDate: '2024-01-15'
  },
  {
    id: '2',
    employeeId: '4',
    employeeName: 'Helen Tesfaye',
    type: 'sick',
    startDate: '2024-01-20',
    endDate: '2024-01-20',
    days: 1,
    reason: 'Flu symptoms',
    status: 'approved',
    approvedBy: 'Sarah Johnson',
    comments: 'Approved. Get well soon!',
    appliedDate: '2024-01-19'
  }
];

// Mock Payroll Records
export const mockPayrollRecords: PayrollRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Abebe Kebede',
    month: 'January',
    year: 2024,
    basicSalary: 75000,
    allowances: 5000,
    overtime: 2000,
    deductions: 1500,
    taxes: 15000,
    netSalary: 65500,
    bonuses: 3000,
    penalties: 0
  },
  {
    id: '2',
    employeeId: '4',
    employeeName: 'Helen Tesfaye',
    month: 'January',
    year: 2024,
    basicSalary: 65000,
    allowances: 4000,
    overtime: 1500,
    deductions: 1200,
    taxes: 12000,
    netSalary: 57300,
    bonuses: 2000,
    penalties: 0
  }
];

// Mock Job Postings
export const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    description: 'We are looking for a skilled Frontend Developer to join our team and help build amazing user experiences.',
    requirements: ['React', 'TypeScript', '3+ years experience', 'UI/UX knowledge'],
    salary: 'ETB 80,000 - ETB 100,000',
    type: 'full-time',
    location: 'Remote',
    postedDate: '2024-01-10',
    expiryDate: '2024-02-10',
    status: 'active',
    applicants: 15
  },
  {
    id: '2',
    title: 'Marketing Coordinator',
    department: 'Marketing',
    description: 'Join our marketing team to create compelling campaigns and drive business growth.',
    requirements: ['Digital Marketing', 'Content Creation', '2+ years experience', 'Analytics'],
    salary: 'ETB 60,000 - ETB 75,000',
    type: 'full-time',
    location: 'Bole Sub City, Addis Ababa',
    postedDate: '2024-01-12',
    expiryDate: '2024-02-12',
    status: 'active',
    applicants: 8
  }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Leave Request Update',
    message: 'Your leave request for Feb 1-3 is pending approval.',
    type: 'info',
    read: false,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    title: 'Payslip Available',
    message: 'Your January payslip is now available for download.',
    type: 'success',
    read: true,
    createdAt: '2024-01-14T09:00:00Z'
  },
  {
    id: '3',
    userId: '2',
    title: 'New Leave Request',
    message: 'Abebe Kebede has submitted a new leave request for your approval.',
    type: 'warning',
    read: false,
    createdAt: '2024-01-15T11:00:00Z'
  }
];

// Mock Dashboard Stats
export const mockDashboardStats: Record<string, DashboardStats> = {
  employee: {
    attendanceRate: 92,
    leaveBalance: 15,
    overtime: 25,
    warnings: 0
  },
  hr: {
    totalEmployees: 45,
    activeEmployees: 42,
    onLeave: 3,
    lateToday: 2,
    pendingRequests: 8,
    openJobs: 5
  },
  admin: {
    totalEmployees: 45,
    activeEmployees: 42,
    onLeave: 3,
    lateToday: 2,
    pendingRequests: 8,
    openJobs: 5
  }
};

// Helper functions for mock data
export const getCurrentUser = (role: string): User => {
  return mockUsers.find(user => user.role === role) || mockUsers[0];
};

export const getEmployeeById = (id: string): Employee | undefined => {
  return mockEmployees.find(emp => emp.id === id);
};

export const getAttendanceByEmployee = (employeeId: string): AttendanceRecord[] => {
  return mockAttendanceRecords.filter(record => record.employeeId === employeeId);
};

export const getLeavesByEmployee = (employeeId: string): LeaveRequest[] => {
  return mockLeaveRequests.filter(leave => leave.employeeId === employeeId);
};

export const getPayrollByEmployee = (employeeId: string): PayrollRecord[] => {
  return mockPayrollRecords.filter(record => record.employeeId === employeeId);
};

export const getNotificationsByUser = (userId: string): Notification[] => {
  return mockNotifications.filter(notification => notification.userId === userId);
};