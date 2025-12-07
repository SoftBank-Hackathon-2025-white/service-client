export enum JobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  CANCELLED = 'CANCELLED',
}

export type JobMetadata = {
  job_id: string;
  project: string;
  code_key?: string;
  message: string;
  status: JobStatus;
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

/**
 * CloudWatch 메트릭 데이터 포인트
 */
export type CloudWatchMetric = {
  timestamp: string;
  cpu_utilization: number;
  memory_utilization: number;
};

/**
 * CloudWatch API 응답
 */
export type CloudWatchResponse = {
  cluster_name: string;
  metrics: CloudWatchMetric[];
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
