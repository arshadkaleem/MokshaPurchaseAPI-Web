/**
 * Project-related types
 */

import { ProjectStatus } from '@/types/enums/project-status.enum';
import { ProjectType } from '@/types/enums/project-type.enum';

export interface CreateProjectRequest {
  projectName: string;
  projectType: ProjectType;
  status: ProjectStatus;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  complianceStatus?: string;
}

export interface UpdateProjectRequest {
  projectName: string;
  projectType: ProjectType;
  status: ProjectStatus;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  complianceStatus?: string;
}

export interface ProjectResponse {
  projectId: number;
  projectName: string;
  projectType: ProjectType;
  status: ProjectStatus;
  description?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  complianceStatus?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface ProjectListItem {
  projectId: number;
  projectName: string;
  projectType: ProjectType;
  status: ProjectStatus;
  budget?: number;
  startDate?: string;
  endDate?: string;
}
