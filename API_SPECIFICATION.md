# HR Management System API Specification

## Overview
This document outlines the complete API specification for the HR Management System backend. The system supports multiple user roles (Employee, HR, Admin) with role-based access control and permission levels.

## Base URL
```
https://api.hr-management-system.com/v1
```

## Authentication
All API endpoints require authentication using JWT tokens in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## User Roles & Permissions

### User Roles
- `employee`: Basic employee access
- `hr`: Human Resources access
- `admin`: Administrative access
- `owner`: System owner access

### Permission Levels
- `LEVEL_1`: Basic employee features
- `LEVEL_2`: HR management features
- `LEVEL_3`: Full administrative features

## API Endpoints

### 1. Authentication

#### POST /auth/login
**Description:** User login
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
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
}
```

#### POST /auth/logout
**Description:** User logout
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/profile
**Description:** Get current user profile
**Response:**
```json
{
  "success": true,
  "user": {
    // Same as login response user object
  }
}
```

### 2. User Management

#### GET /users
**Description:** Get all users (Admin only)
**Query Parameters:**
- `role`: Filter by role
- `status`: Filter by status
- `companyId`: Filter by company
- `page`: Page number
- `limit`: Items per page

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",
      "status": "string",
      "approved": "string",
      "companyId": "string"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### GET /users/:id
**Description:** Get user details
**Response:**
```json
{
  "success": true,
  "user": {
    // Complete user object
  }
}
```

#### PUT /users/:id
**Description:** Update user
**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "role": "string",
  "status": "string"
}
```

#### DELETE /users/:id
**Description:** Delete user (Admin only)

#### POST /users/:id/approve
**Description:** Approve user (Admin only)

#### POST /users/:id/reject
**Description:** Reject user (Admin only)

### 3. Employee Management

#### GET /employees
**Description:** Get all employees
**Query Parameters:**
- `department`: Filter by department
- `status`: Filter by status
- `companyId`: Filter by company

**Response:**
```json
{
  "success": true,
  "employees": [
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
  ]
}
```

#### GET /employees/:id
**Description:** Get employee details

#### PUT /employees/:id
**Description:** Update employee

#### POST /employees
**Description:** Create new employee

### 4. Attendance Management

#### GET /attendance
**Description:** Get attendance records
**Query Parameters:**
- `employeeId`: Filter by employee
- `date`: Filter by date
- `startDate`: Start date range
- `endDate`: End date range

**Response:**
```json
{
  "success": true,
  "attendance": [
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
  ]
}
```

#### POST /attendance/check-in
**Description:** Employee check-in
**Request Body:**
```json
{
  "employeeId": "string",
  "notes": "string"
}
```

#### POST /attendance/check-out
**Description:** Employee check-out
**Request Body:**
```json
{
  "employeeId": "string",
  "notes": "string"
}
```

#### PUT /attendance/:id
**Description:** Update attendance record (HR/Admin only)

#### GET /attendance/overview
**Description:** Get attendance overview (HR/Admin only)
**Response:**
```json
{
  "success": true,
  "overview": {
    "totalEmployees": "number",
    "presentToday": "number",
    "absentToday": "number",
    "lateToday": "number",
    "attendanceRate": "number"
  }
}
```

### 5. Leave Management

#### GET /leaves
**Description:** Get leave requests
**Query Parameters:**
- `employeeId`: Filter by employee
- `status`: Filter by status
- `type`: Filter by leave type

**Response:**
```json
{
  "success": true,
  "leaves": [
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
  ]
}
```

#### POST /leaves
**Description:** Create leave request
**Request Body:**
```json
{
  "type": "string",
  "startDate": "string",
  "endDate": "string",
  "reason": "string"
}
```

#### PUT /leaves/:id
**Description:** Update leave request

#### POST /leaves/:id/approve
**Description:** Approve leave request (HR/Admin only)

#### POST /leaves/:id/reject
**Description:** Reject leave request (HR/Admin only)

