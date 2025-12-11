import {
  createProject,
  getProject as dbGetProject,
  getAllProjects as dbGetAllProjects,
  updateProjectResult as dbUpdateProjectResult,
  deleteProject as dbDeleteProject
} from '@/services/database';
import { Project, Analysis, Step } from '@/types/project';

// Keep all existing function signatures for backward compatibility
export function addProject(project: Project): Promise<Project> {
  // Convert to the format expected by database service
  const { analyses, ...projectData } = project;
  return createProject(projectData);
}

export function getProject(
  id: string,
  userId: string
): Promise<Project | undefined> {
  return dbGetProject(id, userId).then((result) => result || undefined);
}

export function getAllProjects(userId: string): Promise<Project[]> {
  return dbGetAllProjects(userId);
}

export function updateProjectResult(
  projectId: string,
  summary?: string | null,
  projectStatus?: 'pending' | 'running' | 'completed' | 'failed',
  analysisStatus?: 'pending' | 'completed' | 'failed' | null,
  steps?: Step[],
  analysisId?: string
): Promise<void> {
  return dbUpdateProjectResult(
    projectId,
    summary,
    projectStatus,
    analysisStatus,
    steps,
    analysisId
  );
}

export function deleteProject(
  projectId: string,
  userId: string
): Promise<boolean> {
  return dbDeleteProject(projectId, userId);
}

// Legacy synchronous function - now throws error to help migration
export function loadProjects(): Project[] {
  throw new Error(
    'loadProjects() is deprecated and synchronous. Use getAllProjects(userId) instead which returns a Promise.'
  );
}

// Keep types exported for backward compatibility
export type { Project, Analysis, Step };
