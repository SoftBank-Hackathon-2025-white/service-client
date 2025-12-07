import { useQuery, useQueryClient } from '@tanstack/react-query';
import client from './_client';
import { API_ENDPOINTS } from '../constants/api';
import type { CodeSubmitRequest, CodeSubmitResponse } from '../types/project';
import type { JobMetadata, JobStatusResponse, ExecutionLogResponse } from '../types/whiteboard';
import { JobStatus } from '../types/whiteboard';

/**
 * Query Keys
 */
export const executionKeys = {
  all: ['executions'] as const,
  jobs: (projectId: string) => ['executions', projectId, 'jobs'] as const,
  detail: (projectId: string, jobId: string) => ['executions', projectId, jobId] as const,
  status: (jobId: string) => ['executions', 'status', jobId] as const,
  log: (logKey: string) => ['executions', 'log', logKey] as const,
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
 * GET /api/jobs/{jobId}/status
 */
const fetchExecutionStatus = async (jobId: string) => {
  const response = await client.get(API_ENDPOINTS.STATUS(jobId));
  const data = response.data as JobStatusResponse;

  // JobStatus enum을 UI 상태로 매핑
  const statusMap: Record<JobStatus, 'Uploading' | 'Queued' | 'Running' | 'Success' | 'Failed'> = {
    [JobStatus.PENDING]: 'Queued',
    [JobStatus.RUNNING]: 'Running',
    [JobStatus.SUCCESS]: 'Success',
    [JobStatus.FAILED]: 'Failed',
    [JobStatus.TIMEOUT]: 'Failed',
    [JobStatus.CANCELLED]: 'Failed',
  };

  const status = statusMap[data.status] || 'Queued';

  // 상태 기준으로 진행률 계산
  let progress: number;
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

  return {
    jobId: data.job_id,
    projectId: data.project,
    status,
    progress,
    createdAt: data.created_at,
    startedAt: data.started_at,
    completedAt: data.completed_at,
    timeoutMs: data.timeout_ms,
    // 실행 완료 시 로그 키
    logKey: data.log_key,
  };
};

/**
 * 실행 상태 조회 React Query Hook (GET)
 */
export const useExecutionStatus = (jobId: string | null, enabled = true, refetchInterval = 3000) => {
  return useQuery({
    queryKey: executionKeys.status(jobId || ''),
    queryFn: () => fetchExecutionStatus(jobId!),
    enabled: enabled && !!jobId,
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
 * 로그 조회 API
 * GET /api/log?log_key=XXX
 * 응답: JSON string을 파싱하여 { stdout?, stderr? } 반환
 */
const fetchExecutionLog = async (logKey: string): Promise<ExecutionLogResponse> => {
  const response = await client.get(API_ENDPOINTS.LOG(logKey));
  const data = response.data;
  
  // string으로 받은 경우 JSON.parse 시도
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as ExecutionLogResponse;
    } catch (error) {
      console.error('Failed to parse log data:', error);
      // 파싱 실패 시 원본 string을 stdout으로 반환
      return { stdout: data };
    }
  }
  
  // 이미 object인 경우 그대로 반환
  return data as ExecutionLogResponse;
};

/**
 * 로그 조회 React Query Hook
 */
export const useExecutionLog = (logKey: string | null | undefined, enabled = true) => {
  return useQuery({
    queryKey: executionKeys.log(logKey || ''),
    queryFn: () => fetchExecutionLog(logKey!),
    enabled: enabled && !!logKey,
    staleTime: 60000, // 1분간 캐시
    retry: 1,
  });
};

/**
 * Query Invalidation 헬퍼 함수
 */
export const invalidateExecutionQueries = (queryClient: ReturnType<typeof useQueryClient>, jobId?: string | null) => {
  if (jobId) {
    queryClient.invalidateQueries({ queryKey: executionKeys.status(jobId) });
  } else {
    queryClient.invalidateQueries({ queryKey: executionKeys.all });
  }
};
