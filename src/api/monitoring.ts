import { useQuery } from '@tanstack/react-query';
import client from './_client';
import { API_ENDPOINTS, CLUSTER_NAME } from '../constants/api';
import type { CloudWatchResponse } from '../types/whiteboard';

/**
 * Query Keys
 */
export const monitoringKeys = {
  all: ['monitoring'] as const,
  cloudwatch: (clusterName: string) => ['monitoring', 'cloudwatch', clusterName] as const,
};

/**
 * CloudWatch 메트릭 조회 API
 * GET /api/cloudwatch/{clusterName}
 */
const fetchCloudWatchMetrics = async (clusterName: string): Promise<CloudWatchResponse> => {
  const response = await client.get(API_ENDPOINTS.CLOUDWATCH(clusterName));
  return response.data as CloudWatchResponse;
};

/**
 * CloudWatch 메트릭 조회 React Query Hook
 */
export const useCloudWatchMetrics = (enabled = true, refetchInterval = 30000) => {
  return useQuery({
    queryKey: monitoringKeys.cloudwatch(CLUSTER_NAME),
    queryFn: () => fetchCloudWatchMetrics(CLUSTER_NAME),
    enabled,
    refetchInterval,
    staleTime: 10000,
  });
};
