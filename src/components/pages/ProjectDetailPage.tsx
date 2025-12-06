import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Upload } from 'lucide-react';
import { useProjectDashboard } from '../../api/project';
import { submitCode } from '../../api/execution';
import { getJobExecutionPath, PATHS } from '../../constants/paths';
import SystemMetricsCard from '../whiteboard/SystemMetricsCard';
import JobListTable from '../whiteboard/JobListTable';
import ResourceHistoryChart from '../whiteboard/ResourceHistoryChart';
import JobStatusChart from '../whiteboard/JobStatusChart';
import LanguageStatsChart from '../whiteboard/LanguageStatsChart';
import { LanguageSelector } from '../common/LanguageSelector';
import { CodeEditor } from '../common/CodeEditor';
import { SubmitButton } from '../common/SubmitButton';

type TabType = 'upload' | 'history' | 'monitoring';

/**
 * 프로젝트 상세 페이지
 * - 탭1: 코드 업로드
 * - 탭2: 최근 실행 이력
 * - 탭3: 시스템 모니터링
 */
export function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('upload');

  // URL query parameter로 탭 설정
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'history' || tabParam === 'monitoring' || tabParam === 'upload') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // 코드 업로드 상태
  const [language, setLanguage] = useState<'python' | 'node' | 'java'>('python');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isError, error } = useProjectDashboard(projectId);

  const handleSubmit = async () => {
    if (!code.trim() || !projectId) {
      alert('코드를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { jobId } = await submitCode({ projectId, code, language });
      navigate(getJobExecutionPath(projectId, jobId));
    } catch (err) {
      console.error('Failed to submit code:', err);
      alert('코드 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJobClick = (jobId: string) => {
    if (projectId) {
      navigate(getJobExecutionPath(projectId, jobId));
    }
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner />
          <LoadingText>프로젝트 데이터를 불러오는 중...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>데이터를 불러올 수 없습니다</ErrorTitle>
          <ErrorMessage>{error instanceof Error ? error.message : '서버와의 연결을 확인해주세요.'}</ErrorMessage>
          <BackButton onClick={() => navigate(PATHS.MAIN)}>
            <ArrowLeft size={16} />
            프로젝트 목록으로
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Container>
      <Header>
        <HeaderTop>
          <BackLink onClick={() => navigate(PATHS.MAIN)}>
            <ArrowLeft size={20} />
            프로젝트 목록
          </BackLink>
        </HeaderTop>
        <HeaderTitle>
          <ProjectIcon>📁</ProjectIcon>
          {data.project.name}
        </HeaderTitle>
        {data.project.description && <HeaderSubtitle>{data.project.description}</HeaderSubtitle>}
      </Header>

      <TabContainer>
        <TabButton $isActive={activeTab === 'upload'} onClick={() => setActiveTab('upload')}>
          <Upload size={16} />
          코드 업로드
        </TabButton>
        <TabButton $isActive={activeTab === 'history'} onClick={() => setActiveTab('history')}>
          📋 실행 이력
        </TabButton>
        <TabButton $isActive={activeTab === 'monitoring'} onClick={() => setActiveTab('monitoring')}>
          📊 모니터링
        </TabButton>
      </TabContainer>

      <Content>
        {activeTab === 'upload' && (
          <UploadSection>
            <UploadCard>
              <UploadHeader>
                <UploadTitle>새 코드 실행</UploadTitle>
                <UploadDescription>코드를 작성하고 실행하면 결과를 실시간으로 확인할 수 있습니다</UploadDescription>
              </UploadHeader>

              <FormSection>
                <LanguageSelector
                  value={language}
                  onChange={(lang) => setLanguage(lang as 'python' | 'node' | 'java')}
                  disabled={isSubmitting}
                />

                <CodeEditor value={code} onChange={setCode} language={language} disabled={isSubmitting} />

                <SubmitButton onClick={handleSubmit} disabled={!code.trim()} isSubmitting={isSubmitting} />
              </FormSection>
            </UploadCard>
          </UploadSection>
        )}

        {activeTab === 'history' && <JobListTable jobs={data.recentJobs} onJobClick={handleJobClick} />}

        {activeTab === 'monitoring' && (
          <>
            <SystemMetricsCard metrics={data.systemMetrics} />
            <ChartsGrid>
              <ResourceHistoryChart data={data.resourceHistory} />
              <JobStatusChart data={data.jobStatusStats} />
              <LanguageStatsChart data={data.languageStats} />
            </ChartsGrid>
          </>
        )}
      </Content>
    </Container>
  );
}

/* Styles */
const Container = styled.section`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.color.baseColor1} 0%,
    ${(props) => props.theme.color.baseColor2} 100%
  );
  padding: 40px 20px;
`;

const Header = styled.header`
  max-width: 1400px;
  margin: 0 auto 32px;
`;

const HeaderTop = styled.div`
  margin-bottom: 16px;
`;

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${(props) => props.theme.color.baseColor6};
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.color.baseColor3};
    color: ${(props) => props.theme.color.white};
  }
`;

const HeaderTitle = styled.h1`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 800;
  color: ${(props) => props.theme.color.white};
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const ProjectIcon = styled.span`
  font-size: 36px;
`;

const HeaderSubtitle = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.color.baseColor6};
  margin: 0;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => (props.$isActive ? props.theme.color.green1 : props.theme.color.baseColor3)};
  color: ${(props) => (props.$isActive ? props.theme.color.white : props.theme.color.baseColor6)};
  box-shadow: ${(props) => (props.$isActive ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.2)')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    background: ${(props) => (props.$isActive ? props.theme.color.green1 : props.theme.color.baseColor4)};
  }

  &:active {
    transform: translateY(0);
  }
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
  min-height: 60vh;
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
  min-height: 60vh;
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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px 24px;
  background: ${(props) => props.theme.color.baseColor3};
  color: ${(props) => props.theme.color.white};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.color.baseColor4};
  }
`;

const UploadSection = styled.div`
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

const UploadCard = styled.div`
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border-radius: ${(props) => props.theme.borderRadius['2xl']};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  padding: 32px;
`;

const UploadHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const UploadTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.color.white};
  margin: 0 0 8px 0;
`;

const UploadDescription = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.color.baseColor6};
  margin: 0;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
`;

export default ProjectDetailPage;
