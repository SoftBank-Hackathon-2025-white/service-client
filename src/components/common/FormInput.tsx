import styled from 'styled-components';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

/**
 * 폼 입력 필드 컴포넌트
 */
export function FormInput({ label, value, onChange, placeholder, disabled, required }: FormInputProps) {
  return (
    <Container>
      <Label>
        {label}
        {required && <Required>*</Required>}
      </Label>
      <Input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        disabled={disabled}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.color.white};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Required = styled.span`
  color: ${(props) => props.theme.color.statusFailed};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: ${(props) => props.theme.color.baseColor2};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  border-radius: 12px;
  color: ${(props) => props.theme.color.white};
  font-size: 14px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${(props) => props.theme.color.baseColor5};
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.color.green1};
    box-shadow: 0 0 0 3px ${(props) => props.theme.color.green1}33;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
