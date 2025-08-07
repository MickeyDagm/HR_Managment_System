# HR Management System API Specification

## Base URL
```
https://api.hr-management-system.com/v1
```

## Authentication
All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## User Roles & Permissions
- **Roles**: employee, hr, admin, owner
- **Permission Levels**: LEVEL_1, LEVEL_2, LEVEL_3

## Core API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout  
- `GET /auth/profile` - Get current user

### User Management
- `GET /users` - Get all users (Admin)
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user
- `POST /users/:id/approve` - Approve user
- `POST /users/:id/reject` - Reject user

### Employee Management
- `GET /employees` - Get all employees
- `GET /employees/:id` - Get employee details
- `PUT /employees/:id` - Update employee
- `POST /employees` - Create employee

### Attendance Management
- `GET /attendance` - Get attendance records
- `POST /attendance/check-in` - Employee check-in
- `POST /attendance/check-out` - Employee check-out
- `PUT /attendance/:id` - Update attendance
- `GET /attendance/overview` - Attendance overview (HR/Admin)

### Leave Management
- `GET /leaves` - Get leave requests
- `POST /leaves` - Create leave request
- `PUT /leaves/:id` - Update leave request
- `POST /leaves/:id/approve` - Approve leave
- `POST /leaves/:id/reject` - Reject leave
- `GET /leaves/balance` - Get leave balance

### Payroll Management
- `GET /payroll` - Get payroll records
- `GET /payroll/:id` - Get payroll details
- `POST /payroll` - Create payroll (HR/Admin)
- `PUT /payroll/:id` - Update payroll
- `POST /payroll/:id/approve` - Approve payroll
- `GET /payroll/overview` - Payroll overview

### Job Posting Management
- `GET /jobs` - Get job postings
- `GET /jobs/:id` - Get job details
- `POST /jobs` - Create job posting (HR/Admin)
- `PUT /jobs/:id` - Update job posting
- `POST /jobs/:id/approve` - Approve job (Admin)
- `POST /jobs/:id/reject` - Reject job (Admin)

### Applicant Management
- `GET /applicants` - Get job applicants
- `GET /applicants/:id` - Get applicant details
- `POST /applicants` - Apply for job
- `PUT /applicants/:id` - Update applicant status
- `POST /applicants/:id/schedule-interview` - Schedule interview

### Company Management
- `GET /companies` - Get all companies (Admin)
- `GET /companies/:id` - Get company details
- `POST /companies` - Create company (Admin)
- `PUT /companies/:id` - Update company (Admin)

### Dashboard & Analytics
- `GET /dashboard/stats` - Get dashboard statistics
- `GET /dashboard/attendance-rate` - Get attendance rate
- `GET /dashboard/leave-balance` - Get leave balance
- `GET /dashboard/overtime-payment` - Get overtime payment
- `GET /dashboard/net-salary` - Get net salary

### Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/:id/read` - Mark as read
- `DELETE /notifications/:id` - Delete notification

### Messaging
- `GET /messages` - Get user messages
- `POST /messages` - Send message
- `PUT /messages/:id/read` - Mark as read

### Task Management (Kanban)
- `GET /boards` - Get user boards
- `POST /boards` - Create board
- `GET /boards/:id/lists` - Get board lists
- `POST /boards/:id/lists` - Create list
- `GET /lists/:id/cards` - Get list cards
- `POST /lists/:id/cards` - Create card

### Payment & Premium Features
- `GET /premium/features` - Get premium features
- `POST /payments` - Create payment
- `GET /payments/history` - Get payment history

### File Upload
- `POST /upload/avatar` - Upload user avatar
- `POST /upload/resume` - Upload resume
- `POST /upload/cover-letter` - Upload cover letter

### WebSocket
- `/ws/notifications` - Real-time notifications

## Data Models

### User
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "employee|hr|admin|owner",
  "phone": "string",
  "address": "string",
  "avatar": "string",
  "status": "active|inactive|terminated|pending|reviewed|interview_scheduled|rejected|hired",
  "approved": "approved|pending|rejected",
  "companyId": "string",
  "skills": ["string"],
  "education": "string",
  "experience": "string",
  "level": "LEVEL_1|LEVEL_2|LEVEL_3",
  "customOverrides": ["string"]
}
```

### Employee
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "employee|hr|admin",
  "employeeId": "string",
  "department": "string",
  "position": "string",
  "dateOfHire": "string",
  "salary": "number",
  "manager": "string",
  "performanceRating": "number",
  "level": "string",
  "customOverrides": ["string"]
}
```

