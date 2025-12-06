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
 * 코드 제출 API (POST)
 * 
 * @param {Object} request - { code: string, language: string }
 * @returns {Promise<Object>} { jobId: string }
 * 
 * useMutation 대신 axios 직접 호출 방식
 * 제출 후 필요시 invalidateQueries 호출
 */
export const submitCode = async (request: { code: string; language: string }): Promise<{ jobId: string }> => {
  // Mock: 즉시 Job ID 발급 (Instant Feedback)
  const mockJobId = `SF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('✓ Job ID issued:', mockJobId);
  console.log('✓ Code submitted:', request);
  console.log('→ Background: S3 upload & ECS trigger started');
  
  // TODO: 실제 API 호출로 변경
  // const response = await client.post(API_ENDPOINTS.EXECUTIONS, request);
  // return response.data;
  
  return new Promise<{ jobId: string }>((resolve) => {
    setTimeout(() => {
      resolve({ jobId: mockJobId });
    }, 300);
  });
};

/**
 * 실행 상태 조회 API (GET)
 * 
 * @param {string} jobId - Job ID
 * @returns {Promise<Object>} ExecutionInfo
 */
const fetchExecutionStatus = async (jobId: string) => {
  // TODO: 실제 API 호출로 변경
  // const response = await client.get(API_ENDPOINTS.EXECUTION_STATUS(jobId));
  // return response.data;
  
  // Mock 데이터
  const startTime = parseInt(jobId.split('-')[1] || '0');
  const elapsed = Date.now() - startTime;
  
  let status;
  let progress;
  
  if (elapsed < 2000) {
    status = 'Uploading';
    progress = (elapsed / 2000) * 25;
  } else if (elapsed < 4000) {
    status = 'Queued';
    progress = 25 + ((elapsed - 2000) / 2000) * 25;
  } else if (elapsed < 8000) {
    status = 'Running';
    progress = 50 + ((elapsed - 4000) / 4000) * 40;
  } else {
    status = 'Success';
    progress = 100;
  }
  
  return {
    jobId,
    status,
    progress: Math.min(progress, 100),
    createdAt: new Date(startTime).toISOString(),
    completedAt: status === 'Success' ? new Date().toISOString() : undefined,
    result: status === 'Success' ? {
      output: 'Hello, Snowflake!\n실행 완료!',
      executionTime: elapsed,
      memoryUsage: 25.6,
      cpuUsage: 45.2,
    } : undefined,
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
  refetchInterval = 1000
) => {
  return useQuery({
    queryKey: executionKeys.status(jobId || ''),
    queryFn: () => fetchExecutionStatus(jobId!),
    enabled: enabled && !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data;
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
export const invalidateExecutionQueries = (queryClient: ReturnType<typeof useQueryClient>, jobId?: string | null) => {
  if (jobId) {
    queryClient.invalidateQueries({ queryKey: executionKeys.status(jobId) });
    queryClient.invalidateQueries({ queryKey: executionKeys.detail(jobId) });
  } else {
    queryClient.invalidateQueries({ queryKey: executionKeys.all });
  }
};
