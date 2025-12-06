import { http, HttpResponse } from 'msw';
import type { WhiteboardData } from '../types/whiteboard';
import { JobStatus } from '../types/whiteboard';
import { BASE_URL } from '../constants/api';

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

export const handlers = [
  http.get(`${BASE_URL}/whiteboard`, () => {
    const mockData: WhiteboardData = {
      systemMetrics: {
        activeJobsCount: 5,
        cpuUsagePercent: 40 + Math.random() * 40,
        memoryUsagePercent: 30 + Math.random() * 40,
        totalJobsToday: 142,
        successRate: 94.4,
        lastUpdated: new Date().toISOString(),
      },
      recentJobs: [
        {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          status: JobStatus.RUNNING,
          language: 'Python',
          startedAt: new Date(Date.now() - 30000).toISOString(),
          duration: 30000,
        },
        {
          id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
          status: JobStatus.SUCCESS,
          language: 'JavaScript',
          startedAt: new Date(Date.now() - 120000).toISOString(),
          completedAt: new Date(Date.now() - 60000).toISOString(),
          duration: 60000,
        },
        {
          id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
          status: JobStatus.RUNNING,
          language: 'Java',
          startedAt: new Date(Date.now() - 45000).toISOString(),
          duration: 45000,
        },
        {
          id: 'd4e5f6a7-b8c9-0123-def1-234567890123',
          status: JobStatus.SUCCESS,
          language: 'Go',
          startedAt: new Date(Date.now() - 300000).toISOString(),
          completedAt: new Date(Date.now() - 270000).toISOString(),
          duration: 30000,
        },
        {
          id: 'e5f6a7b8-c9d0-1234-ef12-345678901234',
          status: JobStatus.FAILED,
          language: 'Python',
          startedAt: new Date(Date.now() - 180000).toISOString(),
          completedAt: new Date(Date.now() - 150000).toISOString(),
          duration: 30000,
        },
        {
          id: 'f6a7b8c9-d0e1-2345-f123-456789012345',
          status: JobStatus.QUEUED,
          language: 'Rust',
          startedAt: new Date(Date.now() - 5000).toISOString(),
        },
        {
          id: 'a7b8c9d0-e1f2-3456-1234-567890123456',
          status: JobStatus.SUCCESS,
          language: 'TypeScript',
          startedAt: new Date(Date.now() - 600000).toISOString(),
          completedAt: new Date(Date.now() - 540000).toISOString(),
          duration: 60000,
        },
        {
          id: 'b8c9d0e1-f2a3-4567-2345-678901234567',
          status: JobStatus.UPLOADING,
          language: 'C++',
          startedAt: new Date(Date.now() - 2000).toISOString(),
        },
        {
          id: 'c9d0e1f2-a3b4-5678-3456-789012345678',
          status: JobStatus.SUCCESS,
          language: 'Ruby',
          startedAt: new Date(Date.now() - 900000).toISOString(),
          completedAt: new Date(Date.now() - 870000).toISOString(),
          duration: 30000,
        },
        {
          id: 'd0e1f2a3-b4c5-6789-4567-890123456789',
          status: JobStatus.SUCCESS,
          language: 'PHP',
          startedAt: new Date(Date.now() - 1200000).toISOString(),
          completedAt: new Date(Date.now() - 1140000).toISOString(),
          duration: 60000,
        },
      ],
      resourceHistory: generateResourceHistory(),
      jobStatusStats: [
        { status: JobStatus.SUCCESS, count: 134 },
        { status: JobStatus.RUNNING, count: 5 },
        { status: JobStatus.FAILED, count: 8 },
        { status: JobStatus.QUEUED, count: 3 },
        { status: JobStatus.UPLOADING, count: 2 },
      ],
      languageStats: [
        { language: 'Python', count: 45 },
        { language: 'JavaScript', count: 38 },
        { language: 'TypeScript', count: 28 },
        { language: 'Java', count: 15 },
        { language: 'Go', count: 10 },
        { language: 'Rust', count: 6 },
      ],
    };

    return HttpResponse.json(mockData);
  }),
];
