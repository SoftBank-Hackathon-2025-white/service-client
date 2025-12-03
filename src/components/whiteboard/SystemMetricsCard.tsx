import styled from 'styled-components';
import React from 'react';
import type { SystemMetrics } from '../../types/whiteboard';
import ProgressBar from '../common/ProgressBar';

interface SystemMetricsCardProps {
  metrics: SystemMetrics;
}

const SystemMetricsCard: React.FC<SystemMetricsCardProps> = ({ metrics }) => {
  return (
    <Card>
      <CardHeader>
        <Title>시스템 현황</Title>
        <LastUpdated>
          마지막 업데이트: {new Date(metrics.lastUpdated).toLocaleTimeString()}
        </LastUpdated>
      </CardHeader>

      <MetricsGrid>
        <MetricItem>
          <MetricLabel>활성 Job</MetricLabel>
          <MetricValue $highlight>{metrics.activeJobsCount}</MetricValue>
          <MetricUnit>개</MetricUnit>
        </MetricItem>

        <MetricItem>
          <MetricLabel>오늘 총 실행</MetricLabel>
          <MetricValue>{metrics.totalJobsToday}</MetricValue>
          <MetricUnit>개</MetricUnit>
        </MetricItem>

        <MetricItem>
          <MetricLabel>성공률</MetricLabel>
          <MetricValue $success>{metrics.successRate.toFixed(1)}</MetricValue>
          <MetricUnit>%</MetricUnit>
        </MetricItem>
      </MetricsGrid>

      <ProgressSection>
        <ProgressBar
          percentage={metrics.cpuUsagePercent}
          label="CPU 사용률"
          color={`linear-gradient(90deg, #3B82F6, #1D4ED8)`}
        />
        <ProgressBar
          percentage={metrics.memoryUsagePercent}
          label="메모리 사용률"
          color={`linear-gradient(90deg, #8B5CF6, #6D28D9)`}
        />
      </ProgressSection>
    </Card>
  );
};

const Card = styled.div`
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.color.white};
  margin: 0;
`;

const LastUpdated = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.color.baseColor6};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: ${(props) => props.theme.color.baseColor2};
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) => props.theme.color.baseColor3};
  }
`;

const MetricLabel = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.color.baseColor6};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetricValue = styled.span<{ $highlight?: boolean; $success?: boolean }>`
  font-size: 32px;
  font-weight: 700;
  color: ${({ theme, $highlight, $success }) => {
    if ($highlight) return theme.color.statusRunning;
    if ($success) return theme.color.statusSuccess;
    return theme.color.white;
  }};
  line-height: 1;
`;

const MetricUnit = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.color.baseColor7};
  margin-top: 4px;
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default SystemMetricsCard;
