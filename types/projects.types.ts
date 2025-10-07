// ============================================
// PROJECT TYPES
// ============================================

/**
 * Project Response - What you GET from the API
 * Matches: ProjectResponse from your Swagger
 */
export interface ProjectResponse {
  projectId: number;
  projectName: string;
  projectType: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  budget: number | null;
  complianceStatus: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Project Request - What you POST to create a project
 * Matches: CreateProjectRequest from your Swagger
 */
export interface CreateProjectRequest {
  projectName: string;
  projectType: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  budget?: number | null;
  complianceStatus?: string | null;
  status: string;
}

/**
 * Update Project Request - What you PUT to update a project
 * Matches: UpdateProjectRequest from your Swagger
 */
export interface UpdateProjectRequest {
  projectName: string;
  projectType: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  budget?: number | null;
  complianceStatus?: string | null;
  status: string;
}

/**
 * Project Type - Valid values for projectType
 */
export type ProjectType = "Government" | "Private";

/**
 * Project Status - Valid values for status
 */
export type ProjectStatus = "Planned" | "In Progress" | "Completed" | "Cancelled";