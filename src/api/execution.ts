import { useQuery, useQueryClient } from '@tanstack/react-query';
import client from './_client';
import { API_ENDPOINTS } from '../constants/api';
import type { CodeSubmitRequest, CodeSubmitResponse } from '../types/project';
import type { JobMetadata } from '../types/whiteboard';

/**
 * Query Keys
 */
export const executionKeys = {
  all: ['executions'] as const,
  jobs: (projectId: string) => ['executions', projectId, 'jobs'] as const,
  detail: (projectId: string, jobId: string) => ['executions', projectId, jobId] as const,
  status: (projectId: string, jobId: string) => ['executions', projectId, jobId, 'status'] as const,
};

/**
 * 프로젝트 실행 이력(Job 목록) 조회 API
 * GET /api/projects/{projectId}/jobs
 */
const fetchProjectJobs = async (projectId: string): Promise<JobMetadata[]> => {
  const response = await client.get(API_ENDPOINTS.JOBS(projectId));
  return response.data as JobMetadata[];
};

/**
 * 프로젝트 실행 이력 조회 React Query Hook
 */
export const useProjectJobs = (projectId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: executionKeys.jobs(projectId || ''),
    queryFn: () => fetchProjectJobs(projectId!),
    enabled: enabled && !!projectId,
    staleTime: 30000,
  });
};

/**
 * 코드 제출 API
 *
 * 1) POST /api/upload 로 코드 업로드 (JobMetadata 반환)
 * 2) POST /api/execute/{job_id} 로 실행 트리거
 * 3) 최종적으로 JobMetadata 반환
 */
export const submitCode = async (request: CodeSubmitRequest): Promise<CodeSubmitResponse> => {
  const { code, description, function_name, language, project } = request;

  // 개행문자(\n, \r) 제거
  const sanitizedCode = code.replace(/[\r\n]/g, '');

  // 1. 업로드 (JobMetadata 반환)
  const uploadResponse = await client.post(API_ENDPOINTS.UPLOAD, {
    code: sanitizedCode,
    description,
    function_name,
    language,
    project,
  });
  const jobMetadata = uploadResponse.data as CodeSubmitResponse;

  const jobId: string = jobMetadata.job_id;

  if (!jobId) {
    throw new Error('업로드 응답에 job_id 가 없습니다.');
  }

  // 2. 실행 트리거
  await client.post(API_ENDPOINTS.EXECUTE(jobId));

  // 3. JobMetadata 반환
  return jobMetadata;
};

/**
 * 실행 상태 조회 API (GET)
 */
const fetchExecutionStatus = async (projectId: string, jobId: string) => {
  const response = await client.get(API_ENDPOINTS.STATUS(projectId, jobId));
  const data = response.data as any;

  // 백엔드 status 값을 프론트에서 쓰는 값으로 매핑
  const rawStatus: string = data.status ?? data.state ?? data.phase ?? 'QUEUED';
  const normalized = rawStatus.toUpperCase();

  let status: 'Uploading' | 'Queued' | 'Running' | 'Success' | 'Failed';
  switch (normalized) {
    case 'UPLOADING':
      status = 'Uploading';
      break;
    case 'QUEUED':
    case 'PENDING':
      status = 'Queued';
      break;
    case 'RUNNING':
    case 'IN_PROGRESS':
      status = 'Running';
      break;
    case 'SUCCESS':
    case 'COMPLETED':
      status = 'Success';
      break;
    case 'FAILED':
    case 'ERROR':
      status = 'Failed';
      break;
    default:
      status = 'Queued';
  }

  // progress 없으면 상태 기준으로 대략적인 값 계산
  let progress: number;
  if (typeof data.progress === 'number') {
    progress = data.progress;
  } else {
    switch (status) {
      case 'Uploading':
        progress = 10;
        break;
      case 'Queued':
        progress = 25;
        break;
      case 'Running':
        progress = 70;
        break;
      case 'Success':
      case 'Failed':
        progress = 100;
        break;
      default:
        progress = 0;
    }
  }

  return {
    projectId,
    jobId,
    status,
    progress: Math.min(progress, 100),
    createdAt: data.created_at || data.createdAt || new Date().toISOString(),
    completedAt: data.completed_at || data.completedAt,
    result: data.result || {
      output: data.output,
      executionTime: data.execution_time ?? data.executionTime,
      memoryUsage: data.memory_usage ?? data.memoryUsage,
      cpuUsage: data.cpu_usage ?? data.cpuUsage,
    },
  };
};

/**
 * 실행 상태 조회 React Query Hook (GET)
 */
export const useExecutionStatus = (
  projectId: string | null,
  jobId: string | null,
  enabled = true,
  refetchInterval = 3000
) => {
  return useQuery({
    queryKey: executionKeys.status(projectId || '', jobId || ''),
    queryFn: () => fetchExecutionStatus(projectId!, jobId!),
    enabled: enabled && !!projectId && !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data as any;
      // Success 또는 Failed 상태면 폴링 중지
      if (data?.status === 'Success' || data?.status === 'Failed') {
        return false;
      }
      return refetchInterval;
    },
    retry: false,
    staleTime: 0,
  });
};

/**
 * Query Invalidation 헬퍼 함수
 */
export const invalidateExecutionQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  projectId?: string | null,
  jobId?: string | null
) => {
  if (projectId && jobId) {
    queryClient.invalidateQueries({ queryKey: executionKeys.status(projectId, jobId) });
    queryClient.invalidateQueries({ queryKey: executionKeys.detail(projectId, jobId) });
  } else {
    queryClient.invalidateQueries({ queryKey: executionKeys.all });
  }
};
