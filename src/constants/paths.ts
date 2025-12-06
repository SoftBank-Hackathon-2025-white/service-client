export const PATHS = {
  MAIN: '/',
  WHITEBOARD: '/whiteboard',
  EXECUTION: '/execution/:jobId',
  COMPLETE: '/complete/:jobId',
} as const;

/**
 * 동적 경로 생성 헬퍼 함수
 */
export const getExecutionPath = (jobId: string) => `/execution/${jobId}`;
export const getCompletePath = (jobId: string) => `/complete/${jobId}`;
