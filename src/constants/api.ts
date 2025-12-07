export const BASE_URL = import.meta.env['VITE_API_BASE_URL'];

/**
 * API 엔드포인트 상수
 */
export const API_ENDPOINTS = {
  /** 프로젝트 목록 */
  PROJECTS: '/api/projects',
  /** 프로젝트 상세 */
  PROJECT_DETAIL: (projectId: string) => `/api/projects/${projectId}`,
  /** 프로젝트 대시보드 데이터 */
  PROJECT_DASHBOARD: (projectId: string) => `/api/projects/${projectId}/dashboard`,
  /** 코드 업로드 (프로젝트 산하) */
  UPLOAD: (projectId: string) => `/api/projects/${projectId}/upload`,
  /** 실행 트리거 */
  EXECUTE: (projectId: string, jobId: string) => `/api/projects/${projectId}/jobs/${jobId}/execute`,
  /** 실행 상태 조회 */
  STATUS: (projectId: string, jobId: string) => `/api/projects/${projectId}/jobs/${jobId}/status`,
} as const;
