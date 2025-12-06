import { http, HttpResponse } from 'msw';
import type { ProjectListResponse, ProjectDetailData, Project } from '../types/project';
import { JobStatus } from '../types/whiteboard';
import { BASE_URL } from '../constants/api';

/**
 * Mock 프로젝트 데이터 (mutable for create)
 */
let mockProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Data Pipeline',
    description: '데이터 처리 파이프라인 프로젝트',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    jobCount: 142,
    lastJobAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'proj-002',
    name: 'ML Training',
    description: '머신러닝 모델 학습 프로젝트',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    jobCount: 87,
    lastJobAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'proj-003',
    name: 'API Server',
    description: 'REST API 서버 프로젝트',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    jobCount: 56,
    lastJobAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 'proj-004',
    name: 'Batch Jobs',
    description: '배치 작업 자동화',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    jobCount: 234,
    lastJobAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * 리소스 히스토리 생성 함수
 */
const generateResourceHistory = () => {
  const history = [];
  const now = Date.now();
  for (let i = 29; i >= 0; i--) {
    history.push({
      timestamp: new Date(now - i * 3000).toISOString(),
      cpuUsagePercent: 40 + Math.random() * 40,
      memoryUsagePercent: 30 + Math.random() * 40,
    });
  }
  return history;
};

/**
 * 프로젝트별 Mock Job 데이터 생성
 */
const generateMockJobs = (projectId: string) => {
  const baseJobs = [
    {
      id: `${projectId}-job-001`,
      status: JobStatus.RUNNING,
      language: 'Python',
      startedAt: new Date(Date.now() - 30000).toISOString(),
      duration: 30000,
    },
    {
      id: `${projectId}-job-002`,
      status: JobStatus.SUCCESS,
      language: 'JavaScript',
      startedAt: new Date(Date.now() - 120000).toISOString(),
      completedAt: new Date(Date.now() - 60000).toISOString(),
      duration: 60000,
    },
    {
      id: `${projectId}-job-003`,
      status: JobStatus.RUNNING,
      language: 'Java',
      startedAt: new Date(Date.now() - 45000).toISOString(),
      duration: 45000,
    },
    {
      id: `${projectId}-job-004`,
      status: JobStatus.SUCCESS,
      language: 'Python',
      startedAt: new Date(Date.now() - 300000).toISOString(),
      completedAt: new Date(Date.now() - 270000).toISOString(),
      duration: 30000,
    },
    {
      id: `${projectId}-job-005`,
      status: JobStatus.FAILED,
      language: 'Python',
      startedAt: new Date(Date.now() - 180000).toISOString(),
      completedAt: new Date(Date.now() - 150000).toISOString(),
      duration: 30000,
    },
    {
      id: `${projectId}-job-006`,
      status: JobStatus.QUEUED,
      language: 'TypeScript',
      startedAt: new Date(Date.now() - 5000).toISOString(),
    },
    {
      id: `${projectId}-job-007`,
      status: JobStatus.SUCCESS,
      language: 'JavaScript',
      startedAt: new Date(Date.now() - 600000).toISOString(),
      completedAt: new Date(Date.now() - 540000).toISOString(),
      duration: 60000,
    },
    {
      id: `${projectId}-job-008`,
      status: JobStatus.UPLOADING,
      language: 'Python',
      startedAt: new Date(Date.now() - 2000).toISOString(),
    },
  ];
  return baseJobs;
};

/**
 * Job 상태 시뮬레이션을 위한 저장소
 */
const jobStatusStore: Record<string, { status: string; progress: number; startTime: number }> = {};

