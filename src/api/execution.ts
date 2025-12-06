import { useQuery, useQueryClient } from '@tanstack/react-query';
import client from './_client';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Query Keys
 */
export const executionKeys = {
  all: ['executions'],
  detail: (jobId: string) => ['executions', jobId],
  status: (jobId: string) => ['executions', jobId, 'status'],
};

/**
 * 코드 제출 API
 *
 * 1) POST /api/upload  로 코드 업로드
 * 2) POST /api/execute/{job_id} 로 실행 트리거
 * 3) 최종적으로 { jobId } 반환
 */
export const submitCode = async (request: {
  code: string;
  language: string;
}): Promise<{ jobId: string }> => {
  // 1. 업로드
  const uploadResponse = await client.post(API_ENDPOINTS.UPLOAD, request);
  const uploadData = uploadResponse.data as any;

  const jobId: string = uploadData.job_id || uploadData.jobId;

  if (!jobId) {
    throw new Error('업로드 응답에 job_id 가 없습니다.');
  }

  // 2. 실행 트리거
  await client.post(API_ENDPOINTS.EXECUTE(jobId));

  // 3. 프론트에서 사용하기 좋은 형태로 반환
  return { jobId };
};

/**
 * 실행 상태 조회 API (GET)
 *
 * @param {string} jobId - Job ID
 * @returns {Promise<Object>} ExecutionInfo
 */
const fetchExecutionStatus = async (jobId: string) => {
  const response = await client.get(API_ENDPOINTS.STATUS(jobId));
  const data = response.data as any;

  // 백엔드 status 값을 프론트에서 쓰는 값으로 매핑
  const rawStatus: string =
    data.status ?? data.state ?? data.phase ?? 'QUEUED';
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
    jobId,
    status,
    progress: Math.min(progress, 100),
    createdAt:
      data.created_at || data.createdAt || new Date().toISOString(),
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
 *
 * @param {string|null} jobId - Job ID
 * @param {boolean} enabled - 쿼리 활성화 여부
 * @param {number} refetchInterval - 폴링 간격 (ms)
 *
 * 사용 예시:
 * const { data, isLoading } = useExecutionStatus(jobId, true, 1000);
 */
export const useExecutionStatus = (
  jobId: string | null,
  enabled = true,
  refetchInterval = 3000
) => {
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
    staleTime: 0, // 항상 fresh하지 않도록
  });
};

/**
 * Query Invalidation 헬퍼 함수
 *
 * POST/PUT/DELETE 후 호출하여 캐시 무효화
 *
 * 사용 예시:
 * const queryClient = useQueryClient();
 * await submitCode(data);
 * invalidateExecutionQueries(queryClient, jobId);
 */
export const invalidateExecutionQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  jobId?: string | null
) => {
  if (jobId) {
    queryClient.invalidateQueries({ queryKey: executionKeys.status(jobId) });
    queryClient.invalidateQueries({ queryKey: executionKeys.detail(jobId) });
  } else {
    queryClient.invalidateQueries({ queryKey: executionKeys.all });
  }
};
