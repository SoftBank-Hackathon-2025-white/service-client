import { useQuery } from '@tanstack/react-query';
import { ExampleRequest, ExampleResponse } from '../types/api';
import client from './_client';

/**
 * 예시 코드 (axios를 이용한 GET & useQuery를 이용한 GET)
 */
export const getExample = async (): Promise<ExampleResponse> => {
  return await client.get('/example').then((res) => res.data);
};
export const useGetExample = () => {
  return useQuery<ExampleResponse>({ queryKey: ['example'], queryFn: getExample });
};

// useMutate는 사용하기 좀 까다로워서 저는 보통 axios 그대로 씁니다만, 사용하실 분들은 useMutation을 사용해도 무방합니다.
export const postExample = async (data: ExampleRequest): Promise<ExampleResponse> => {
  return await client.post('/example', data).then((res) => res.data);
};
