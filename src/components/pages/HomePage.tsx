import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Snowflake } from 'lucide-react';
import { LanguageSelector } from '../common/LanguageSelector';
import { CodeEditor } from '../common/CodeEditor';
import { SubmitButton } from '../common/SubmitButton';
import { submitCode } from '../../api/execution';
import { getExecutionPath } from '../../constants/paths';

/**
 * 홈 페이지 (코드 제출)
 * 사용자가 코드를 작성하고 실행 요청을 보내는 페이지
 */
export function HomePage() {
  const navigate = useNavigate();
  
  const [language, setLanguage] = useState<'python' | 'javascript' | 'java'>('python');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('코드를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { jobId } = await submitCode({ code, language });
      navigate(getExecutionPath(jobId));
    } catch (error) {
      console.error('Failed to submit code:', error);
      alert('코드 제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <ContentWrapper>
        {/* 헤더 */}
        <Header>
          <TitleWrapper>
            <IconWrapper>
              <Snowflake size={48} color="#0ea5e9" />
              <IconGlow />
            </IconWrapper>
            <Title>Snowflake</Title>
          </TitleWrapper>
          <Subtitle>
            순수하고 투명한 서버리스 플랫폼에서 코드를 실행하세요
          </Subtitle>
        </Header>

        {/* 폼 영역 */}
        <FormSection>
          <LanguageSelector
            value={language}
            onChange={(lang) => setLanguage(lang as 'python' | 'javascript' | 'java')}
            disabled={isSubmitting}
          />

          <CodeEditor
            value={code}
            onChange={setCode}
            language={language}
            disabled={isSubmitting}
          />

          <SubmitButton
            onClick={handleSubmit}
            disabled={!code.trim()}
            isSubmitting={isSubmitting}
          />
        </FormSection>

        {/* 정보 카드 */}
        <InfoGrid>
          <InfoCard>
            <InfoIcon>🔍</InfoIcon>
            <InfoTitle>완전한 투명성</InfoTitle>
            <InfoDescription>
              코드 업로드부터 실행 완료까지 모든 과정을 실시간으로 확인할 수 있습니다
            </InfoDescription>
          </InfoCard>

          <InfoCard>
            <InfoIcon>❄️</InfoIcon>
            <InfoTitle>순수한 실행</InfoTitle>
            <InfoDescription>
              Stateless 환경에서 실행되며 흔적을 남기지 않는 순수한 실행을 보장합니다
            </InfoDescription>
          </InfoCard>

          <InfoCard>
            <InfoIcon>📊</InfoIcon>
            <InfoTitle>리소스 측정</InfoTitle>
            <InfoDescription>
              CPU, 메모리, 실행 시간 등 모든 리소스 사용량을 투명하게 측정합니다
            </InfoDescription>
          </InfoCard>
        </InfoGrid>
      </ContentWrapper>
    </Container>
  );
}

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

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: 8px;
`;

const IconWrapper = styled.div`
  position: relative;
`;

const IconGlow = styled.div`
  position: absolute;
  inset: 0;
  background: ${(props) => props.theme.color.green1}33;
  filter: blur(20px);
  border-radius: 50%;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  color: ${(props) => props.theme.color.white};
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${(props) => props.theme.color.baseColor6};
  margin: 0;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing.lg};
`;

const InfoGrid = styled.div`
  margin-top: ${(props) => props.theme.spacing.xl};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${(props) => props.theme.spacing.md};
`;

const InfoCard = styled.div`
  padding: ${(props) => props.theme.spacing.lg};
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border-radius: ${(props) => props.theme.borderRadius.xl};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  box-shadow: ${(props) => props.theme.shadow.sm};
`;

const InfoIcon = styled.div`
  font-size: ${(props) => props.theme.fontSize['2xl']};
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const InfoTitle = styled.h3`
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: 600;
  color: ${(props) => props.theme.color.white};
  margin-bottom: ${(props) => props.theme.spacing.sm};
`;

const InfoDescription = styled.p`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.baseColor6};
  line-height: 1.6;
`;