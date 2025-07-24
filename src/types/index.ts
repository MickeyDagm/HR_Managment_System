export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'employee' | 'hr' | 'admin' | 'owner';
  skills?: string[];
  avatar?: string;
  department?: string;
  position?: string;
  employeeId?: string;
  dateOfHire?: string;
  status?: 'active' | 'inactive' | 'terminated'|'pending' | 'reviewed' | 'interview_scheduled' | 'rejected' | 'hired';
  salary?: number;
  phone?: string;
  address?: string;
  companyId?: string; 
  resume?: string; 
  coverLetter?: string;
  appliedDate?: string;
  jobId?: string; 
  jobTitle?: string; 
  experience?: string; 
  education?: string;
  interviewDate?: string; 
  interviewTime?: string; 
  approved: 'approved' | 'pending' | 'rejected';
}

export interface Employee extends User {
  department: string;
  position: string;
  employeeId: string;
  dateOfHire: string;
  status: 'active' | 'inactive' | 'terminated';
  salary: number;
  manager?: string;
  performanceRating?: number;
}


export interface Applicant  extends User {
  jobId: string; 
  jobTitle: string; 
  resume: string; 
  coverLetter: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interview_scheduled' | 'rejected' | 'hired';
  experience: string; 
  education: string;
  interviewDate?: string; 
  interviewTime?: string; 
  companyId?: string; 
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
  daysWorked: number;
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
  companyId?: string;
  approved: 'approved' | 'pending' | 'rejected' | 'posted';
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

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}