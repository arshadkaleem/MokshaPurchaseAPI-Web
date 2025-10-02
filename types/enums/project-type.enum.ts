/**
 * Project type enumeration
 */

export enum ProjectType {
  Government = 'Government',
  Private = 'Private',
}

export const PROJECT_TYPE_OPTIONS = [
  { value: ProjectType.Government, label: 'Government' },
  { value: ProjectType.Private, label: 'Private' },
];
