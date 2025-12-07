export const BASE_URL = import.meta.env['VITE_API_BASE_URL'];
export const CLUSTER_NAME = import.meta.env['VITE_CLUSTER_NAME'] || 'default-cluster';

/**
 * API 엔드포인트 상수
 */
export const API_ENDPOINTS = {
  /** 프로젝트 목록 */
  PROJECTS: '/api/projects',
  /** 프로젝트 생성 */
  PROJECT_CREATE: '/api/project',
  /** 프로젝트별 Job 목록 (실행 이력) */
  JOBS: (projectId: string) => `/api/projects/${projectId}/jobs`,
  /** 코드 업로드 (프로젝트 산하) */
  UPLOAD: (projectId: string) => `/api/projects/${projectId}/upload`,
  /** 실행 트리거 */
  EXECUTE: (projectId: string, jobId: string) => `/api/projects/${projectId}/jobs/${jobId}/execute`,
  /** 실행 상태 조회 */
  STATUS: (projectId: string, jobId: string) => `/api/projects/${projectId}/jobs/${jobId}/status`,
  /** CloudWatch 메트릭 조회 */
  CLOUDWATCH: (clusterName: string) => `/api/cloudwatch/${clusterName}`,
} as const;
