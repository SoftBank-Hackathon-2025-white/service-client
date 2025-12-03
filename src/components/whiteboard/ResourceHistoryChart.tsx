import React from 'react';
import ReactECharts from 'echarts-for-react';
import styled from 'styled-components';
import type { ResourceHistoryPoint } from '../../types/whiteboard';

interface ResourceHistoryChartProps {
  data: ResourceHistoryPoint[];
}

const ResourceHistoryChart: React.FC<ResourceHistoryChartProps> = ({
  data,
}) => {
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
          second: '2-digit',
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
        data: data.map((point) => point.cpuUsagePercent.toFixed(1)),
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
        data: data.map((point) => point.memoryUsagePercent.toFixed(1)),
      },
    ],
  };

  return (
    <ChartContainer>
      <ChartTitle>시스템 리소스 히스토리</ChartTitle>
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

export default ResourceHistoryChart;
