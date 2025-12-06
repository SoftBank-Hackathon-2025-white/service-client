// 백엔드 서버 주소 (Swagger: http://54.180.234.73:8000/docs#/)
// 환경 변수와 상관없이 항상 이 주소로 요청을 보냅니다.
export const BASE_URL = 'http://54.180.234.73:8000';

/**
 * API 엔드포인트 상수
 *
 * 백엔드 문서 기준:
 * - POST /api/upload
 * - POST /api/execute/{job_id}
 * - GET  /api/status/{job_id}
 */
export const API_ENDPOINTS = {
  UPLOAD: '/api/upload',
  EXECUTE: (jobId: string) => `/api/execute/${jobId}`,
  STATUS: (jobId: string) => `/api/status/${jobId}`,
} as const;
