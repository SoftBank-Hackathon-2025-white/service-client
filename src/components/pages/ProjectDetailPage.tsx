import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Upload } from 'lucide-react';
import { useProjects } from '../../api/project';
import { submitCode, useProjectJobs } from '../../api/execution';
import { useCloudWatchMetrics } from '../../api/monitoring';
import { getJobExecutionPath, PATHS } from '../../constants/paths';
import JobListTable from '../whiteboard/JobListTable';
import ResourceHistoryChart from '../whiteboard/ResourceHistoryChart';
import { LanguageSelector } from '../common/LanguageSelector';
import { CodeEditor } from '../common/CodeEditor';
import { SubmitButton } from '../common/SubmitButton';
import { FormInput } from '../common/FormInput';

type TabType = 'upload' | 'history' | 'monitoring';

/**
 * プロジェクト詳細ページ
 * - タブ1: コードアップロード
 * - タブ2: 最近の実行履歴
 * - タブ3: システムモニタリング
 */
export function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('upload');

  // URLクエリパラメータでタブ設定
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'history' || tabParam === 'monitoring' || tabParam === 'upload') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // コードアップロード状態
  const [language, setLanguage] = useState<'python' | 'node' | 'java'>('python');
  const [code, setCode] = useState('');
  const [functionName, setFunctionName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: projectsData, isLoading, isError, error } = useProjects();
  const { data: jobsData, isLoading: isJobsLoading } = useProjectJobs(projectId, activeTab === 'history');
  const { data: cloudWatchData, isLoading: isCloudWatchLoading } = useCloudWatchMetrics(activeTab === 'monitoring');

  // プロジェクトリストから現在のプロジェクトを検索
  const project = useMemo(() => {
    if (!projectsData || !projectId) {
      return null;
    }
    return projectsData.find((p) => p.project_id === Number(projectId)) || null;
  }, [projectsData, projectId]);

  const handleSubmit = async () => {
    if (!code.trim() || !projectId) {
      alert('コードを入力してください。');
      return;
    }

    if (!functionName.trim()) {
      alert('関数名を入力してください。');
      return;
    }

    if (!description.trim()) {
      alert('説明を入力してください。');
      return;
    }

    setIsSubmitting(true);

    try {
      const jobMetadata = await submitCode({
        code,
        description,
        function_name: functionName,
        language,
        project: projectId,
      });
      navigate(getJobExecutionPath(projectId, jobMetadata.job_id));
    } catch (err) {
      console.error('Failed to submit code:', err);
      alert('コードの送信に失敗しました。もう一度お試しください。');
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
          <LoadingText>プロジェクトデータを読み込み中...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>プロジェクト情報を読み込めません</ErrorTitle>
          <ErrorMessage>{error instanceof Error ? error.message : 'サーバーとの接続を確認してください。'}</ErrorMessage>
          <BackButton onClick={() => navigate(PATHS.MAIN)}>
            <ArrowLeft size={16} />
            プロジェクト一覧へ
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }

  if (!project) {
    if (!isLoading) {
      return (
        <Container>
          <ErrorContainer>
            <ErrorIcon>🔍</ErrorIcon>
            <ErrorTitle>プロジェクトが見つかりません</ErrorTitle>
            <ErrorMessage>お探しのプロジェクトは存在しないか、削除されました。</ErrorMessage>
            <BackButton onClick={() => navigate(PATHS.MAIN)}>
              <ArrowLeft size={16} />
              プロジェクト一覧へ
            </BackButton>
          </ErrorContainer>
        </Container>
      );
    }
    return null;
  }

  return (
    <Container>
      <Header>
        <HeaderTop>
          <BackLink onClick={() => navigate(PATHS.MAIN)}>
            <ArrowLeft size={20} />
            プロジェクト一覧
          </BackLink>
        </HeaderTop>
        <HeaderTitle>
          <ProjectIcon>📁</ProjectIcon>
          {project.project}
        </HeaderTitle>
      </Header>

      <TabContainer>
        <TabButton $isActive={activeTab === 'upload'} onClick={() => setActiveTab('upload')}>
          <Upload size={16} />
          コードアップロード
        </TabButton>
        <TabButton $isActive={activeTab === 'history'} onClick={() => setActiveTab('history')}>
          📋 実行履歴
        </TabButton>
        <TabButton $isActive={activeTab === 'monitoring'} onClick={() => setActiveTab('monitoring')}>
          📊 モニタリング
        </TabButton>
      </TabContainer>

      <Content>
        {activeTab === 'upload' && (
          <UploadSection>
            <UploadCard>
              <UploadHeader>
                <UploadTitle>新規コード実行</UploadTitle>
                <UploadDescription>コードを作成して実行すると、結果をリアルタイムで確認できます</UploadDescription>
              </UploadHeader>

              <FormSection>
                <FormInput
                  label="関数名"
                  value={functionName}
                  onChange={setFunctionName}
                  placeholder="my_function"
                  disabled={isSubmitting}
                  required
                />

                <FormInput
                  label="説明"
                  value={description}
                  onChange={setDescription}
                  placeholder="この関数が実行する作業を説明してください"
                  disabled={isSubmitting}
                  required
                />

                <LanguageSelector
                  value={language}
                  onChange={(lang) => {
                    setLanguage(lang as 'python' | 'node' | 'java');
                  }}
                  disabled={isSubmitting}
                />

                <CodeEditor value={code} onChange={setCode} language={language} disabled={isSubmitting} />

                <SubmitButton
                  onClick={handleSubmit}
                  disabled={!code.trim() || !functionName.trim() || !description.trim()}
                  isSubmitting={isSubmitting}
                />
              </FormSection>
            </UploadCard>
          </UploadSection>
        )}

        {activeTab === 'history' &&
          (isJobsLoading ? (
            <LoadingContainer>
              <Spinner />
              <LoadingText>実行履歴を読み込み中...</LoadingText>
            </LoadingContainer>
          ) : (
            <JobListTable jobs={jobsData || []} onJobClick={handleJobClick} />
          ))}

        {activeTab === 'monitoring' &&
          (isCloudWatchLoading ? (
            <LoadingContainer>
              <Spinner />
              <LoadingText>モニタリングデータを読み込み中...</LoadingText>
            </LoadingContainer>
          ) : cloudWatchData ? (
            <MonitoringSection>
              <MonitoringHeader>
                <MonitoringTitle>クラスターモニタリング</MonitoringTitle>
                <ClusterInfo>
                  <ClusterLabel>クラスター:</ClusterLabel>
                  <ClusterName>{cloudWatchData.cluster_name}</ClusterName>
                </ClusterInfo>
              </MonitoringHeader>
              <MetricsSummary>
                <MetricCard>
                  <MetricIcon>💻</MetricIcon>
                  <MetricContent>
                    <MetricLabel>現在のCPU使用率</MetricLabel>
                    <MetricValue $color="#3B82F6">
                      {cloudWatchData.metrics.length > 0
                        ? (cloudWatchData.metrics.at(-1)?.cpu_utilization ?? 0).toFixed(1)
                        : 0}
                      %
                    </MetricValue>
                  </MetricContent>
                </MetricCard>
                <MetricCard>
                  <MetricIcon>🧠</MetricIcon>
                  <MetricContent>
                    <MetricLabel>現在のメモリ使用率</MetricLabel>
                    <MetricValue $color="#8B5CF6">
                      {cloudWatchData.metrics.length > 0
                        ? (cloudWatchData.metrics.at(-1)?.memory_utilization ?? 0).toFixed(1)
                        : 0}
                      %
                    </MetricValue>
                  </MetricContent>
                </MetricCard>
              </MetricsSummary>
              <ResourceHistoryChart data={cloudWatchData.metrics} clusterName={cloudWatchData.cluster_name} />
            </MonitoringSection>
          ) : (
            <EmptyState>モニタリングデータがありません。</EmptyState>
          ))}
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

const MonitoringSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const MonitoringHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const MonitoringTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.color.white};
  margin: 0;
`;

const ClusterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${(props) => props.theme.color.cardBackground};
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.color.cardBorder};
`;

const ClusterLabel = styled.span`
  font-size: 14px;
  color: ${(props) => props.theme.color.baseColor6};
`;

const ClusterName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.color.green1};
`;

const MetricsSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
`;

const MetricCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  border-radius: 16px;
  padding: 20px 24px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const MetricIcon = styled.div`
  font-size: 32px;
`;

const MetricContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetricLabel = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.color.baseColor6};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetricValue = styled.span<{ $color: string }>`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.$color};
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: ${(props) => props.theme.color.cardBackground};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  border-radius: 16px;
  color: ${(props) => props.theme.color.baseColor6};
  font-size: 16px;
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
