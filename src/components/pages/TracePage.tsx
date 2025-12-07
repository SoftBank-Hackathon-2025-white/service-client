import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ArrowLeft, Terminal } from 'lucide-react';
import { useExecutionStatus, useExecutionLog } from '../../api/execution';
import { getProjectPath } from '../../constants/paths';
import { UploadingStep } from '../pipeline/UploadingStep';
import { QueuedStep } from '../pipeline/QueuedStep';
import { RunningStep } from '../pipeline/RunningStep';
import { CompletedStep } from '../pipeline/CompletedStep';

/**
 * 実行トレース + 完了ページ統合
 * コード実行の各段階をリアルタイムで追跡し、
 * 成功時には下部に完了情報も一緒に表示
 */
export function TracePage() {
  const { projectId, jobId } = useParams();
  const navigate = useNavigate();

  // 実行状態照会（1秒ごとにポーリング）
  const { data: executionInfo, isLoading } = useExecutionStatus(jobId || null, true, 1000);

  // 実行完了時のみ、ログ照会
  const isCompleted = executionInfo?.status === 'Success' || executionInfo?.status === 'Failed';
  const { data: executionLog, isLoading: isLogLoading } = useExecutionLog(
    executionInfo?.logKey,
    isCompleted && !!executionInfo?.logKey
  );

  const handleBackToProject = () => {
    if (projectId) {
      navigate(getProjectPath(projectId));
    } else {
      navigate('/');
    }
  };

  const handleGoToHistory = () => {
    if (projectId) {
      navigate(`${getProjectPath(projectId)}?tab=history`);
    } else {
      navigate('/');
    }
  };

  if (isLoading || !executionInfo) {
    return (
      <Container>
        <LoadingWrapper>
          <Spinner />
          <LoadingText>実行情報を読み込み中...</LoadingText>
        </LoadingWrapper>
      </Container>
    );
  }

  const { status, progress } = executionInfo;

  const getStepStatus = (stepName: 'Uploading' | 'Queued' | 'Running' | 'Success') => {
    const statusOrder = ['Uploading', 'Queued', 'Running', 'Success'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepName);

    if (currentIndex > stepIndex) {
      return 'completed';
    }
    if (currentIndex === stepIndex) {
      return 'active';
    }
    return 'pending';
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'Uploading':
        return 'S3にコードをアップロード中です...';
      case 'Queued':
        return '実行キューで待機しています...';
      case 'Running':
        return 'ECSコンテナでコードを実行しています...';
      case 'Success':
        return 'コード実行が完了しました！';
      case 'Failed':
        return 'コード実行に失敗しました。';
      default:
        return '';
    }
  };

  const isFailed = status === 'Failed';
  const isSuccess = status === 'Success';

  return (
    <Container>
      <ContentWrapper>
        {/* ヘッダー領域: 戻る + Job ID */}
        <HeaderRow>
          <BackLink onClick={handleBackToProject}>
            <ArrowLeft size={20} />
            プロジェクトに戻る
          </BackLink>

          <JobIdHeader
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <StatusDot />
            <JobIdInfo>
              <JobIdLabel>Job ID</JobIdLabel>
              <JobIdCode>{jobId}</JobIdCode>
            </JobIdInfo>
          </JobIdHeader>
        </HeaderRow>

        {/* 失敗でない時: パイプライン/進捗率表示 */}
        {!isFailed && (
          <PipelineWrapper>
            {/* 進捗率 */}
            <ProgressCard>
              <ProgressHeader>
                <ProgressLabel>全体進捗率</ProgressLabel>
                <ProgressValue>{Math.round(progress)}%</ProgressValue>
              </ProgressHeader>
              <ProgressBarWrapper>
                <ProgressBar
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </ProgressBarWrapper>
            </ProgressCard>

            {/* ステータスメッセージ */}
            <StatusMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <StatusDotSmall />
              {getStatusMessage()}
            </StatusMessage>

            {/* パイプラインステップ */}
            <StepsWrapper>
              <UploadingStep status={getStepStatus('Uploading')} />
              <QueuedStep status={getStepStatus('Queued')} />
              <RunningStep status={getStepStatus('Running')} />
              <CompletedStep status={getStepStatus('Success')} />
            </StepsWrapper>
          </PipelineWrapper>
        )}

        {/* 実行失敗 */}
        {isFailed && (
          <ErrorCard initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <ErrorContent>
              <AlertCircle size={48} color="#ef4444" />
              <ErrorInfo>
                <ErrorTitle>実行失敗</ErrorTitle>
                <ErrorDescription>コード実行中にエラーが発生しました。</ErrorDescription>
              </ErrorInfo>
            </ErrorContent>

            {/* 失敗時のエラー出力 */}
            {executionInfo?.logKey && (
              <ErrorOutputSection>
                {isLogLoading ? (
                  <LogLoadingWrapper>
                    <LogSpinner />
                    <LogLoadingText>ログを読み込み中...</LogLoadingText>
                  </LogLoadingWrapper>
                ) : executionLog ? (
                  <>
                    {executionLog.stderr && (
                      <>
                        <OutputLabel $type="stderr">stderr</OutputLabel>
                        <OutputContent $type="stderr">{executionLog.stderr}</OutputContent>
                      </>
                    )}
                    {executionLog.stdout && (
                      <>
                        <OutputLabel $type="stdout">stdout</OutputLabel>
                        <OutputContent $type="stdout">{executionLog.stdout}</OutputContent>
                      </>
                    )}
                  </>
                ) : (
                  <LogErrorText>ログの読み込みに失敗しました</LogErrorText>
                )}
              </ErrorOutputSection>
            )}

            <ErrorActions>
              <BackButton onClick={handleBackToProject}>プロジェクトに戻る</BackButton>
            </ErrorActions>
          </ErrorCard>
        )}

        {/* 成功時: 完了ページの内容を下に表示 */}
        {isSuccess && (
          <SuccessSection initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SuccessHeader
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <SuccessIcon
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <CheckCircle2 size={56} color="white" />
              </SuccessIcon>

              <SuccessTitle>実行完了！</SuccessTitle>
              <SuccessSubtitle>コードが正常に実行されました</SuccessSubtitle>
            </SuccessHeader>

            {/* 実行結果出力カード */}
            {executionInfo?.logKey && (
              <ExecutionOutputCard
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <OutputCardHeader>
                  <Terminal size={20} />
                  <OutputCardTitle>実行ログ</OutputCardTitle>
                </OutputCardHeader>

                {isLogLoading ? (
                  <LogLoadingWrapper>
                    <LogSpinner />
                    <LogLoadingText>ログを読み込み中...</LogLoadingText>
                  </LogLoadingWrapper>
                ) : executionLog ? (
                  <OutputSection>
                    {executionLog.stdout && (
                      <>
                        <OutputLabel $type="stdout">stdout</OutputLabel>
                        <OutputContent $type="stdout">{executionLog.stdout}</OutputContent>
                      </>
                    )}
                    {executionLog.stderr && (
                      <>
                        <OutputLabel $type="stderr">stderr</OutputLabel>
                        <OutputContent $type="stderr">{executionLog.stderr}</OutputContent>
                      </>
                    )}
                  </OutputSection>
                ) : (
                  <LogErrorText>ログの読み込みに失敗しました</LogErrorText>
                )}
              </ExecutionOutputCard>
            )}

            {/* Job情報カード */}
            <InfoCard initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <InfoCardHeader>
                <SuccessStatusDot />
                <InfoCardTitle>Job情報</InfoCardTitle>
              </InfoCardHeader>
              <InfoList>
                <InfoItem>
                  <InfoLabel>Job ID</InfoLabel>
                  <InfoValue>{jobId}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>プロジェクト</InfoLabel>
                  <InfoValue>{executionInfo?.projectId || projectId}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>ステータス</InfoLabel>
                  <StatusBadge>成功</StatusBadge>
                </InfoItem>
                {executionInfo?.logKey && (
                  <InfoItem>
                    <InfoLabel>ログキー</InfoLabel>
                    <InfoValue>{executionInfo.logKey}</InfoValue>
                  </InfoItem>
                )}
                {executionInfo?.createdAt && (
                  <InfoItem>
                    <InfoLabel>作成時間</InfoLabel>
                    <InfoText>{new Date(executionInfo.createdAt).toLocaleString('ja-JP')}</InfoText>
                  </InfoItem>
                )}
                {executionInfo?.startedAt && (
                  <InfoItem>
                    <InfoLabel>開始時間</InfoLabel>
                    <InfoText>{new Date(executionInfo.startedAt).toLocaleString('ja-JP')}</InfoText>
                  </InfoItem>
                )}
                {executionInfo?.completedAt && (
                  <InfoItem>
                    <InfoLabel>完了時間</InfoLabel>
                    <InfoText>{new Date(executionInfo.completedAt).toLocaleString('ja-JP')}</InfoText>
                  </InfoItem>
                )}
                {executionInfo?.timeoutMs && (
                  <InfoItem>
                    <InfoLabel>タイムアウト</InfoLabel>
                    <InfoText>{(executionInfo.timeoutMs / 1000).toFixed(0)}秒</InfoText>
                  </InfoItem>
                )}
              </InfoList>
            </InfoCard>

            {/* アクションボタン */}
            <ActionButtons initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <ActionButton onClick={handleGoToHistory}>実行履歴を見る</ActionButton>
            </ActionButtons>

            {/* フッターメッセージ */}
            <FooterMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              🌊 Lambda the Sea - クリーンで透明なServerless実行完了
            </FooterMessage>
          </SuccessSection>
        )}

        {/* 透明性メッセージ（失敗を除く全体） */}
        {!isFailed && (
          <InfoMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            🌊 <strong>Pure & Transparent:</strong>
            すべての実行プロセスが透明に公開されます。
          </InfoMessage>
        )}
      </ContentWrapper>
    </Container>
  );
}

