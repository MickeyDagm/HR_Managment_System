export const Features = {
  ATTENDANCE_RATE: "attendance_rate",
  AVAILABLE_LEAVE: "available_leave",
  OVERTIME_PAYMENT: "overtime_payment",
  NET_SALARY: "net_salary",

  TOTAL_EMPLOYEES: "total_employees",
  ACTIVE_EMPLOYEES: "active_employees",
  ON_LEAVE_TODAY: "on_leave_today",
  LATE_ARRIVALS: "late_arrivals",
  PENDING_LEAVE_REQUESTS: "pending_leave_requests",
  OPEN_JOB_POSITIONS: "open_job_positions",

  ATTENDANCE_PAGE: "attendance_page",
  LEAVE_REQUEST_PAGE: "leave_request_page",
  PAYROLL_PAGE: "payroll_page",
  TASKS_COMMIT: "tasks_commit",
  PROFILE_VIEW: "profile_view",
  MESSAGING_HR: "messaging_hr",

  EMPLOYEES_LIST: "employees_list",
  TASKS_ASSIGN: "tasks_assign",

  LEAVE_MANAGEMENT: "leave_management",
  ATTENDANCE_MANAGEMENT: "attendance_management",
  PAYROLL_MANAGEMENT: "payroll_management",
  JOB_POSTS: "job_posts",
  CANDIDATES_APPLICANTS: "candidates_applicants",
  CV_SEARCH: "cv_search",
  HIRING_REQUESTS: "hiring_requests",
} as const;

// 🔐 Extract type from values
export type FeatureKey = typeof Features[keyof typeof Features];
