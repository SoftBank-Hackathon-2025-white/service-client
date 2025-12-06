import styled from 'styled-components';
import { FileCode, Sparkles } from 'lucide-react';

const guideAnnotation = {
  python: '# Python 코드를 입력하세요',
  node: '// JavaScript 코드를 입력하세요',
  java: '// Java 코드를 입력하세요',
}

const exampleCode: Record<string, string> = {
  python: 'print("Hello, Snowflake!")',
  node: 'console.log("Hello, Snowflake!");',
  java: 'public static void main(String[] args) {/n System.out.println("Hello, Snowflake!");/n }',
};
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: 'python' | 'node' | 'java';
  disabled?: boolean;
}

export function CodeEditor({ value, onChange, language, disabled = false }: CodeEditorProps) {
  const handleLoadExample = () => {
    onChange(exampleCode[language] || '');
  };

  return (
    <Container>
      <Header>
        <Label>
          <FileCode size={20} color="#0ea5e9" />
          <span>코드 입력</span>
        </Label>

        <ExampleButton
          type="button"
          onClick={handleLoadExample}
          disabled={disabled}
        >
          <Sparkles size={16} />
          <span>예시 코드</span>
        </ExampleButton>
      </Header>

      <EditorWrapper>
        <TextArea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={`${guideAnnotation[language]}\n\n예:\n${exampleCode[language]}`}
        />

        <LineCount>
          {value.split('\n').length} lines
        </LineCount>
      </EditorWrapper>

      <TipMessage>
        💡 <strong>Tip:</strong> Tab 키로 들여쓰기를 할 수 있습니다. 
        코드를 입력한 후 하단의 "Snowflake 실행" 버튼을 클릭하세요.
      </TipMessage>
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

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing.md};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  color: ${(props) => props.theme.color.white};
  font-weight: 500;
`;

const ExampleButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
  padding: ${(props) => props.theme.spacing.sm} ${(props) => props.theme.spacing.md};
  font-size: ${(props) => props.theme.fontSize.sm};
  color: ${(props) => props.theme.color.green1};
  background: transparent;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    color: ${(props) => props.theme.color.green2};
    background: ${(props) => props.theme.color.baseColor3};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EditorWrapper = styled.div`
  position: relative;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 384px;
  padding: ${(props) => props.theme.spacing.md};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  border: 2px solid ${(props) => props.theme.color.cardBorder};
  background: ${(props) => props.theme.color.baseColor3};
  color: ${(props) => props.theme.color.white};
  font-family: 'Courier New', monospace;
  font-size: ${(props) => props.theme.fontSize.sm};
  line-height: 1.6;
  resize: none;
  transition: all 0.2s;

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

const LineCount = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: ${(props) => props.theme.spacing.xs} ${(props) => props.theme.spacing.sm};
  background: ${(props) => props.theme.color.baseColor1};
  backdrop-filter: blur(4px);
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  font-size: ${(props) => props.theme.fontSize.xs};
  color: ${(props) => props.theme.color.baseColor6};
`;

const TipMessage = styled.div`
  margin-top: ${(props) => props.theme.spacing.md};
  padding: ${(props) => props.theme.spacing.md};
  background: ${(props) => props.theme.color.baseColor3};
  border-radius: ${(props) => props.theme.borderRadius.lg};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  font-size: ${(props) => props.theme.fontSize.xs};
  color: ${(props) => props.theme.color.green1};

  strong {
    font-weight: 600;
  }
`;