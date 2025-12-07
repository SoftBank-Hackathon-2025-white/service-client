import React from 'react';
import ReactECharts from 'echarts-for-react';
import styled from 'styled-components';
import type { LanguageStats } from '../../types/whiteboard';

interface LanguageStatsChartProps {
  data: LanguageStats[];
}

const LanguageStatsChart: React.FC<LanguageStatsChartProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.count - a.count);

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
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#495264',
        },
      },
      axisLabel: {
        color: '#7F8799',
      },
      splitLine: {
        lineStyle: {
          color: '#353C4D',
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: sortedData.map((item) => item.language),
      axisLine: {
        lineStyle: {
          color: '#495264',
        },
      },
      axisLabel: {
        color: '#B2B7C4',
        fontSize: 12,
      },
    },
    series: [
      {
        name: '実行回数',
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: '#86C3BB' },
              { offset: 1, color: '#437376' },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#B5E9E2' },
                { offset: 1, color: '#86C3BB' },
              ],
            },
          },
        },
        label: {
          show: true,
          position: 'right',
          color: '#B2B7C4',
          fontSize: 12,
          fontWeight: 'bold',
        },
        data: sortedData.map((item) => item.count),
      },
    ],
  };

  return (
    <ChartContainer>
      <ChartTitle>言語別使用統計</ChartTitle>
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

export default LanguageStatsChart;
