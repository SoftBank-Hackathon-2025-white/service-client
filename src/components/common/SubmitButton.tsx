import styled from 'styled-components';
import { Play, Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
}

export function SubmitButton({ onClick, disabled = false, isSubmitting = false }: SubmitButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled || isSubmitting}
      $isSubmitting={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <SpinningIcon>
            <Loader2 size={20} />
          </SpinningIcon>
          <span>제출 중...</span>
        </>
      ) : (
        <>
          <Play size={20} />
          <span>Snowflake 실행</span>
        </>
      )}
    </Button>
  );
}

interface ButtonProps {
  $isSubmitting: boolean;
}

const Button = styled.button<ButtonProps>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.md} ${(props) => props.theme.spacing.xl};
  background: ${(props) => 
    props.$isSubmitting 
      ? props.theme.color.baseColor3 
      : `linear-gradient(135deg, ${props.theme.color.green1}, ${props.theme.color.green2})`
  };
  color: ${(props) => props.theme.color.baseColor1};
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: 600;
  border-radius: ${(props) => props.theme.borderRadius['2xl']};
  box-shadow: ${(props) => props.theme.shadow.md};
  transition: all 0.3s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${(props) => props.theme.shadow.lg};
    opacity: 0.9;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SpinningIcon = styled.div`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;