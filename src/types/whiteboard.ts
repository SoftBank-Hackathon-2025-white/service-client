export enum JobStatus {
  UPLOADING = 'Uploading',
  QUEUED = 'Queued',
  RUNNING = 'Running',
  SUCCESS = 'Success',
  FAILED = 'Failed',
}

export type JobMetadata = {
  id: string;
  status: JobStatus;
  language: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;
  userId?: string;
};

export type SystemMetrics = {
  activeJobsCount: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
  totalJobsToday: number;
  successRate: number;
  lastUpdated: string;
};

export type ResourceHistoryPoint = {
  timestamp: string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
};

export type JobStatusStats = {
  status: JobStatus;
  count: number;
};

export type LanguageStats = {
  language: string;
  count: number;
};

export type WhiteboardData = {
  systemMetrics: SystemMetrics;
  recentJobs: JobMetadata[];
  resourceHistory: ResourceHistoryPoint[];
  jobStatusStats: JobStatusStats[];
  languageStats: LanguageStats[];
};
