import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components'; 
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useExecutionStatus } from '../../api/execution';
import { PATHS } from '../../constants/paths';
import { UploadingStep } from '../pipeline/UploadingStep';
import { QueuedStep } from '../pipeline/QueuedStep';
import { RunningStep } from '../pipeline/RunningStep';
import { CompletedStep } from '../pipeline/CompletedStep';

/**
 * 실행 추적 + 완료 페이지 통합
 * 코드 실행의 각 단계를 실시간으로 추적하고,
 * 성공 시에는 하단에 완료 정보도 함께 표시
 */
export function TracePage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  
  // 실행 상태 조회 (1초마다 폴링)
  const { data: executionInfo, isLoading } = useExecutionStatus(jobId || null, true, 1000);

  if (isLoading || !executionInfo) {
    return (
      <Container>
        <LoadingWrapper>
          <Spinner />
          <LoadingText>실행 정보를 불러오는 중...</LoadingText>
        </LoadingWrapper>
      </Container>
    );
  }

  const { status, progress } = executionInfo;

  const getStepStatus = (stepName: 'Uploading' | 'Queued' | 'Running' | 'Success') => {
    const statusOrder = ['Uploading', 'Queued', 'Running', 'Success'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepName);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'Uploading':
        return 'S3에 코드를 업로드하는 중입니다...';
      case 'Queued':
        return '실행 대기열에서 대기하고 있습니다...';
      case 'Running':
        return 'ECS 컨테이너에서 코드를 실행하고 있습니다...';
      case 'Success':
        return '코드 실행이 완료되었습니다!';
      case 'Failed':
        return '코드 실행에 실패했습니다.';
      default:
        return '';
    }
  };

  const isFailed = status === 'Failed';
  const isSuccess = status === 'Success';

  return (
    <Container>
      <ContentWrapper>
        {/* Job ID 헤더 */}
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

        {/* 실패가 아닐 때: 파이프라인/진행률 표시 */}
        {!isFailed && (
          <PipelineWrapper>
            {/* 진행률 */}
            <ProgressCard>
              <ProgressHeader>
                <ProgressLabel>전체 진행률</ProgressLabel>
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

            {/* 상태 메시지 */}
            <StatusMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <StatusDotSmall />
              {getStatusMessage()}
            </StatusMessage>

            {/* 파이프라인 단계들 */}
            <StepsWrapper>
              <UploadingStep status={getStepStatus('Uploading')} />
              <QueuedStep status={getStepStatus('Queued')} />
              <RunningStep status={getStepStatus('Running')} />
              <CompletedStep status={getStepStatus('Success')} />
            </StepsWrapper>
          </PipelineWrapper>
        )}

        {/* 실행 실패 */}
        {isFailed && (
          <ErrorCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ErrorContent>
              <AlertCircle size={48} color="#ef4444" />
              <ErrorInfo>
                <ErrorTitle>실행 실패</ErrorTitle>
                <ErrorDescription>
                  코드 실행 중 오류가 발생했습니다.
                </ErrorDescription>
              </ErrorInfo>
            </ErrorContent>
            
            <ErrorActions>
              <BackButton onClick={() => navigate('/')}>
                처음으로 돌아가기
              </BackButton>
            </ErrorActions>
          </ErrorCard>
        )}

        {/* 성공 시: CompletePage 내용 아래에 표시 */}
        {isSuccess && (
          <SuccessSection
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SuccessHeader
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <SuccessIcon
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <CheckCircle2 size={56} color="white" />
              </SuccessIcon>

              <SuccessTitle>실행 완료!</SuccessTitle>
              <SuccessSubtitle>
                코드가 성공적으로 실행되었습니다
              </SuccessSubtitle>
            </SuccessHeader>

            {/* Job 정보 카드 */}
            <InfoCard
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <InfoCardHeader>
                <SuccessStatusDot />
                <InfoCardTitle>Job 정보</InfoCardTitle>
              </InfoCardHeader>
              <InfoList>
                <InfoItem>
                  <InfoLabel>Job ID</InfoLabel>
                  <InfoValue>{jobId}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>상태</InfoLabel>
                  <StatusBadge>성공</StatusBadge>
                </InfoItem>
                {executionInfo?.completedAt && (
                  <InfoItem>
                    <InfoLabel>완료 시간</InfoLabel>
                    <InfoText>
                      {new Date(executionInfo.completedAt).toLocaleString('ko-KR')}
                    </InfoText>
                  </InfoItem>
                )}
              </InfoList>
            </InfoCard>

            {/* 실행 결과 미리보기 (원하면 주석 해제해서 사용) */}
            {/* {executionInfo?.result && (
              <ResultCard
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <ResultTitle>실행 결과</ResultTitle>
                <ResultOutput>
                  <pre>{executionInfo.result.output || '(출력 없음)'}</pre>
                </ResultOutput>
              </ResultCard>
            )} */}

            {/* 액션 버튼 */}
            <ActionButtons
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ActionButton onClick={() => navigate(PATHS.WHITEBOARD)}>
                대시보드 보기
              </ActionButton>
            </ActionButtons>

            {/* 푸터 메시지 */}
            <FooterMessage
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              ❄️ Snowflake - 순수하고 투명한 서버리스 실행 완료
            </FooterMessage>
          </SuccessSection>
        )}

        {/* 투명성 메시지 (실패 제외 전체) */}
        {!isFailed && (
          <InfoMessage
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            ❄️ <strong>Pure & Transparent:</strong> 
            모든 실행 과정이 투명하게 공개됩니다. 

          </InfoMessage>
        )}
      </ContentWrapper>
    </Container>
  );
}

/* ---------------- 공통 스타일 ---------------- */

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
    to { transform: rotate(360deg); }
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
  margin-bottom: ${(props) => props.theme.spacing.xl};
`;

const StatusDot = styled.div`
  width: 12px;
  height: 12px;
  background: ${(props) => props.theme.color.green1};
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
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
  background: linear-gradient(
    to right,
    ${(props) => props.theme.color.green1},
    ${(props) => props.theme.color.green2}
  );
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

const ErrorLog = styled.div`
  background: rgba(127, 29, 29, 0.1);
  border: 1px solid #fecaca;
  border-radius: ${(props) => props.theme.borderRadius.xl};
  padding: ${(props) => props.theme.spacing.md};
  
  pre {
    font-size: ${(props) => props.theme.fontSize.sm};
    color: #991b1b;
    white-space: pre-wrap;
    font-family: monospace;
  }
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

/* ---------------- 성공 섹션 스타일 (기존 CompletePage 것 재활용) ---------------- */

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

const ResultCard = styled(motion.div)`
  background: ${(props) => props.theme.color.white};
  border-radius: ${(props) => props.theme.borderRadius['2xl']};
  padding: ${(props) => props.theme.spacing.lg};
  border: 1px solid ${(props) => props.theme.color.border2};
  box-shadow: ${(props) => props.theme.shadow.sm};
  margin-bottom: ${(props) => props.theme.spacing.lg};
`;

const ResultTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: 600;
  color: ${(props) => props.theme.color.baseColor2};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const ResultOutput = styled.div`
  background: ${(props) => props.theme.color.skyBg1};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  padding: ${(props) => props.theme.spacing.sm};
  border: 1px solid ${(props) => props.theme.color.border1};

  pre {
    font-size: ${(props) => props.theme.fontSize.sm};
    color: ${(props) => props.theme.color.baseColor2};
    white-space: pre-wrap;
    font-family: monospace;
  }
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
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.color.green1},
    ${(props) => props.theme.color.green2}
  );
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
