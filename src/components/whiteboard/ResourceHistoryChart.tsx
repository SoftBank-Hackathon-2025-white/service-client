import React from 'react';
import ReactECharts from 'echarts-for-react';
import styled from 'styled-components';
import type { CloudWatchMetric } from '../../types/whiteboard';

interface ResourceHistoryChartProps {
  data: CloudWatchMetric[];
  clusterName?: string;
}

const ResourceHistoryChart: React.FC<ResourceHistoryChartProps> = ({ data, clusterName }) => {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#333',
      textStyle: {
        color: '#fff',
      },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['CPU 사용률', '메모리 사용률'],
      textStyle: {
        color: '#B2B7C4',
      },
      top: 10,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map((point) => {
        const date = new Date(point.timestamp);
        return date.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }),
      axisLine: {
        lineStyle: {
          color: '#495264',
        },
      },
      axisLabel: {
        color: '#7F8799',
        fontSize: 11,
      },
    },
    yAxis: {
      type: 'value',
      max: 100,
      axisLine: {
        lineStyle: {
          color: '#495264',
        },
      },
      axisLabel: {
        color: '#7F8799',
        formatter: '{value}%',
      },
      splitLine: {
        lineStyle: {
          color: '#353C4D',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: 'CPU 사용률',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#3B82F6' },
              { offset: 1, color: '#1D4ED8' },
            ],
          },
        },
        itemStyle: {
          color: '#3B82F6',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
            ],
          },
        },
        data: data.map((point) => point.cpu_utilization.toFixed(1)),
      },
      {
        name: '메모리 사용률',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#8B5CF6' },
              { offset: 1, color: '#6D28D9' },
            ],
          },
        },
        itemStyle: {
          color: '#8B5CF6',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(139, 92, 246, 0.3)' },
              { offset: 1, color: 'rgba(139, 92, 246, 0.05)' },
            ],
          },
        },
        data: data.map((point) => point.memory_utilization.toFixed(1)),
      },
    ],
  };

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>CloudWatch 메트릭</ChartTitle>
        {clusterName && <ClusterBadge>{clusterName}</ClusterBadge>}
      </ChartHeader>
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

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ChartTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.color.white};
  margin: 0;
`;

const ClusterBadge = styled.span`
  background: ${(props) => props.theme.color.baseColor3};
  color: ${(props) => props.theme.color.green1};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

export default ResourceHistoryChart;
