import { useQuery } from '@tanstack/react-query';
import client from './_client';
import type { WhiteboardData } from '../types/whiteboard';

export const fetchWhiteboardData = async (): Promise<WhiteboardData> => {
  const response = await client.get<WhiteboardData>('/whiteboard');
  return response.data;
};

export const useWhiteboardData = () => {
  return useQuery({
    queryKey: ['whiteboard'],
    queryFn: fetchWhiteboardData,
    refetchInterval: 3000,
    staleTime: 2000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
