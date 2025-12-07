import { http, HttpResponse } from 'msw';
import type { ProjectListResponse, ProjectDetailData, Project } from '../types/project';
import { JobStatus, type JobMetadata, type CloudWatchResponse, type JobStatusResponse } from '../types/whiteboard';
import { BASE_URL } from '../constants/api';

/**
 * Mock 프로젝트 데이터 (mutable for create)
 */
let mockProjects: Project[] = [
  {
    project_id: 1,
    project: 'Data Pipeline',
  },
  {
    project_id: 2,
    project: 'ML Training',
  },
  {
    project_id: 3,
    project: 'API Server',
  },
  {
    project_id: 4,
    project: 'Batch Jobs',
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
 * CloudWatch 메트릭 생성 함수
 */
const generateCloudWatchMetrics = (clusterName: string): CloudWatchResponse => {
  const metrics = [];
  const now = Date.now();
  for (let i = 29; i >= 0; i--) {
    metrics.push({
      timestamp: new Date(now - i * 60000).toISOString(), // 1분 간격
      cpu_utilization: Math.round((30 + Math.random() * 50) * 100) / 100,
      memory_utilization: Math.round((40 + Math.random() * 40) * 100) / 100,
    });
  }
  return {
    cluster_name: clusterName,
    metrics,
  };
};

/**
 * 프로젝트별 Mock Job 데이터 생성 (새로운 스키마)
 */
const generateMockJobs = (projectId: string): JobMetadata[] => {
  const baseJobs: JobMetadata[] = [
    {
      job_id: `${projectId}-job-001`,
      project: projectId,
      message: '데이터 파이프라인 실행 중',
      status: JobStatus.RUNNING,
    },
    {
      job_id: `${projectId}-job-002`,
      project: projectId,
      message: '배치 작업 완료',
      status: JobStatus.SUCCESS,
    },
    {
      job_id: `${projectId}-job-003`,
      project: projectId,
      message: 'API 서버 테스트 실행 중',
      status: JobStatus.RUNNING,
    },
    {
      job_id: `${projectId}-job-004`,
      project: projectId,
      message: 'ML 모델 학습 완료',
      status: JobStatus.SUCCESS,
    },
    {
      job_id: `${projectId}-job-005`,
      project: projectId,
      message: '메모리 초과로 인한 실패',
      status: JobStatus.FAILED,
    },
    {
      job_id: `${projectId}-job-006`,
      project: projectId,
      message: '실행 대기 중',
      status: JobStatus.PENDING,
    },
    {
      job_id: `${projectId}-job-007`,
      project: projectId,
      message: '데이터 처리 완료',
      status: JobStatus.SUCCESS,
    },
    {
      job_id: `${projectId}-job-008`,
      project: projectId,
      message: '실행 시간 초과',
      status: JobStatus.TIMEOUT,
    },
    {
      job_id: `${projectId}-job-009`,
      project: projectId,
      message: '사용자에 의해 취소됨',
      status: JobStatus.CANCELLED,
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
    const response: ProjectListResponse = mockProjects;
    return HttpResponse.json(response);
  }),

  /**
   * 프로젝트 생성
   * POST /api/project
   */
  http.post(`${BASE_URL}/api/project`, async ({ request }) => {
    const body = (await request.json()) as { name: string };

    const newProject: Project = {
      project_id: Date.now(),
      project: body.name,
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
    const project = mockProjects.find((p) => p.project_id === Number(projectId));

    const mockJobCount = 100 + Math.floor(Math.random() * 100);
    const response: ProjectDetailData = {
      project: {
        project_id: Number(projectId),
        project: projectId,
      },
      systemMetrics: {
        activeJobsCount: 3 + Math.floor(Math.random() * 5),
        cpuUsagePercent: 40 + Math.random() * 40,
        memoryUsagePercent: 30 + Math.random() * 40,
        totalJobsToday: mockJobCount,
        successRate: 90 + Math.random() * 8,
        lastUpdated: new Date().toISOString(),
      },
      recentJobs: generateMockJobs(projectId),
      resourceHistory: generateResourceHistory(),
      jobStatusStats: [
        { status: JobStatus.SUCCESS, count: Math.floor(mockJobCount * 0.85) },
        { status: JobStatus.RUNNING, count: 3 },
        { status: JobStatus.FAILED, count: Math.floor(mockJobCount * 0.05) },
        { status: JobStatus.PENDING, count: 2 },
        { status: JobStatus.TIMEOUT, count: 1 },
      ],
      languageStats: [
        { language: 'Python', count: Math.floor(mockJobCount * 0.4) },
        { language: 'JavaScript', count: Math.floor(mockJobCount * 0.3) },
        { language: 'TypeScript', count: Math.floor(mockJobCount * 0.15) },
        { language: 'Java', count: Math.floor(mockJobCount * 0.15) },
      ],
    };

    return HttpResponse.json(response);
  }),

  /**
   * 프로젝트 실행 이력(Job 목록) 조회
   * GET /api/projects/:projectId/jobs
   */
  http.get(`${BASE_URL}/api/projects/:projectId/jobs`, ({ params }) => {
    const { projectId } = params as { projectId: string };
    const project = mockProjects.find((p) => p.project_id === Number(projectId));

    if (!project) {
      return new HttpResponse(null, { status: 404 });
    }

    const jobs = generateMockJobs(projectId);
    return HttpResponse.json(jobs);
  }),

  /**
   * 코드 업로드
   * POST /api/upload
   */
  http.post(`${BASE_URL}/api/upload`, async ({ request }) => {
    const body = (await request.json()) as {
      code: string;
      description: string;
      function_name: string;
      language: string;
      project: string;
    };

    const projectId = body.project;
    const jobId = `${projectId}-job-${Date.now()}`;

    // Job 상태 초기화
    jobStatusStore[`${projectId}-${jobId}`] = {
      status: 'UPLOADING',
      progress: 10,
      startTime: Date.now(),
    };

    // JobMetadata 반환
    const jobMetadata: JobMetadata = {
      job_id: jobId,
      project: projectId,
      code_key: `code-${Date.now()}`,
      message: `${body.function_name} 함수가 업로드되었습니다.`,
      status: JobStatus.PENDING,
    };

    return HttpResponse.json(jobMetadata);
  }),

  /**
   * 실행 트리거
   * POST /api/execute/:jobId
   */
  http.post(`${BASE_URL}/api/execute/:jobId`, ({ params }) => {
    const { jobId } = params as { jobId: string };

    // jobId에서 projectId 추출 (job-001 형식에서 projectId 추출)
    const parts = jobId.split('-job-');
    const projectId = parts[0] || 'unknown-project';
    const key = `${projectId}-${jobId}`;

    if (jobStatusStore[key]) {
      jobStatusStore[key].status = 'QUEUED';
      jobStatusStore[key].progress = 25;
    }

    // JobMetadata 형식으로 반환
    const jobMetadata: JobMetadata = {
      job_id: jobId,
      project: projectId,
      message: '실행이 시작되었습니다.',
      status: JobStatus.PENDING,
    };

    return HttpResponse.json(jobMetadata);
  }),

  /**
   * 실행 상태 조회
   * GET /api/jobs/:jobId/status
   */
  http.get(`${BASE_URL}/api/jobs/:jobId/status`, ({ params }) => {
    const { jobId } = params as { jobId: string };

    // jobId에서 projectId 추출
    const parts = jobId.split('-job-');
    const projectId = parts[0] || 'unknown-project';
    const key = `${projectId}-${jobId}`;

    // 상태 시뮬레이션
    if (jobStatusStore[key]) {
      const elapsed = Date.now() - jobStatusStore[key].startTime;
      const createdAt = new Date(jobStatusStore[key].startTime).toISOString();
      let status: JobStatus;
      let startedAt: string | undefined;
      let completedAt: string | undefined;

      if (elapsed < 3000) {
        status = JobStatus.PENDING;
      } else if (elapsed < 6000) {
        status = JobStatus.PENDING;
        startedAt = new Date(jobStatusStore[key].startTime + 3000).toISOString();
      } else if (elapsed < 12000) {
        status = JobStatus.RUNNING;
        startedAt = new Date(jobStatusStore[key].startTime + 3000).toISOString();
      } else {
        status = JobStatus.SUCCESS;
        startedAt = new Date(jobStatusStore[key].startTime + 3000).toISOString();
        completedAt = new Date().toISOString();
      }

      const response: JobStatusResponse = {
        job_id: jobId,
        status,
        project: projectId,
        created_at: createdAt,
        ...(startedAt && { started_at: startedAt }),
        ...(completedAt && { completed_at: completedAt }),
        timeout_ms: 300000, // 5분
      };

      return HttpResponse.json(response);
    }

    // 기존 Job (Mock) - 완료된 상태로 반환
    const response: JobStatusResponse = {
      job_id: jobId,
      status: JobStatus.SUCCESS,
      project: projectId,
      created_at: new Date(Date.now() - 60000).toISOString(),
      started_at: new Date(Date.now() - 55000).toISOString(),
      completed_at: new Date().toISOString(),
      timeout_ms: 300000,
    };

    return HttpResponse.json(response);
  }),

  /**
   * CloudWatch 메트릭 조회
   * GET /api/cloudwatch/:clusterName
   */
  http.get(`${BASE_URL}/api/cloudwatch/:clusterName`, ({ params }) => {
    const { clusterName } = params as { clusterName: string };
    const response = generateCloudWatchMetrics(clusterName);
    return HttpResponse.json(response);
  }),
];
