import { FeatureKey } from "./features";
export type EmployeeRole = "employee" | "hr" | "admin";
export type PermissionLevel = "LEVEL_1" | "LEVEL_2" | "LEVEL_3";
export type UserRole = "employee" | "hr" | "admin" | "owner";
export type UserStatus =
  | "active"
  | "inactive"
  | "terminated"
  | "pending"
  | "reviewed"
  | "interview_scheduled"
  | "rejected"
  | "hired";
export interface User {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  phone?: string;
  address?: string;
  avatar?: string;
  status?: UserStatus;
  approved: "approved" | "pending" | "rejected";
  companyId?: string;

  // Shared skill info
  skills?: string[];
  education?: string;
  experience?: string;
}


export interface Employee extends User {
  role: "employee" | "hr" | "admin";
  employeeId: string;
  department: string;
  position: string;
  dateOfHire: string;
  salary: number;
  manager?: string;
  performanceRating?: number;

  // Permission-related
   level: PermissionLevel;             // Standard access level
  customOverrides?: FeatureKey[];     // Extra manual permissions (optional)
  // permissions?: FeatureKey[];          // Final computed flat permissions
}

export interface Applicant  extends User {
  jobId: string; 
  jobTitle: string; 
  resume: string; 
  coverLetter: string;
  appliedDate: string;
  status: UserStatus;
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

export interface Department {
  id: string;
  name: string;
  description: string;
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