/* ---------------- 共通スタイル ---------------- */

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.color.baseColor1} 0%,
    ${(props) => props.theme.color.baseColor2} 100%
  );
  padding: 40px 20px;
`;

const ContentWrapper = styled.div`
  max-width: 80rem;
  margin: 0 auto;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.xl};
  flex-wrap: wrap;
  gap: 16px;
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

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: ${(props) => props.theme.spacing.md};
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${(props) => props.theme.color.border2};
  border-top-color: ${(props) => props.theme.color.primary};
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

const JobIdHeader = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.lg};
  border-radius: ${(props) => props.theme.borderRadius['2xl']};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  box-shadow: ${(props) => props.theme.shadow.sm};
`;

const StatusDot = styled.div`
  width: 12px;
  height: 12px;
  background: ${(props) => props.theme.color.green1};
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const JobIdInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const JobIdLabel = styled.p`
  font-size: ${(props) => props.theme.fontSize.xs};
  color: ${(props) => props.theme.color.baseColor6};
`;

const JobIdCode = styled.code`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.white};
  font-family: monospace;
`;

const PipelineWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.xl};
`;

const ProgressCard = styled.div`
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border-radius: ${(props) => props.theme.borderRadius['2xl']};
  padding: ${(props) => props.theme.spacing.lg};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  box-shadow: ${(props) => props.theme.shadow.sm};
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ProgressLabel = styled.span`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.baseColor6};
`;

