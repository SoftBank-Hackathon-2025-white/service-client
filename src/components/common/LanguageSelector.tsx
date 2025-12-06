import styled from 'styled-components';
import { Code } from 'lucide-react';

interface LanguageSelectorProps {
  value: string;
  onChange: (lang: string) => void;
  disabled?: boolean;
}

/**
 * 프로그래밍 언어 선택 컴포넌트
 * Python, JavaScript, TypeScript 중 선택
 */
export function LanguageSelector({ value, onChange, disabled = false }: LanguageSelectorProps) {
  const languages = [
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'javascript', label: 'JavaScript', icon: '💛' },
    { value: 'typescript', label: 'TypeScript', icon: '💙' }
  ];

  return (
    <Container>
      <Label>
        <Code size={20} color="#0ea5e9" />
        <span>프로그래밍 언어 선택</span>
      </Label>

      <LanguageGrid>
        {languages.map((lang) => (
          <LanguageButton
            key={lang.value}
            type="button"
            onClick={() => onChange(lang.value)}
            disabled={disabled}
            $isSelected={value === lang.value}
          >
            <LanguageIcon>{lang.icon}</LanguageIcon>
            <LanguageName $isSelected={value === lang.value}>
              {lang.label}
            </LanguageName>
          </LanguageButton>
        ))}
      </LanguageGrid>

      <SelectedInfo>
        ✓ 선택된 언어: <strong>{languages.find(l => l.value === value)?.label}</strong>
      </SelectedInfo>
    </Container>
  );
}

const Container = styled.div`
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border-radius: ${(props) => props.theme.borderRadius['2xl']};
  padding: ${(props) => props.theme.spacing.lg};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  box-shadow: ${(props) => props.theme.shadow.sm};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  margin-bottom: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.color.white};
  font-weight: 500;
`;

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${(props) => props.theme.spacing.md};
`;

const LanguageButton = styled.button<{ $isSelected: boolean }>`
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  border: 2px solid ${(props) => 
    props.$isSelected ? props.theme.color.green1 : props.theme.color.cardBorder};
  background: ${(props) => 
    props.$isSelected ? props.theme.color.baseColor3 : props.theme.color.baseColor2};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  transition: all 0.2s;
  box-shadow: ${(props) => props.$isSelected ? props.theme.shadow.md : 'none'};

  &:hover:not(:disabled) {
    border-color: ${(props) => props.theme.color.green1};
    background: ${(props) => props.theme.color.baseColor3};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LanguageIcon = styled.span`
  font-size: ${(props) => props.theme.fontSize['2xl']};
`;

const LanguageName = styled.span<{ $isSelected: boolean }>`
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => 
    props.$isSelected ? props.theme.color.green1 : props.theme.color.baseColor6};
  font-weight: ${(props) => props.$isSelected ? 600 : 400};
`;

const SelectedInfo = styled.div`
  margin-top: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.color.baseColor3};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.green1};

  strong {
    font-weight: 600;
  }
`;