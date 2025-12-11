export interface Project {
  id: string;
  name: string;
  url: string;
  objective: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  userId: string;
  analyses: Analysis[];
  latestAnalysisStatus?: 'pending' | 'completed' | 'failed' | null;
  latestAnalysisSummary?: string | null;
}

export interface Analysis {
  id: string;
  projectId: string;
  url: string;
  objective: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  steps: Step[];
  completedAt?: string;
  summary?: string;
}

export interface Step {
  timestamp: string;
  id: string;
  analysisId: string;
  stepNumber: number;
  action: string;
  screenshot_path?: string;
  stepStatus: 'pending' | 'completed' | 'failed' | 'needs_retry';
  args: any;
  analysis?: {
    // Canonical analysis field produced by automation service.
    stepDescription?: string;
    pageDescription?: string;
    actionIntent?: string;
    actionReasoning?: string;
  };
  result?: any;
  completedAt?: string;
  error?: string;
}