const ProgressValue = styled.span`
  font-size: ${(props) => props.theme.fontSize.base};
  font-weight: 600;
  color: ${(props) => props.theme.color.white};
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 12px;
  background: ${(props) => props.theme.color.baseColor3};
  border-radius: ${(props) => props.theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressBar = styled(motion.div)`
  height: 100%;
  background: linear-gradient(to right, ${(props) => props.theme.color.green1}, ${(props) => props.theme.color.green2});
`;

const StatusMessage = styled(motion.div)`
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  padding: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.color.green1};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const StatusDotSmall = styled.div`
  width: 8px;
  height: 8px;
  background: ${(props) => props.theme.color.green1};
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
`;

const StepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.md};
`;

const ErrorCard = styled(motion.div)`
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border: 2px solid ${(props) => props.theme.color.statusFailed};
  border-radius: ${(props) => props.theme.borderRadius['2xl']};
  padding: ${(props) => props.theme.spacing.xl};
`;

const ErrorContent = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
  align-items: flex-start;
`;

const ErrorInfo = styled.div`
  flex: 1;
`;

const ErrorTitle = styled.h2`
  font-size: ${(props) => props.theme.fontSize['2xl']};
  font-weight: 700;
  color: ${(props) => props.theme.color.statusFailed};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const ErrorDescription = styled.p`
  color: ${(props) => props.theme.color.baseColor6};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const ErrorActions = styled.div`
  margin-top: ${(props) => props.theme.spacing.lg};
  text-align: center;
`;

const BackButton = styled.button`
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.color.statusFailed};
  color: white;
  border-radius: ${(props) => props.theme.borderRadius.xl};
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const ErrorOutputSection = styled.div`
  margin-top: ${(props) => props.theme.spacing.lg};
  padding-top: ${(props) => props.theme.spacing.lg};
  border-top: 1px solid ${(props) => props.theme.color.statusFailed}40;
`;

const InfoMessage = styled(motion.div)`
  margin-top: ${(props) => props.theme.spacing.xl};
  padding: ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border-radius: ${(props) => props.theme.borderRadius.xl};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  box-shadow: ${(props) => props.theme.shadow.sm};
  text-align: center;
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.baseColor6};

  strong {
    color: ${(props) => props.theme.color.green1};
  }
