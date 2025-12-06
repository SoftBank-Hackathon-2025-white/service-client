import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Play, CheckCircle } from 'lucide-react';

interface RunningStepProps {
  status: 'pending' | 'active' | 'completed';
}

/**
 * 파이프라인 - Running 단계
 */
export function RunningStep({ status }: RunningStepProps) {
  const isPending = status === 'pending';
  const isActive = status === 'active';
  const isCompleted = status === 'completed';

  return (
    <StepCard $status={status}>
      <IconWrapper $status={status}>
        {isCompleted ? (
          <CheckCircle size={24} />
        ) : (
          <Play size={24} />
        )}
      </IconWrapper>

      <StepContent>
        <StepTitle $status={status}>Running</StepTitle>
        <StepDescription $status={status}>
          ECS 컨테이너에서 코드를 실행하고 있습니다
        </StepDescription>

        {isActive && (
          <ProgressBar>
            <ProgressFill
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </ProgressBar>
        )}
      </StepContent>

      <StatusBadge $status={status}>
        {isCompleted && '완료'}
        {isActive && '진행중'}
        {isPending && '대기'}
      </StatusBadge>
    </StepCard>
  );
}

const StepCard = styled.div<{ $status: 'pending' | 'active' | 'completed' }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.md};
  background: ${(props) => 
    props.$status === 'completed' ? props.theme.color.baseColor3 :
    props.$status === 'active' ? props.theme.color.baseColor2 :
    props.theme.color.cardBackground
  };
  backdrop-filter: blur(10px);
  border: 2px solid ${(props) =>
    props.$status === 'completed' ? props.theme.color.green1 :
    props.$status === 'active' ? props.theme.color.statusRunning :
    props.theme.color.cardBorder
  };
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
    props.$status === 'completed' ? props.theme.color.green1 :
    props.$status === 'active' ? props.theme.color.statusRunning :
    props.theme.color.baseColor4
  };
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
    props.$status === 'completed' ? props.theme.color.green1 :
    props.$status === 'active' ? props.theme.color.statusRunning :
    props.theme.color.baseColor6
  };
  margin-bottom: ${(props) => props.theme.spacing.xs};
`;

const StepDescription = styled.p<{ $status: 'pending' | 'active' | 'completed' }>`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.baseColor6};
  opacity: ${(props) => props.$status === 'pending' ? 0.6 : 1};
`;

const ProgressBar = styled.div`
  margin-top: ${(props) => props.theme.spacing.sm};
  width: 100%;
  height: 4px;
  background: ${(props) => props.theme.color.baseColor3};
  border-radius: ${(props) => props.theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(
    to right,
    ${(props) => props.theme.color.statusRunning},
    ${(props) => props.theme.color.green1}
  );
`;

const StatusBadge = styled.span<{ $status: 'pending' | 'active' | 'completed' }>`
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.full};
  font-size: ${(props) => props.theme.fontSize.xs};
  font-weight: 600;
  background: ${(props) =>
    props.$status === 'completed' ? props.theme.color.green1 :
    props.$status === 'active' ? props.theme.color.statusRunning :
    props.theme.color.baseColor4
  };
  color: white;
  flex-shrink: 0;
`;
