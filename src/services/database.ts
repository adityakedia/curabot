import prisma from '@/lib/prisma';
import { Project, Analysis, Step } from '@/types/project';
import log from '@/lib/logger';

// Convert Prisma types to your frontend types
function convertPrismaProject(prismaProject: any): Project {
  if (!prismaProject) {
    throw new Error('convertPrismaProject: prismaProject is required');
  }

  // Fail-fast for required fields. Do not fabricate placeholder values.
  if (!prismaProject.id)
    throw new Error('convertPrismaProject: missing project.id');
  if (!prismaProject.name)
    throw new Error('convertPrismaProject: missing project.name');
  if (!prismaProject.url)
    throw new Error('convertPrismaProject: missing project.url');
  if (!prismaProject.objective)
    throw new Error('convertPrismaProject: missing project.objective');
  if (!prismaProject.createdAt)
    throw new Error('convertPrismaProject: missing project.createdAt');

  const analyses = prismaProject.analyses
    ? prismaProject.analyses.map(convertPrismaAnalysis)
    : [];
  // Since analyses are now ordered by timestamp desc, latest is first
  const latestAnalysis = analyses.length > 0 ? analyses[0] : null;

  return {
    id: prismaProject.id,
    name: prismaProject.name,
    url: prismaProject.url,
    objective: prismaProject.objective,
    status: prismaProject.status,
    createdAt: new Date(prismaProject.createdAt).toISOString(),
    userId: prismaProject.userId,
    analyses: analyses,
    latestAnalysisStatus: latestAnalysis?.status ?? null,
    latestAnalysisSummary: latestAnalysis?.summary ?? null
  };
}

function convertPrismaAnalysis(prismaAnalysis: any): Analysis {
  if (!prismaAnalysis)
    throw new Error('convertPrismaAnalysis: prismaAnalysis is required');
  if (!prismaAnalysis.id) throw new Error('convertPrismaAnalysis: missing id');
  if (!prismaAnalysis.projectId)
    throw new Error('convertPrismaAnalysis: missing projectId');
  if (!prismaAnalysis.timestamp)
    throw new Error('convertPrismaAnalysis: missing timestamp');

  const steps = prismaAnalysis.steps
    ? prismaAnalysis.steps
        .map(convertPrismaStep)
        .sort((a, b) => a.stepNumber - b.stepNumber)
    : [];

  return {
    id: prismaAnalysis.id,
    projectId: prismaAnalysis.projectId,
    url: prismaAnalysis.url,
    objective: prismaAnalysis.objective,
    timestamp: new Date(prismaAnalysis.timestamp).toISOString(),
    status: prismaAnalysis.status,
    steps,
    completedAt: prismaAnalysis.completedAt
      ? new Date(prismaAnalysis.completedAt).toISOString()
      : null,
    summary: prismaAnalysis.summary ?? null
  };
}

function convertPrismaStep(prismaStep: any): Step {
  if (!prismaStep) throw new Error('convertPrismaStep: prismaStep is required');
  if (!prismaStep.id) throw new Error('convertPrismaStep: missing id');
  if (prismaStep.stepNumber === undefined || prismaStep.stepNumber === null)
    throw new Error('convertPrismaStep: missing stepNumber');
  if (!prismaStep.timestamp)
    throw new Error('convertPrismaStep: missing timestamp');

  log.debug('convertPrismaStep', {
    id: prismaStep.id,
    step: prismaStep.stepNumber,
    hasAnalysis: !!prismaStep.analysisData
  });

  return {
    timestamp: new Date(prismaStep.timestamp).toISOString(),
    id: prismaStep.id,
    analysisId: prismaStep.analysisId,
    stepNumber: prismaStep.stepNumber,
    action: prismaStep.action ?? null,
    screenshot_path: prismaStep.screenshotPath ?? null, // DB field: screenshotPath -> client field: screenshot_path
    stepStatus: prismaStep.stepStatus ?? null,
    args: prismaStep.args ?? null,
    // Return analysisData as stored in DB. The stored object should use the
    // canonical `stepDescription` key going forward.
    analysis: prismaStep.analysisData ?? null,
    result: prismaStep.result ?? null,
    completedAt: prismaStep.completedAt
      ? new Date(prismaStep.completedAt).toISOString()
      : null,
    error: prismaStep.error ?? null
  };
}

// Database operations
export async function createProject(
  project: Omit<Project, 'analyses'>
): Promise<Project> {
  const created = await prisma.project.create({
    data: {
      id: project.id,
      name: project.name,
      url: project.url,
      objective: project.objective,
      status: project.status,
      userId: project.userId
    },
    include: {
      analyses: {
        include: {
          steps: {
            orderBy: { stepNumber: 'asc' }
          }
        }
      }
    }
  });

  return convertPrismaProject(created);
}

export async function getProject(
  id: string,
  userId: string
): Promise<Project | null> {
  const dbStart = Date.now();
  const project = await prisma.project.findFirst({
    where: { id, userId },
    include: {
      analyses: {
        include: {
          steps: {
            orderBy: { stepNumber: 'asc' }
          }
        },
        orderBy: { timestamp: 'desc' }
      }
    }
  });
  const dbDuration = Date.now() - dbStart;
  // eslint-disable-next-line no-console
  console.debug(`[DB] getProject(${id}) query took ${dbDuration}ms`);

  const convStart = Date.now();
  const result = project ? convertPrismaProject(project) : null;
  const convDuration = Date.now() - convStart;
  // eslint-disable-next-line no-console
  console.debug(`[DB] getProject(${id}) conversion took ${convDuration}ms`);
  return result;
}

