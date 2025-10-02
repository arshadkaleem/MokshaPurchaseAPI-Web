/**
 * Project status enumeration
 */

export enum ProjectStatus {
  Planned = 'Planned',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export const PROJECT_STATUS_OPTIONS = [
  { value: ProjectStatus.Planned, label: 'Planned', color: 'blue' },
  { value: ProjectStatus.InProgress, label: 'In Progress', color: 'yellow' },
  { value: ProjectStatus.Completed, label: 'Completed', color: 'green' },
  { value: ProjectStatus.Cancelled, label: 'Cancelled', color: 'red' },
];

export const getProjectStatusColor = (status: ProjectStatus): string => {
  const option = PROJECT_STATUS_OPTIONS.find((opt) => opt.value === status);
  return option?.color || 'gray';
};
