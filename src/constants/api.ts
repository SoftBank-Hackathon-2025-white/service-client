export const BASE_URL = import.meta.env['VITE_API_BASE_URL'] || 'http://localhost:8080';

/**
 * API 엔드포인트 상수
 * TODO: 실제 API 엔드포인트로 업데이트 필요
 */
export const API_ENDPOINTS = {
  EXECUTIONS: '/api/executions',
  EXECUTION_STATUS: (jobId: string) => `/api/executions/${jobId}/status`,
} as const;
