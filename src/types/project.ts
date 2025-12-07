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