`;

/* ---------------- 成功セクションスタイル ---------------- */

const SuccessSection = styled(motion.div)`
  margin-top: ${(props) => props.theme.spacing.xl};
`;

const SuccessHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const SuccessIcon = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.color.green1},
    ${(props) => props.theme.color.greenDeep}
  );
  border-radius: 50%;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  box-shadow: 0 20px 40px -10px rgba(134, 195, 187, 0.3);
`;

const SuccessTitle = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${(props) => props.theme.color.white};
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const SuccessSubtitle = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.color.baseColor6};
  margin: 0;
`;

const InfoCard = styled(motion.div)`
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border-radius: ${(props) => props.theme.borderRadius['2xl']};
  padding: ${(props) => props.theme.spacing.lg};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  box-shadow: ${(props) => props.theme.shadow.sm};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const InfoCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const SuccessStatusDot = styled.div`
  width: 12px;
  height: 12px;
  background: ${(props) => props.theme.color.green1};
  border-radius: 50%;
`;

const InfoCardTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: 600;
  color: ${(props) => props.theme.color.white};
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.sm};
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${(props) => props.theme.spacing.sm} 0;
  border-bottom: 1px solid ${(props) => props.theme.color.border1};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.baseColor6};
`;

const InfoValue = styled.code`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.white};
  background: ${(props) => props.theme.color.baseColor3};
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-family: monospace;
`;

const StatusBadge = styled.span`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.baseColor1};
  background: ${(props) => props.theme.color.green1};
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-weight: 500;
`;

const InfoText = styled.span`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.white};
`;

const ActionButtons = styled(motion.div)`
  display: flex;
  gap: ${(props) => props.theme.spacing.sm};
  justify-content: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.lg} ${(props) => props.theme.spacing.xl};
  min-width: 200px;
  background: linear-gradient(135deg, ${(props) => props.theme.color.green1}, ${(props) => props.theme.color.green2});
  color: ${(props) => props.theme.color.baseColor1};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  font-weight: 700;
  font-size: ${(props) => props.theme.fontSize.xl};
  box-shadow: ${(props) => props.theme.shadow.md};
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadow.lg};
    opacity: 0.9;
  }
`;

const FooterMessage = styled(motion.div)`
  margin-top: ${(props) => props.theme.spacing.lg};
  text-align: center;
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.baseColor6};
`;

/* ---------------- 実行結果出力スタイル ---------------- */

const ExecutionOutputCard = styled(motion.div)`
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border-radius: ${(props) => props.theme.borderRadius['2xl']};
  padding: ${(props) => props.theme.spacing.lg};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  box-shadow: ${(props) => props.theme.shadow.sm};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const OutputCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.color.green1};
`;

const OutputCardTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: 600;
  color: ${(props) => props.theme.color.white};
`;

const OutputSection = styled.div`
  margin-bottom: ${(props) => props.theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

const OutputLabel = styled.div<{ $type: 'stdout' | 'stderr' }>`
  display: inline-block;
  font-size: ${(props) => props.theme.fontSize.xs};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.md};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  background: ${(props) => (props.$type === 'stdout' ? props.theme.color.green1 : props.theme.color.statusFailed)};
  color: ${(props) => props.theme.color.baseColor1};
`;

const OutputContent = styled.pre<{ $type: 'stdout' | 'stderr' }>`
  background: ${(props) => props.theme.color.baseColor1};
  border: 1px solid
    ${(props) => (props.$type === 'stdout' ? props.theme.color.green1 + '40' : props.theme.color.statusFailed + '40')};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  padding: ${(props) => props.theme.spacing.md};
  font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => (props.$type === 'stdout' ? props.theme.color.green1 : props.theme.color.statusFailed)};
  white-space: pre-wrap;
  word-break: break-all;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
  line-height: 1.6;
  margin: 0;

  /* スクロールバースタイル */
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.color.baseColor2};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.color.baseColor4};
    border-radius: 4px;

    &:hover {
      background: ${(props) => props.theme.color.baseColor5};
    }
  }
`;

/* ---------------- ログ読み込みスタイル ---------------- */

const LogLoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${(props) => props.theme.spacing.xl};
  gap: ${(props) => props.theme.spacing.md};
`;

const LogSpinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid ${(props) => props.theme.color.baseColor3};
  border-top-color: ${(props) => props.theme.color.green1};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LogLoadingText = styled.p`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.baseColor6};
`;

const LogErrorText = styled.p`
  padding: ${(props) => props.theme.spacing.md};
  text-align: center;
  color: ${(props) => props.theme.color.statusFailed};
  font-size: ${(props) => props.theme.fontSize.sm};
`;
