import styled from 'styled-components';
import React from 'react';
import { useWhiteboardData } from '../../api/whiteboard';
import SystemMetricsCard from '../whiteboard/SystemMetricsCard';
import JobListTable from '../whiteboard/JobListTable';
import ResourceHistoryChart from '../whiteboard/ResourceHistoryChart';
import JobStatusChart from '../whiteboard/JobStatusChart';
import LanguageStatsChart from '../whiteboard/LanguageStatsChart';

const Whiteboard: React.FC = () => {
  const { data, isLoading, isError, error } = useWhiteboardData();

  if (isLoading) {
    return (
      <WhiteboardWrapper>
        <LoadingContainer>
          <Spinner />
          <LoadingText>시스템 데이터를 불러오는 중...</LoadingText>
        </LoadingContainer>
      </WhiteboardWrapper>
    );
  }

  if (isError) {
    return (
      <WhiteboardWrapper>
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>데이터를 불러올 수 없습니다</ErrorTitle>
          <ErrorMessage>
            {error instanceof Error
              ? error.message
              : '서버와의 연결을 확인해주세요.'}
          </ErrorMessage>
        </ErrorContainer>
      </WhiteboardWrapper>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <WhiteboardWrapper>
      <Header>
        <HeaderTitle>❄️ Snowflake Whiteboard</HeaderTitle>
        <HeaderSubtitle>전체 시스템 관제 대시보드</HeaderSubtitle>
      </Header>

      <Content>
        <SystemMetricsCard metrics={data.systemMetrics} />

        <ChartsGrid>
          <ResourceHistoryChart data={data.resourceHistory} />
          <JobStatusChart data={data.jobStatusStats} />
          <LanguageStatsChart data={data.languageStats} />
        </ChartsGrid>

        <JobListTable jobs={data.recentJobs} />
      </Content>
    </WhiteboardWrapper>
  );
};

const WhiteboardWrapper = styled.section`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.color.baseColor1} 0%,
    ${(props) => props.theme.color.baseColor2} 100%
  );
  padding: 40px 20px;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
`;

const HeaderTitle = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${(props) => props.theme.color.white};
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const HeaderSubtitle = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.color.baseColor6};
  margin: 0;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${(props) => props.theme.color.baseColor3};
  border-top-color: ${(props) => props.theme.color.green1};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.color.baseColor6};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  padding: 40px;
`;

const ErrorIcon = styled.div`
  font-size: 64px;
`;

const ErrorTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.color.statusFailed};
  margin: 0;
`;

const ErrorMessage = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.color.baseColor6};
  text-align: center;
  max-width: 500px;
  margin: 0;
`;

export default Whiteboard;