#### GET /leaves/balance
**Description:** Get leave balance
**Response:**
```json
{
  "success": true,
  "balance": {
    "sick": "number",
    "annual": "number",
    "personal": "number",
    "maternity": "number",
    "emergency": "number"
  }
}
```

### 6. Payroll Management

#### GET /payroll
**Description:** Get payroll records
**Query Parameters:**
- `employeeId`: Filter by employee
- `month`: Filter by month
- `year`: Filter by year

**Response:**
```json
{
  "success": true,
  "payroll": [
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
  ]
}
```

#### GET /payroll/:id
**Description:** Get payroll details

#### POST /payroll
**Description:** Create payroll record (HR/Admin only)

#### PUT /payroll/:id
**Description:** Update payroll record (HR/Admin only)

#### POST /payroll/:id/approve
**Description:** Approve payroll (HR/Admin only)

#### GET /payroll/overview
**Description:** Get payroll overview (HR/Admin only)

### 7. Job Posting Management

#### GET /jobs
**Description:** Get job postings
**Query Parameters:**
- `status`: Filter by status
- `type`: Filter by employment type
- `department`: Filter by department
- `companyId`: Filter by company

**Response:**
```json
{
  "success": true,
  "jobs": [
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
  ]
}
```

#### GET /jobs/:id
**Description:** Get job details

#### POST /jobs
**Description:** Create job posting (HR/Admin only)

#### PUT /jobs/:id
**Description:** Update job posting (HR/Admin only)

#### DELETE /jobs/:id
**Description:** Delete job posting (HR/Admin only)

#### POST /jobs/:id/approve
**Description:** Approve job posting (Admin only)

#### POST /jobs/:id/reject
**Description:** Reject job posting (Admin only)

### 8. Applicant Management

#### GET /applicants
**Description:** Get job applicants
**Query Parameters:**
- `jobId`: Filter by job
- `status`: Filter by status
- `companyId`: Filter by company

**Response:**
```json
{
  "success": true,
  "applicants": [
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
  ]
}
```

#### GET /applicants/:id
**Description:** Get applicant details

#### POST /applicants
**Description:** Apply for job

#### PUT /applicants/:id
**Description:** Update applicant status (HR/Admin only)

#### POST /applicants/:id/schedule-interview
**Description:** Schedule interview (HR/Admin only)
**Request Body:**
```json
{
  "interviewDate": "string",
  "interviewTime": "string"
}
```

### 9. Company Management

#### GET /companies
**Description:** Get all companies (Admin only)
**Response:**
```json
{
  "success": true,
  "companies": [
    {
      "id": "string",
      "name": "string",
      "industry": "string",
      "location": "string",
      "email": "string",
      "phone": "string",
      "status": "active|inactive"
    }
  ]
}
```

#### GET /companies/:id
**Description:** Get company details

#### POST /companies
**Description:** Create company (Admin only)

#### PUT /companies/:id
**Description:** Update company (Admin only)

#### DELETE /companies/:id
**Description:** Delete company (Admin only)

### 10. Dashboard & Analytics

#### GET /dashboard/stats
**Description:** Get dashboard statistics
**Response:**
```json
{
  "success": true,
  "stats": {
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
}
```

#### GET /dashboard/attendance-rate
**Description:** Get attendance rate

#### GET /dashboard/leave-balance
**Description:** Get leave balance

#### GET /dashboard/overtime-payment
**Description:** Get overtime payment

#### GET /dashboard/net-salary
**Description:** Get net salary

### 11. Notifications

#### GET /notifications
**Description:** Get user notifications
**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "string",
      "userId": "string",
      "title": "string",
      "message": "string",
      "type": "info|warning|error|success",
      "read": "boolean",
      "createdAt": "string"
    }
  ]
}
```

#### PUT /notifications/:id/read
**Description:** Mark notification as read

#### DELETE /notifications/:id
**Description:** Delete notification

### 12. Messaging

#### GET /messages
**Description:** Get user messages
**Query Parameters:**
- `receiverId`: Filter by receiver

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "id": "string",
      "senderId": "string",
      "receiverId": "string",
      "content": "string",
      "timestamp": "string",
      "read": "boolean"
    }
  ]
}
```

