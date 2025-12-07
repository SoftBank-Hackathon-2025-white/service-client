import styled from 'styled-components';
import { CheckCircle2 } from 'lucide-react';

/**
 * パイプライン - Completed段階
 */
interface CompletedStepProps {
  status: 'pending' | 'active' | 'completed';
}

export function CompletedStep({ status }: CompletedStepProps) {
  const isPending = status === 'pending';
  const isActive = status === 'active';
  const isCompleted = status === 'completed';

  return (
    <StepCard $status={status}>
      <IconWrapper $status={status}>
        <CheckCircle2 size={24} />
      </IconWrapper>

      <StepContent>
        <StepTitle $status={status}>Success</StepTitle>
        <StepDescription $status={status}>コード実行が正常に完了しました</StepDescription>
      </StepContent>

      <StatusBadge $status={status}>
        {isCompleted && '完了'}
        {isActive && '進行中'}
        {isPending && '待機'}
      </StatusBadge>
    </StepCard>
  );
}

const StepCard = styled.div<{ $status: 'pending' | 'active' | 'completed' }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  background: ${(props) =>
    props.$status === 'completed'
      ? props.theme.color.baseColor3
      : props.$status === 'active'
        ? props.theme.color.baseColor2
        : props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border: 2px solid
    ${(props) =>
      props.$status === 'completed'
        ? props.theme.color.green1
        : props.$status === 'active'
          ? props.theme.color.green1
          : props.theme.color.cardBorder};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  padding: ${(props) => props.theme.spacing.lg};
  transition: all 0.3s ease;
`;

const IconWrapper = styled.div<{ $status: 'pending' | 'active' | 'completed' }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  background: ${(props) =>
    props.$status === 'completed'
      ? props.theme.color.green1
      : props.$status === 'active'
        ? props.theme.color.green1
        : props.theme.color.baseColor4};
  color: white;
  flex-shrink: 0;
`;

const StepContent = styled.div`
  flex: 1;
`;

const StepTitle = styled.h3<{ $status: 'pending' | 'active' | 'completed' }>`
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: 600;
  color: ${(props) =>
    props.$status === 'completed'
      ? props.theme.color.green1
      : props.$status === 'active'
        ? props.theme.color.green1
        : props.theme.color.baseColor6};
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const StepDescription = styled.p<{ $status: 'pending' | 'active' | 'completed' }>`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.baseColor6};
  opacity: ${(props) => (props.$status === 'pending' ? 0.6 : 1)};
`;

const StatusBadge = styled.span<{ $status: 'pending' | 'active' | 'completed' }>`
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: ${(props) => props.theme.fontSize.xs};
  font-weight: 600;
  background: ${(props) =>
    props.$status === 'completed'
      ? props.theme.color.green1
      : props.$status === 'active'
        ? props.theme.color.green1
        : props.theme.color.baseColor4};
  color: white;
  flex-shrink: 0;
`;
