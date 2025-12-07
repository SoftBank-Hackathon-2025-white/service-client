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
  const now = new Date();

  const baseJobs: JobMetadata[] = [
    {
      job_id: `${projectId}-job-001`,
      project: projectId,
      message: '데이터 파이프라인 실행 중',
      status: JobStatus.RUNNING,
      data: {
        created_at: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
        updated_at: new Date(now.getTime() - 1000 * 60 * 2).toISOString(),
        started_at: new Date(now.getTime() - 1000 * 60 * 4).toISOString(),
        completed_at: null,
        code_key: `${projectId}/python/data-pipeline.py`,
        language: 'python',
        result: null,
      },
    },
    {
      job_id: `${projectId}-job-002`,
      project: projectId,
      message: '배치 작업 완료',
      status: JobStatus.SUCCESS,
      data: {
        created_at: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
        updated_at: new Date(now.getTime() - 1000 * 60 * 25).toISOString(),
        started_at: new Date(now.getTime() - 1000 * 60 * 29).toISOString(),
        completed_at: new Date(now.getTime() - 1000 * 60 * 25).toISOString(),
        code_key: `${projectId}/java/batch-job.java`,
        language: 'java',
        result: {
          job_id: `${projectId}-job-002`,
          status: 'COMPLETED',
          stderr: '',
          stdout: 'Batch job completed successfully!\n',
          log_key: `logs/${projectId}-job-002.json`,
          code_key: `${projectId}/java/batch-job.java`,
          logs_url: `https://example.com/logs/${projectId}-job-002.json`,
          resource: {
            memory_mb: 128.5,
            cpu_percent: 15.3,
            execution_time_ms: 4523,
          },
          completed_at: new Date(now.getTime() - 1000 * 60 * 25).toISOString(),
          error_message: null,
        },
      },
    },
    {
      job_id: `${projectId}-job-003`,
      project: projectId,
      message: 'API 서버 테스트 실행 중',
      status: JobStatus.RUNNING,
      data: {
        created_at: new Date(now.getTime() - 1000 * 60 * 3).toISOString(),
        updated_at: new Date(now.getTime() - 1000 * 60 * 1).toISOString(),
        started_at: new Date(now.getTime() - 1000 * 60 * 2).toISOString(),
        completed_at: null,
        code_key: `${projectId}/typescript/api-test.ts`,
        language: 'typescript',
        result: null,
      },
    },
    {
      job_id: `${projectId}-job-004`,
      project: projectId,
      message: 'ML 모델 학습 완료',
      status: JobStatus.SUCCESS,
      data: {
        created_at: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
        updated_at: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
        started_at: new Date(now.getTime() - 1000 * 60 * 58).toISOString(),
        completed_at: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
        code_key: `${projectId}/python/ml-training.py`,
        language: 'python',
        result: {
          job_id: `${projectId}-job-004`,
          status: 'COMPLETED',
          stderr: '',
          stdout: 'Model training completed. Accuracy: 95.3%\n',
          log_key: `logs/${projectId}-job-004.json`,
          code_key: `${projectId}/python/ml-training.py`,
          logs_url: `https://example.com/logs/${projectId}-job-004.json`,
          resource: {
            memory_mb: 2048.7,
            cpu_percent: 85.2,
            execution_time_ms: 2580000,
          },
          completed_at: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
          error_message: null,
        },
      },
    },
    {
      job_id: `${projectId}-job-005`,
      project: projectId,
      message: '메모리 초과로 인한 실패',
      status: JobStatus.FAILED,
      data: {
        created_at: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
        updated_at: new Date(now.getTime() - 1000 * 60 * 40).toISOString(),
        started_at: new Date(now.getTime() - 1000 * 60 * 44).toISOString(),
        completed_at: new Date(now.getTime() - 1000 * 60 * 40).toISOString(),
        code_key: `${projectId}/go/memory-intensive.go`,
        language: 'go',
        result: {
          job_id: `${projectId}-job-005`,
          status: 'FAILED',
          stderr: 'fatal error: runtime: out of memory\n',
          stdout: '',
          log_key: `logs/${projectId}-job-005.json`,
          code_key: `${projectId}/go/memory-intensive.go`,
          logs_url: `https://example.com/logs/${projectId}-job-005.json`,
          resource: {
            memory_mb: 4096.0,
            cpu_percent: 45.8,
            execution_time_ms: 12300,
          },
          completed_at: new Date(now.getTime() - 1000 * 60 * 40).toISOString(),
          error_message: 'Out of memory error',
        },
      },
    },
    {
      job_id: `${projectId}-job-006`,
      project: projectId,
      message: '실행 대기 중',
      status: JobStatus.PENDING,
      data: {
        created_at: new Date(now.getTime() - 1000 * 30).toISOString(),
        updated_at: new Date(now.getTime() - 1000 * 30).toISOString(),
        started_at: null,
        completed_at: null,
        code_key: `${projectId}/rust/async-task.rs`,
        language: 'rust',
        result: null,
      },
    },
    {
      job_id: `${projectId}-job-007`,
      project: projectId,
      message: '데이터 처리 완료',
      status: JobStatus.SUCCESS,
      data: {
        created_at: new Date(now.getTime() - 1000 * 60 * 20).toISOString(),
        updated_at: new Date(now.getTime() - 1000 * 60 * 18).toISOString(),
        started_at: new Date(now.getTime() - 1000 * 60 * 19).toISOString(),
        completed_at: new Date(now.getTime() - 1000 * 60 * 18).toISOString(),
        code_key: `${projectId}/javascript/data-processor.js`,
        language: 'javascript',
        result: {
          job_id: `${projectId}-job-007`,
          status: 'COMPLETED',
          stderr: '',
          stdout: 'Processed 10000 records successfully\n',
          log_key: `logs/${projectId}-job-007.json`,
          code_key: `${projectId}/javascript/data-processor.js`,
          logs_url: `https://example.com/logs/${projectId}-job-007.json`,
          resource: {
            memory_mb: 256.3,
            cpu_percent: 32.1,
            execution_time_ms: 1850,
          },
          completed_at: new Date(now.getTime() - 1000 * 60 * 18).toISOString(),
          error_message: null,
        },
      },
    },
    {
      job_id: `${projectId}-job-008`,
      project: projectId,
      message: '실행 시간 초과',
      status: JobStatus.TIMEOUT,
      data: {
        created_at: new Date(now.getTime() - 1000 * 60 * 90).toISOString(),
        updated_at: new Date(now.getTime() - 1000 * 60 * 85).toISOString(),
        started_at: new Date(now.getTime() - 1000 * 60 * 89).toISOString(),
        completed_at: new Date(now.getTime() - 1000 * 60 * 85).toISOString(),
        code_key: `${projectId}/cpp/long-running.cpp`,
        language: 'cpp',
        result: {
          job_id: `${projectId}-job-008`,
          status: 'TIMEOUT',
          stderr: '',
          stdout: 'Processing...\n',
          log_key: `logs/${projectId}-job-008.json`,
          code_key: `${projectId}/cpp/long-running.cpp`,
          logs_url: `https://example.com/logs/${projectId}-job-008.json`,
          resource: {
            memory_mb: 512.8,
            cpu_percent: 98.5,
            execution_time_ms: 300000,
          },
          completed_at: new Date(now.getTime() - 1000 * 60 * 85).toISOString(),
          error_message: 'Execution timeout exceeded',
        },
      },
    },
    {
      job_id: `${projectId}-job-009`,
      project: projectId,
      message: '사용자에 의해 취소됨',
      status: JobStatus.CANCELLED,
      data: {
        created_at: new Date(now.getTime() - 1000 * 60 * 10).toISOString(),
        updated_at: new Date(now.getTime() - 1000 * 60 * 8).toISOString(),
        started_at: new Date(now.getTime() - 1000 * 60 * 9).toISOString(),
        completed_at: new Date(now.getTime() - 1000 * 60 * 8).toISOString(),
        code_key: `${projectId}/python/cancelled-job.py`,
        language: 'python',
        result: {
          job_id: `${projectId}-job-009`,
          status: 'CANCELLED',
          stderr: '',
          stdout: 'Starting execution...\n',
          log_key: `logs/${projectId}-job-009.json`,
          code_key: `${projectId}/python/cancelled-job.py`,
          logs_url: `https://example.com/logs/${projectId}-job-009.json`,
          resource: {
            memory_mb: 64.2,
            cpu_percent: 12.3,
            execution_time_ms: 450,
          },
          completed_at: new Date(now.getTime() - 1000 * 60 * 8).toISOString(),
          error_message: 'Cancelled by user',
        },
      },
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