### AttendanceRecord
```json
{
  "id": "string",
  "employeeId": "string",
  "date": "string",
  "checkIn": "string",
  "checkOut": "string",
  "hoursWorked": "number",
  "status": "present|absent|late|early_leave",
  "notes": "string"
}
```

### LeaveRequest
```json
{
  "id": "string",
  "employeeId": "string",
  "employeeName": "string",
  "type": "sick|annual|personal|maternity|emergency",
  "startDate": "string",
  "endDate": "string",
  "days": "number",
  "reason": "string",
  "status": "pending|approved|rejected",
  "approvedBy": "string",
  "comments": "string",
  "appliedDate": "string"
}
```

### PayrollRecord
```json
{
  "id": "string",
  "employeeId": "string",
  "employeeName": "string",
  "month": "string",
  "year": "number",
  "basicSalary": "number",
  "allowances": "number",
  "overtime": "number",
  "deductions": "number",
  "taxes": "number",
  "netSalary": "number",
  "bonuses": "number",
  "penalties": "number",
  "daysWorked": "number",
  "status": "pending|approved|paid"
}
```

### JobPosting
```json
{
  "id": "string",
  "title": "string",
  "department": "string",
  "description": "string",
  "experience": "string",
  "education": "string",
  "educationField": "string",
  "salary": "string",
  "type": "Permanent|Volunteer|contract|internship",
  "employmentType": "full-time|part-time",
  "location": "string",
  "postedDate": "string",
  "expiryDate": "string",
  "status": "active|closed|draft|pending",
  "applicants": "number",
  "companyId": "string",
  "approved": "approved|pending|rejected|posted"
}
```

### Applicant
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "jobId": "string",
  "jobTitle": "string",
  "resume": "string",
  "coverLetter": "string",
  "appliedDate": "string",
  "status": "string",
  "experience": "string",
  "education": "string",
  "interviewDate": "string",
  "interviewTime": "string",
  "companyId": "string"
}
```

### Company
```json
{
  "id": "string",
  "name": "string",
  "industry": "string",
  "location": "string",
  "email": "string",
  "phone": "string",
  "status": "active|inactive"
}
```

### DashboardStats
```json
{
  "totalEmployees": "number",
  "activeEmployees": "number",
  "onLeave": "number",
  "lateToday": "number",
  "pendingRequests": "number",
  "openJobs": "number",
  "attendanceRate": "number",
  "leaveBalance": "number",
  "overtime": "number",
  "salary": "number"
}
```

## Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": "object"
  }
}
```

## Security Requirements
- JWT Authentication with refresh tokens
- Role-based Access Control (RBAC)
- Permission-based Authorization
- Input validation and sanitization
- Rate limiting (100 req/min, 1000 req/hour)
- CORS configuration
- File upload security
- Data encryption for sensitive data
- Audit logging for admin actions
- Password hashing with bcrypt

## Performance Requirements
- Response time < 200ms for most endpoints
- Database indexing on frequently queried fields
- Pagination for list endpoints
- Caching for static data
- Connection pooling for database
- CDN for file uploads
- Compression for API responses

## Database Schema Requirements

### Core Tables
1. **users** - User accounts and profiles
2. **employees** - Employee-specific data
3. **companies** - Company information
4. **departments** - Department data
5. **attendance_records** - Attendance tracking
6. **leave_requests** - Leave management
7. **payroll_records** - Payroll data
8. **job_postings** - Job listings
9. **applicants** - Job applications
10. **notifications** - User notifications
11. **messages** - Internal messaging
12. **boards** - Task management boards
13. **lists** - Board lists
14. **cards** - Task cards
15. **payments** - Payment records

### Key Relationships
- Users belong to Companies
- Employees extend Users
- Attendance/Leave/Payroll linked to Employees
- Job Postings belong to Companies
- Applicants linked to Job Postings
- Messages between Users
- Notifications for Users
- Task boards belong to Users

## Testing Requirements
- Unit tests for all business logic
- Integration tests for API endpoints
- Authentication tests for protected routes
- Permission tests for role-based access
- File upload tests for media endpoints
- WebSocket tests for real-time features
- Performance tests for load handling

## Deployment Requirements
- Environment variables for configuration
- Health check endpoint for monitoring
- Logging with structured format
- Error tracking integration
- API documentation with OpenAPI/Swagger
- Database migrations system
- Backup strategy for data protection 