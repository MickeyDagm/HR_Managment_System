import {HandCoins, Home, Clock, Calendar, DollarSign, Users, UserCheck, CalendarClock, Megaphone, Briefcase, UserSearch, ShieldCheck,  LucideIcon  } from 'lucide-react';
import { FeatureKey, Features } from '../../types/features';


export interface NavigationItem {
  path: string;
  icon: LucideIcon;
  label: string;
  permission: FeatureKey | null;
}

export const getNavigationItems = (userPermissions: FeatureKey[]): NavigationItem[] => {
  const baseItems: NavigationItem[] = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', permission: null },
  ];

  const allItems: NavigationItem[] = [
    ...baseItems,
    { path: '/attendance', icon: Clock, label: 'Attendance', permission: Features.ATTENDANCE_PAGE },
    { path: '/leaves', icon: Calendar, label: 'Leave Request', permission: Features.LEAVE_REQUEST_PAGE },
    { path: '/payroll', icon: DollarSign, label: 'Payroll', permission: Features.PAYROLL_PAGE },
    { path: '/employees', icon: Users, label: 'Employees', permission: Features.EMPLOYEES_LIST },
    { path: '/attendance-overview', icon: UserCheck, label: 'Attendance Management', permission: Features.ATTENDANCE_MANAGEMENT },
    { path: '/leave-management', icon: CalendarClock, label: 'Leave Management', permission: Features.LEAVE_MANAGEMENT },
    { path: '/payroll-management', icon: HandCoins, label: 'Payroll Management', permission: Features.PAYROLL_MANAGEMENT },
    { path: '/job-post', icon: Megaphone, label: 'Job Post', permission: Features.OPEN_JOB_POSITIONS },
    { path: '/recruitment', icon: Briefcase, label: 'Candidates/Applicants', permission: Features.CANDIDATES_APPLICANTS },
    { path: '/premium', icon: UserSearch, label: 'CV Search', permission: Features.CV_SEARCH },
    { path: '/permissions', icon: ShieldCheck, label: 'Give Permission', permission: Features.PENDING_LEAVE_REQUESTS },
  ];

  return allItems.filter(item => !item.permission || userPermissions.includes(item.permission));
};