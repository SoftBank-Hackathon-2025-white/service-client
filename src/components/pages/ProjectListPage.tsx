import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Waves, FolderOpen, Plus, X } from 'lucide-react';
import { useProjects, useCreateProject } from '../../api/project';
import { getProjectPath } from '../../constants/paths';

/**
 * プロジェクト一覧ページ
 */
export function ProjectListPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useProjects();
  const createProjectMutation = useCreateProject();

  // モーダル状態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      alert('プロジェクト名を入力してください。');
      return;
    }

    try {
      const project = await createProjectMutation.mutateAsync({
        project_name: newProjectName.trim(),
      });
      setIsModalOpen(false);
      setNewProjectName('');
      navigate(getProjectPath(project.project_id.toString()));
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('プロジェクトの作成に失敗しました。');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewProjectName('');
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingWrapper>
          <Spinner />
          <LoadingText>プロジェクト一覧を読み込み中...</LoadingText>
        </LoadingWrapper>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorWrapper>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>データを読み込めません</ErrorTitle>
          <ErrorMessage>{error instanceof Error ? error.message : 'サーバーとの接続を確認してください。'}</ErrorMessage>
        </ErrorWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        {/* ヘッダー領域 */}
        <HeroSection>
          <HeroContent>
            <TitleWrapper>
              <IconWrapper>
                <Waves size={56} color="#14B8A6" />
                <IconGlow />
              </IconWrapper>
              <Title>Lambda the Sea</Title>
            </TitleWrapper>
            <Subtitle>Serverless Lambdaを透明な海のように可視化するプラットフォーム</Subtitle>

            {/* 特徴バッジ */}
            <FeatureBadges>
              <FeatureBadge>
                <span>🔍</span> 完全な透明性
              </FeatureBadge>
              <FeatureBadge>
                <span>🌊</span> クリーンな実行
              </FeatureBadge>
              <FeatureBadge>
                <span>📊</span> リソース測定
              </FeatureBadge>
            </FeatureBadges>
          </HeroContent>
        </HeroSection>

        {/* プロジェクトセクション */}
        <ProjectsSection>
          <SectionHeader>
            <SectionTitleWrapper>
              <FolderOpen size={24} />
              <SectionTitle>プロジェクト</SectionTitle>
              <ProjectCount>{data?.length || 0}件</ProjectCount>
            </SectionTitleWrapper>
            <CreateButton onClick={() => setIsModalOpen(true)}>
              <Plus size={18} />
              新規プロジェクト
            </CreateButton>
          </SectionHeader>

          <ProjectGrid>
            {data?.map((project) => (
              <ProjectCard
                key={project.project_id}
                onClick={() => navigate(getProjectPath(project.project_id.toString()))}
              >
                <ProjectHeader>
                  <ProjectName>{project.project}</ProjectName>
                  <ProjectId>{project.project_id}</ProjectId>
                </ProjectHeader>
              </ProjectCard>
            ))}

            {/* 空の状態 */}
            {(!data || data.length === 0) && (
              <EmptyState>
                <EmptyIcon>📁</EmptyIcon>
                <EmptyTitle>プロジェクトがありません</EmptyTitle>
                <EmptyDescription>新しいプロジェクトを作成してコードを実行してみましょう</EmptyDescription>
                <CreateButton onClick={() => setIsModalOpen(true)}>
                  <Plus size={18} />
                  新規プロジェクト作成
                </CreateButton>
              </EmptyState>
            )}
          </ProjectGrid>
        </ProjectsSection>
      </ContentWrapper>

      {/* プロジェクト作成モーダル */}
      {isModalOpen && (
        <ModalOverlay onClick={handleModalClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>新規プロジェクト作成</ModalTitle>
              <CloseButton onClick={handleModalClose}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <Label>プロジェクト名 *</Label>
                <Input
                  type="text"
                  placeholder="例: My Awesome Project"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  autoFocus
                />
              </FormGroup>
            </ModalBody>

            <ModalFooter>
              <CancelButton onClick={handleModalClose}>キャンセル</CancelButton>
              <SubmitButton onClick={handleCreateProject} disabled={createProjectMutation.isPending}>
                {createProjectMutation.isPending ? '作成中...' : 'プロジェクト作成'}
              </SubmitButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

/* Styles */
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.color.baseColor1} 0%,
    ${(props) => props.theme.color.baseColor2} 50%,
    ${(props) => props.theme.color.baseColor3} 100%
  );
  position: relative;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

/* Hero Section */
const HeroSection = styled.div`
  padding: 60px 20px 40px;
  text-align: center;
  border-bottom: 1px solid rgba(6, 182, 212, 0.2);
  background: linear-gradient(180deg, rgba(6, 182, 212, 0.05) 0%, transparent 100%);
`;

const HeroContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing.md};
  margin-bottom: 12px;
`;

const IconWrapper = styled.div`
  position: relative;
`;

const IconGlow = styled.div`
  position: absolute;
  inset: -10px;
  background: ${(props) => props.theme.color.statusRunning};
  opacity: 0.4;
  filter: blur(25px);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.4;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1);
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 800;
  color: ${(props) => props.theme.color.white};
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: ${(props) => props.theme.color.baseColor7};
  margin: 0 0 24px 0;
  font-weight: 400;
  letter-spacing: 0.3px;
