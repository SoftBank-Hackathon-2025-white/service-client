import type { JobMetadata, SystemMetrics, ResourceHistoryPoint, JobStatusStats, LanguageStats } from './whiteboard';

/**
 * 프로젝트 기본 정보
 */
export type Project = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  jobCount: number;
  lastJobAt?: string;
};

/**
 * 프로젝트 목록 응답
 */
export type ProjectListResponse = {
  projects: Project[];
  total: number;
};

/**
 * 프로젝트 상세 데이터 (대시보드용)
 */
export type ProjectDetailData = {
  project: Project;
  systemMetrics: SystemMetrics;
  recentJobs: JobMetadata[];
  resourceHistory: ResourceHistoryPoint[];
  jobStatusStats: JobStatusStats[];
  languageStats: LanguageStats[];
};

/**
 * 코드 제출 요청
 */
export type CodeSubmitRequest = {
  projectId: string;
  code: string;
  language: 'python' | 'node' | 'java';
};

/**
 * 코드 제출 응답
 */
export type CodeSubmitResponse = {
  jobId: string;
  projectId: string;
};
