/**
 * 프로젝트 기본 정보
 */
export type Project = {
  id: string;
  name: string;
};

/**
 * 프로젝트 목록 응답
 */
export type ProjectListResponse = {
  projects: Project[];
  total: number;
};

/**
 * 코드 제출 요청
 */
export type CodeSubmitRequest = {
  code: string;
  description: string;
  function_name: string;
  language: 'python' | 'node' | 'java';
  project: string; // projectId
};

/**
 * 코드 제출 응답 (JobMetadata)
 */
export type CodeSubmitResponse = {
  job_id: string;
  project: string;
  code_key?: string;
  message: string;
  status: string;
};

/**
 * 프로젝트 대시보드 데이터 (Mock용)
 */
export type ProjectDetailData = {
  project: Project;
  systemMetrics: {
    activeJobsCount: number;
    cpuUsagePercent: number;
    memoryUsagePercent: number;
    totalJobsToday: number;
    successRate: number;
    lastUpdated: string;
  };
  recentJobs: any[];
  resourceHistory: any[];
  jobStatusStats: any[];
  languageStats: any[];
};
