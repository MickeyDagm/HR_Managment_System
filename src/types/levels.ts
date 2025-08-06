import { Features, FeatureKey } from "./features";

export const LEVEL_1: FeatureKey[] = [
  Features.ATTENDANCE_RATE,
  Features.AVAILABLE_LEAVE,
  Features.OVERTIME_PAYMENT,
  Features.NET_SALARY,
  Features.ATTENDANCE_PAGE,
  Features.LEAVE_REQUEST_PAGE,
  Features.PROFILE_VIEW,
  Features.MESSAGING_HR,
  Features.TASKS_COMMIT,
  Features.PAYROLL_PAGE
];

export const LEVEL_2: FeatureKey[] = [
  ...LEVEL_1,
  Features.TOTAL_EMPLOYEES,
  Features.ACTIVE_EMPLOYEES,
  Features.ON_LEAVE_TODAY,
  Features.LATE_ARRIVALS,
  Features.PENDING_LEAVE_REQUESTS,
  Features.OPEN_JOB_POSITIONS,
  Features.EMPLOYEES_LIST,
  Features.TASKS_ASSIGN,
  Features.LEAVE_MANAGEMENT,
];

export const LEVEL_3: FeatureKey[] = [
  ...LEVEL_2,
  Features.LEAVE_MANAGEMENT,
  Features.ATTENDANCE_MANAGEMENT,
  Features.PAYROLL_MANAGEMENT,
  Features.JOB_POSTS,
  Features.CANDIDATES_APPLICANTS,
  Features.CV_SEARCH,
  Features.HIRING_REQUESTS,
];

export const PermissionLevels = {
  LEVEL_1,
  LEVEL_2,
  LEVEL_3,
} as const;

export function computeFinalPermissions(
  level: keyof typeof PermissionLevels,
  overrides: FeatureKey[] = []
): FeatureKey[] {
  return Array.from(new Set([...PermissionLevels[level], ...overrides]));
}