#### POST /messages
**Description:** Send message
**Request Body:**
```json
{
  "receiverId": "string",
  "content": "string"
}
```

#### PUT /messages/:id/read
**Description:** Mark message as read

### 13. Task Management (Kanban Board)

#### GET /boards
**Description:** Get user boards
**Response:**
```json
{
  "success": true,
  "boards": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "userId": "string",
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

#### POST /boards
**Description:** Create board
**Request Body:**
```json
{
  "title": "string",
  "description": "string"
}
```

#### GET /boards/:id/lists
**Description:** Get board lists
**Response:**
```json
{
  "success": true,
  "lists": [
    {
      "id": "string",
      "title": "string",
      "boardId": "string",
      "position": "number",
      "createdAt": "string"
    }
  ]
}
```

#### POST /boards/:id/lists
**Description:** Create list
**Request Body:**
```json
{
  "title": "string",
  "position": "number"
}
```

#### GET /lists/:id/cards
**Description:** Get list cards
**Response:**
```json
{
  "success": true,
  "cards": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "listId": "string",
      "position": "number",
      "dueDate": "string",
      "labels": ["string"],
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

#### POST /lists/:id/cards
**Description:** Create card
**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "position": "number",
  "dueDate": "string",
  "labels": ["string"]
}
```

### 14. Payment & Premium Features

#### GET /premium/features
**Description:** Get premium features
**Response:**
```json
{
  "success": true,
  "features": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": "number",
      "duration": "string"
    }
  ]
}
```

#### POST /payments
**Description:** Create payment
**Request Body:**
```json
{
  "featureId": "string",
  "amount": "number",
  "paymentMethod": "string"
}
```

#### GET /payments/history
**Description:** Get payment history

## Error Responses

All endpoints return consistent error responses:

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

### Common Error Codes
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## Rate Limiting
- 100 requests per minute per user
- 1000 requests per hour per user

## File Upload Endpoints

### POST /upload/avatar
**Description:** Upload user avatar
**Content-Type:** multipart/form-data
**Request Body:**
- `file`: Image file (max 5MB)

### POST /upload/resume
**Description:** Upload resume
**Content-Type:** multipart/form-data
**Request Body:**
- `file`: PDF/DOC file (max 10MB)

### POST /upload/cover-letter
**Description:** Upload cover letter
**Content-Type:** multipart/form-data
**Request Body:**
- `file`: PDF/DOC file (max 5MB)

## WebSocket Endpoints

### /ws/notifications
**Description:** Real-time notifications
**Events:**
- `notification`: New notification
- `message`: New message
- `attendance_update`: Attendance update

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

## Security Requirements

1. **JWT Authentication** with refresh tokens
2. **Role-based Access Control** (RBAC)
3. **Permission-based Authorization**
4. **Input Validation** and sanitization
5. **Rate Limiting** to prevent abuse
6. **CORS Configuration** for frontend
7. **File Upload Security** with virus scanning
8. **Data Encryption** for sensitive information
9. **Audit Logging** for admin actions
10. **Password Hashing** with bcrypt

## Performance Requirements

1. **Response Time**: < 200ms for most endpoints
2. **Database Indexing** on frequently queried fields
3. **Pagination** for list endpoints
4. **Caching** for static data
5. **Connection Pooling** for database
6. **CDN** for file uploads
7. **Compression** for API responses

## Testing Requirements

1. **Unit Tests** for all business logic
2. **Integration Tests** for API endpoints
3. **Authentication Tests** for protected routes
4. **Permission Tests** for role-based access
5. **File Upload Tests** for media endpoints
6. **WebSocket Tests** for real-time features
7. **Performance Tests** for load handling

## Deployment Requirements

1. **Environment Variables** for configuration
2. **Health Check Endpoint** for monitoring
3. **Logging** with structured format
4. **Error Tracking** integration
5. **API Documentation** with OpenAPI/Swagger
6. **Database Migrations** system
7. **Backup Strategy** for data protection 