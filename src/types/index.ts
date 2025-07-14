export interface User {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'hr' | 'admin';
  avatar?: string;
  department?: string;
  position?: string;
  employeeId?: string;
  dateOfHire?: string;
  status?: 'active' | 'inactive' | 'terminated';
  salary?: number;
  phone?: string;
  address?: string;
}

export interface Employee extends User {
  department: string;
  position: string;
  employeeId: string;
  dateOfHire: string;
  status: 'active' | 'inactive' | 'terminated';
  salary: number;
  manager?: string;
  skills?: string[];
  performanceRating?: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  hoursWorked?: number;
  status: 'present' | 'absent' | 'late' | 'early_leave';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'sick' | 'annual' | 'personal' | 'maternity' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  comments?: string;
  appliedDate: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  overtime: number;
  deductions: number;
  taxes: number;
  netSalary: number;
  bonuses: number;
  penalties: number;
  status?: 'pending' | 'approved' | 'paid';
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  description: string;
  experience: string;
  education: string;
  educationField: string;
  salary: string;
  type: 'Permanent' | 'Volunteer' | 'contract' | 'internship';
  employmentType: "full-time" | "part-time";
  location: string;
  postedDate: string;
  expiryDate: string;
  status: 'active' | 'closed' | 'draft' | 'pending';
  applicants?: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalEmployees?: number;
  activeEmployees?: number;
  onLeave?: number;
  lateToday?: number;
  pendingRequests?: number;
  openJobs?: number;
  attendanceRate?: number;
  leaveBalance?: number;
  overtime?: number;
  salary?: number;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string; // References JobPosting.id
  jobTitle: string; // For display, derived from JobPosting.title
  resume: string; // URL or file path (mocked as text for simplicity)
  coverLetter: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interview_scheduled' | 'rejected' | 'hired';
  skills: string[];
  experience: string; // e.g., "2-4 years"
  education: string;
  interviewDate?: string; // ISO date string for scheduled interview
  interviewTime?: string; // Time in HH:MM format
}