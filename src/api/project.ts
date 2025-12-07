import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from './_client';
import { API_ENDPOINTS } from '../constants/api';
import type { Project, ProjectListResponse } from '../types/project';

/**
 * 프로젝트 생성 요청 타입
 */
export type CreateProjectRequest = {
  project_name: string;
};

/**
 * Query Keys
 */
export const projectKeys = {
  all: ['projects'] as const,
  list: () => [...projectKeys.all, 'list'] as const,
  detail: (projectId: string) => [...projectKeys.all, 'detail', projectId] as const,
};

/**
 * 프로젝트 목록 조회
 */
export const fetchProjects = async (): Promise<ProjectListResponse> => {
  const response = await client.get<ProjectListResponse>(API_ENDPOINTS.PROJECTS);
  return response.data;
};

/**
 * 프로젝트 목록 React Query Hook
 */
export const useProjects = () => {
  return useQuery({
    queryKey: projectKeys.list(),
    queryFn: fetchProjects,
  });
};

/**
 * 프로젝트 생성
 */
export const createProject = async (request: CreateProjectRequest): Promise<Project> => {
  const response = await client.post<Project>(API_ENDPOINTS.PROJECT_CREATE + '?project_name=' + request.project_name);
  return response.data;
};

/**
 * 프로젝트 생성 React Query Mutation Hook
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      // 프로젝트 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: projectKeys.list() });
    },
  });
};