export async function getAllProjects(userId: string): Promise<Project[]> {
  const dbStart = Date.now();
  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      analyses: {
        include: {
          steps: {
            orderBy: { stepNumber: 'asc' }
          }
        },
        orderBy: { timestamp: 'desc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  const dbDuration = Date.now() - dbStart;
  // eslint-disable-next-line no-console
  console.debug(`[DB] getAllProjects(${userId}) query took ${dbDuration}ms`);
  const convStart = Date.now();
  const res = projects.map(convertPrismaProject);
  const convDuration = Date.now() - convStart;
  // eslint-disable-next-line no-console
  console.debug(
    `[DB] getAllProjects(${userId}) conversion took ${convDuration}ms`
  );
  return res;
}

export async function updateProjectResult(
  projectId: string,
  summary?: string | null,
  projectStatus?: 'pending' | 'running' | 'completed' | 'failed',
  analysisStatus?: 'pending' | 'completed' | 'failed' | null,
  steps?: Step[],
  analysisId?: string
): Promise<void> {
  // Prepare project update data
  const projectUpdateData: any = {};

  if (projectStatus) {
    projectUpdateData.status = projectStatus;
  }

  // Update latest analysis fields if we have the data
  if (analysisStatus !== undefined || summary !== undefined) {
    projectUpdateData.latestAnalysisStatus = analysisStatus ?? null;

    // Handle summary - can be either a plain string or JSON with completionSummary
    if (summary !== undefined && summary !== null) {
      try {
        const parsed = JSON.parse(summary as string);
        // If it's a JSON object with completionSummary, use that
        projectUpdateData.latestAnalysisSummary =
          parsed.completionSummary ?? summary;
      } catch (e) {
        // If it's not valid JSON, treat it as a plain string
        projectUpdateData.latestAnalysisSummary = summary;
      }
    }
  }

  // Update project with a single query
  if (Object.keys(projectUpdateData).length > 0) {
    await prisma.project.update({
      where: { id: projectId },
      data: projectUpdateData
    });
  }

  // Strict behavior: only update an Analysis when an analysisId is provided by the API.
  // Do NOT fall back to "latest" analysis or infer analysisId from steps. Do not create placeholders.
  if (analysisId) {
    const targetAnalysis = await prisma.analysis.findUnique({
      where: { id: analysisId }
    });

    if (targetAnalysis) {
      const analysisUpdateData: any = {};

      if (summary !== undefined) {
        // Handle summary - can be either a plain string or JSON with completionSummary
        try {
          const parsed = JSON.parse(summary as string);
          // If it's a JSON object with completionSummary, use that
          analysisUpdateData.summary = parsed.completionSummary || summary;
        } catch (e) {
          // If it's not valid JSON, treat it as a plain string
          analysisUpdateData.summary = summary;
        }
      }

      if (analysisStatus) {
        analysisUpdateData.status = analysisStatus;
        if (analysisStatus === 'completed' || analysisStatus === 'failed') {
          analysisUpdateData.completedAt = new Date();
        }
      }

      if (Object.keys(analysisUpdateData).length > 0) {
        await prisma.analysis.update({
          where: { id: targetAnalysis.id },
          data: analysisUpdateData
        });
      }
    } else {
      // Do not create placeholders or fallback — just log and skip.
      log.warn(
        `updateProjectResult: analysisId=${analysisId} not found for project ${projectId}; skipping analysis update.`
      );
    }
  }

  // Persist steps if provided. Only upsert steps that include an explicit analysisId (do not infer).
  if (steps && steps.length > 0) {
    for (const s of steps) {
      // `steps` is typed as `Step[]`; validate required fields at runtime.
      if (!s.analysisId) {
        throw new Error(`updateProjectResult: step ${s.id} missing analysisId`);
      }

      if (!s.id) {
        throw new Error(`updateProjectResult: step missing id`);
      }

      const stepData = {
        id: s.id,
        analysisId: s.analysisId,
        stepNumber: s.stepNumber,
        action: s.action ?? null,
        ...(s.stepStatus !== undefined && { stepStatus: s.stepStatus }),
        args: s.args ?? null,
        analysisData: s.analysis ?? null,
        result: s.result ?? null,
        screenshotPath: s.screenshot_path ?? (s as any).screenshotPath ?? null,
        error: s.error ?? null,
        timestamp: s.timestamp ? new Date(s.timestamp) : new Date(),
        ...(s.stepStatus === 'completed' && {
          completedAt: s.completedAt ? new Date(s.completedAt) : new Date()
        })
      } as const;

      await prisma.step.upsert({
        where: { id: stepData.id },
        update: stepData,
        create: stepData
      });
    }
  }
}

export async function deleteProject(
  projectId: string,
  userId: string
): Promise<boolean> {
  try {
    await prisma.project.deleteMany({
      where: { id: projectId, userId }
    });
    return true;
  } catch (error) {
    log.error('Error deleting project:', error);
    return false;
  }
}

// Close Prisma connection when needed
export async function closePrisma() {
  await prisma.$disconnect();
}