`;

const FeatureBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const FeatureBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(6, 182, 212, 0.15);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 20px;
  font-size: 13px;
  color: ${(props) => props.theme.color.baseColor8};
  backdrop-filter: blur(10px);

  span {
    font-size: 14px;
  }
`;

/* Projects Section */
const ProjectsSection = styled.section`
  padding: 40px 20px 60px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.sm};
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${(props) => props.theme.color.white};
  margin: 0;
`;

const ProjectCount = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.color.baseColor8};
  background: rgba(6, 182, 212, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${(props) => props.theme.color.statusRunning};
  color: ${(props) => props.theme.color.baseColor1};
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(6, 182, 212, 0.5);
    background: ${(props) => props.theme.color.primaryDark};
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const ProjectCard = styled.div`
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border-radius: ${(props) => props.theme.borderRadius.xl};
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(6, 182, 212, 0.3);
    border-color: ${(props) => props.theme.color.statusRunning};
    background: rgba(6, 182, 212, 0.12);
  }
`;

const ProjectHeader = styled.div`
  margin-bottom: 12px;
`;

const ProjectName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.color.white};
  margin: 0 0 4px 0;
`;

const ProjectId = styled.code`
  font-size: 12px;
  color: ${(props) => props.theme.color.baseColor6};
  font-family: monospace;
  background: rgba(6, 182, 212, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
`;

/* Empty State */
const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: ${(props) => props.theme.color.cardBackground};
  border-radius: ${(props) => props.theme.borderRadius.xl};
  border: 2px dashed rgba(6, 182, 212, 0.3);
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.color.white};
  margin: 0 0 8px 0;
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.color.baseColor6};
  margin: 0 0 24px 0;
`;

/* Loading & Error */
const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: ${(props) => props.theme.spacing.md};
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${(props) => props.theme.color.baseColor3};
  border-top-color: ${(props) => props.theme.color.statusRunning};
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

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
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
  margin: 0;
`;

/* Modal */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  width: 100%;
  max-width: 480px;
  background: ${(props) => props.theme.color.baseColor2};
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(6, 182, 212, 0.2);
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.color.white};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: ${(props) => props.theme.color.baseColor6};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.color.baseColor3};
    color: ${(props) => props.theme.color.white};
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.color.baseColor7};
`;

const Input = styled.input`
  padding: 12px 16px;
  background: ${(props) => props.theme.color.baseColor3};
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 8px;
  font-size: 14px;
  color: ${(props) => props.theme.color.white};
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: ${(props) => props.theme.color.baseColor5};
  }

  &:focus {
    border-color: ${(props) => props.theme.color.statusRunning};
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid rgba(6, 182, 212, 0.2);
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: transparent;
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.color.baseColor6};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(6, 182, 212, 0.1);
    border-color: ${(props) => props.theme.color.statusRunning};
    color: ${(props) => props.theme.color.white};
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background: ${(props) => props.theme.color.statusRunning};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.color.white};
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(134, 195, 187, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