export const handlers = [
  /**
   * 프로젝트 목록 조회
   * GET /api/projects
   */
  http.get(`${BASE_URL}/api/projects`, () => {
    const response: ProjectListResponse = {
      projects: mockProjects,
      total: mockProjects.length,
    };
    return HttpResponse.json(response);
  }),

  /**
   * 프로젝트 생성
   * POST /api/projects
   */
  http.post(`${BASE_URL}/api/projects`, async ({ request }) => {
    const body = (await request.json()) as { name: string; description?: string };

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: body.name,
      description: body.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jobCount: 0,
    };

    mockProjects = [newProject, ...mockProjects];

    return HttpResponse.json(newProject, { status: 201 });
  }),

  /**
   * 프로젝트 대시보드 데이터 조회
   * GET /api/projects/:projectId/dashboard
   */
  http.get(`${BASE_URL}/api/projects/:projectId/dashboard`, ({ params }) => {
    const { projectId } = params as { projectId: string };
    const project = mockProjects.find((p) => p.id === projectId);

    if (!project) {
      return new HttpResponse(null, { status: 404 });
    }

    const response: ProjectDetailData = {
      project,
      systemMetrics: {
        activeJobsCount: 3 + Math.floor(Math.random() * 5),
        cpuUsagePercent: 40 + Math.random() * 40,
        memoryUsagePercent: 30 + Math.random() * 40,
        totalJobsToday: project.jobCount,
        successRate: 90 + Math.random() * 8,
        lastUpdated: new Date().toISOString(),
      },
      recentJobs: generateMockJobs(projectId),
      resourceHistory: generateResourceHistory(),
      jobStatusStats: [
        { status: JobStatus.SUCCESS, count: Math.floor(project.jobCount * 0.85) },
        { status: JobStatus.RUNNING, count: 3 },
        { status: JobStatus.FAILED, count: Math.floor(project.jobCount * 0.05) },
        { status: JobStatus.QUEUED, count: 2 },
        { status: JobStatus.UPLOADING, count: 1 },
      ],
      languageStats: [
        { language: 'Python', count: Math.floor(project.jobCount * 0.4) },
        { language: 'JavaScript', count: Math.floor(project.jobCount * 0.3) },
        { language: 'TypeScript', count: Math.floor(project.jobCount * 0.15) },
        { language: 'Java', count: Math.floor(project.jobCount * 0.15) },
      ],
    };

    return HttpResponse.json(response);
  }),

  /**
   * 코드 업로드
   * POST /api/projects/:projectId/upload
   */
  http.post(`${BASE_URL}/api/projects/:projectId/upload`, async ({ params }) => {
    const { projectId } = params as { projectId: string };
    const jobId = `${projectId}-job-${Date.now()}`;

    // Job 상태 초기화
    jobStatusStore[`${projectId}-${jobId}`] = {
      status: 'UPLOADING',
      progress: 10,
      startTime: Date.now(),
    };

    return HttpResponse.json({
      job_id: jobId,
      project_id: projectId,
      message: '코드가 성공적으로 업로드되었습니다.',
    });
  }),

  /**
   * 실행 트리거
   * POST /api/projects/:projectId/jobs/:jobId/execute
   */
  http.post(`${BASE_URL}/api/projects/:projectId/jobs/:jobId/execute`, ({ params }) => {
    const { projectId, jobId } = params as { projectId: string; jobId: string };
    const key = `${projectId}-${jobId}`;

    if (jobStatusStore[key]) {
      jobStatusStore[key].status = 'QUEUED';
      jobStatusStore[key].progress = 25;
    }

    return HttpResponse.json({
      message: '실행이 시작되었습니다.',
      job_id: jobId,
    });
  }),

  /**
   * 실행 상태 조회
   * GET /api/projects/:projectId/jobs/:jobId/status
   */
  http.get(`${BASE_URL}/api/projects/:projectId/jobs/:jobId/status`, ({ params }) => {
    const { projectId, jobId } = params as { projectId: string; jobId: string };
    const key = `${projectId}-${jobId}`;

    // 상태 시뮬레이션
    if (jobStatusStore[key]) {
      const elapsed = Date.now() - jobStatusStore[key].startTime;

      if (elapsed < 3000) {
        jobStatusStore[key].status = 'UPLOADING';
        jobStatusStore[key].progress = 10 + Math.floor((elapsed / 3000) * 15);
      } else if (elapsed < 6000) {
        jobStatusStore[key].status = 'QUEUED';
        jobStatusStore[key].progress = 25 + Math.floor(((elapsed - 3000) / 3000) * 20);
      } else if (elapsed < 12000) {
        jobStatusStore[key].status = 'RUNNING';
        jobStatusStore[key].progress = 45 + Math.floor(((elapsed - 6000) / 6000) * 50);
      } else {
        jobStatusStore[key].status = 'SUCCESS';
        jobStatusStore[key].progress = 100;
      }

      return HttpResponse.json({
        job_id: jobId,
        project_id: projectId,
        status: jobStatusStore[key].status,
        progress: jobStatusStore[key].progress,
        created_at: new Date(jobStatusStore[key].startTime).toISOString(),
        completed_at: jobStatusStore[key].status === 'SUCCESS' ? new Date().toISOString() : undefined,
        result:
          jobStatusStore[key].status === 'SUCCESS'
            ? {
                output: 'Hello, Snowflake!\n실행이 완료되었습니다.',
                executionTime: elapsed,
                memoryUsage: 128,
                cpuUsage: 45,
              }
            : undefined,
      });
    }

    // 기존 Job (Mock)
    return HttpResponse.json({
      job_id: jobId,
      project_id: projectId,
      status: 'SUCCESS',
      progress: 100,
      created_at: new Date(Date.now() - 60000).toISOString(),
      completed_at: new Date().toISOString(),
      result: {
        output: 'Mock execution result',
        executionTime: 5000,
        memoryUsage: 64,
        cpuUsage: 30,
      },
    });
  }),
];
