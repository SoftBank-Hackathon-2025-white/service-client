import React from 'react';
import ReactECharts from 'echarts-for-react';
import styled from 'styled-components';
import type { JobStatusStats } from '../../types/whiteboard';
import { JobStatus } from '../../types/whiteboard';

interface JobStatusChartProps {
  data: JobStatusStats[];
}

const JobStatusChart: React.FC<JobStatusChartProps> = ({ data }) => {
  const getStatusColor = (status: JobStatus): string => {
    switch (status) {
      case JobStatus.SUCCESS:
        return '#10B981';
      case JobStatus.RUNNING:
        return '#3B82F6';
      case JobStatus.FAILED:
        return '#EF4444';
      case JobStatus.QUEUED:
        return '#F59E0B';
      case JobStatus.UPLOADING:
        return '#8B5CF6';
      default:
        return '#7F8799';
    }
  };

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: {
        color: '#fff',
      },
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: {
        color: '#B2B7C4',
      },
      formatter: (name: string) => {
        const item = data.find((d) => d.status === name);
        return `${name}: ${item?.count || 0}`;
      },
    },
    series: [
      {
        name: 'Job 상태',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#252B39',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#fff',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        labelLine: {
          show: false,
        },
        data: data.map((item) => ({
          value: item.count,
          name: item.status,
          itemStyle: {
            color: getStatusColor(item.status),
          },
        })),
      },
    ],
  };

  return (
    <ChartContainer>
      <ChartTitle>Job 상태 분포</ChartTitle>
      <ReactECharts option={option} style={{ height: '300px' }} />
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.color.white};
  margin: 0 0 16px 0;
`;

export default JobStatusChart;
