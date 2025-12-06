export const PATHS = {
  /** 메인 페이지 (프로젝트 목록) */
  MAIN: '/',
  /** 프로젝트 상세 */
  PROJECT_DETAIL: '/projects/:projectId',
  /** Job 실행 추적 */
  JOB_EXECUTION: '/projects/:projectId/jobs/:jobId',
} as const;

/**
 * 동적 경로 생성 헬퍼 함수
 */
export const getProjectPath = (projectId: string) => `/projects/${projectId}`;

export const getJobExecutionPath = (projectId: string, jobId: string) => `/projects/${projectId}/jobs/${jobId}`;
