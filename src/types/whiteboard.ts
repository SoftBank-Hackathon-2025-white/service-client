export enum JobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  CANCELLED = 'CANCELLED',
}

export type JobExecutionResult = {
  job_id: string;
  status: string;
  stderr: string;
  stdout: string;
  log_key: string;
  code_key: string;
  logs_url: string;
  resource: {
    memory_mb: number;
    cpu_percent: number;
    execution_time_ms: number;
  };
  completed_at: string | null;
  error_message: string | null;
};

export type JobData = {
  created_at: string;
  updated_at: string;
  started_at: string | null;
  completed_at: string | null;
  code_key: string;
  language: string;
  result: JobExecutionResult | null;
};

export type JobMetadata = {
  job_id: string;
  project: string;
  code_key?: string;
  message: string;
  status: JobStatus;
  data?: JobData;
};

/**
 * Job 상태 조회 API 응답
 * GET /api/jobs/{jobId}/status
 */
export type JobStatusResponse = {
  job_id: string;
  status: JobStatus;
  project: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  timeout_ms: number;
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
