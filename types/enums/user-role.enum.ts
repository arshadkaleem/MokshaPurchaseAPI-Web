/**
 * User role enumeration
 */

export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  Procurement = 'Procurement',
  Finance = 'Finance',
  SiteUser = 'SiteUser',
}

export const USER_ROLE_OPTIONS = [
  { value: UserRole.Admin, label: 'Admin' },
  { value: UserRole.Manager, label: 'Manager' },
  { value: UserRole.Procurement, label: 'Procurement' },
  { value: UserRole.Finance, label: 'Finance' },
  { value: UserRole.SiteUser, label: 'Site User' },
];

export const isValidUserRole = (role: string): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole);
};
