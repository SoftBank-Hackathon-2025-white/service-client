import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Snowflake, FolderOpen, Clock, Activity, Plus, X } from 'lucide-react';
import { useProjects, useCreateProject } from '../../api/project';
import { getProjectPath } from '../../constants/paths';

/**
 * 프로젝트 목록 페이지
 */
export function ProjectListPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useProjects();
  const createProjectMutation = useCreateProject();

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      alert('프로젝트 이름을 입력해주세요.');
      return;
    }

    try {
      const trimmedDescription = newProjectDescription.trim();
      const project = await createProjectMutation.mutateAsync({
        name: newProjectName.trim(),
        ...(trimmedDescription && { description: trimmedDescription }),
      });
      setIsModalOpen(false);
      setNewProjectName('');
      setNewProjectDescription('');
      navigate(getProjectPath(project.id));
    } catch (err) {
      console.error('Failed to create project:', err);
      alert('프로젝트 생성에 실패했습니다.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewProjectName('');
    setNewProjectDescription('');
  };

  if (isLoading) {
    return (
      <Container>
        <LoadingWrapper>
          <Spinner />
          <LoadingText>프로젝트 목록을 불러오는 중...</LoadingText>
        </LoadingWrapper>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorWrapper>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>데이터를 불러올 수 없습니다</ErrorTitle>
          <ErrorMessage>{error instanceof Error ? error.message : '서버와의 연결을 확인해주세요.'}</ErrorMessage>
        </ErrorWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <ContentWrapper>
        {/* 헤더 영역 */}
        <HeroSection>
          <HeroContent>
            <TitleWrapper>
              <IconWrapper>
                <Snowflake size={56} color="#86c3bb" />
                <IconGlow />
              </IconWrapper>
              <Title>Snowflake</Title>
            </TitleWrapper>
            <Subtitle>순수하고 투명한 서버리스 코드 실행 플랫폼</Subtitle>

            {/* 특징 배지 */}
            <FeatureBadges>
              <FeatureBadge>
                <span>🔍</span> 완전한 투명성
              </FeatureBadge>
              <FeatureBadge>
                <span>❄️</span> 순수한 실행
              </FeatureBadge>
              <FeatureBadge>
                <span>📊</span> 리소스 측정
              </FeatureBadge>
            </FeatureBadges>
          </HeroContent>
        </HeroSection>

        {/* 프로젝트 섹션 */}
        <ProjectsSection>
          <SectionHeader>
            <SectionTitleWrapper>
              <FolderOpen size={24} />
              <SectionTitle>프로젝트</SectionTitle>
              <ProjectCount>{data?.total || 0}개</ProjectCount>
            </SectionTitleWrapper>
            <CreateButton onClick={() => setIsModalOpen(true)}>
              <Plus size={18} />새 프로젝트
            </CreateButton>
          </SectionHeader>

          <ProjectGrid>
            {data?.projects.map((project) => (
              <ProjectCard key={project.id} onClick={() => navigate(getProjectPath(project.id))}>
                <ProjectHeader>
                  <ProjectName>{project.name}</ProjectName>
                  <ProjectId>{project.id}</ProjectId>
                </ProjectHeader>

                {project.description && <ProjectDescription>{project.description}</ProjectDescription>}

                <ProjectStats>
                  <StatItem>
                    <Activity size={14} />
                    <span>{project.jobCount}개 Job</span>
                  </StatItem>
                  {project.lastJobAt && (
                    <StatItem>
                      <Clock size={14} />
                      <span>{formatRelativeTime(project.lastJobAt)}</span>
                    </StatItem>
                  )}
                </ProjectStats>

                <ProjectFooter>
                  <CreatedAt>생성: {formatDate(project.createdAt)}</CreatedAt>
                </ProjectFooter>
              </ProjectCard>
            ))}

            {/* 빈 상태 */}
            {(!data?.projects || data.projects.length === 0) && (
              <EmptyState>
                <EmptyIcon>📁</EmptyIcon>
                <EmptyTitle>프로젝트가 없습니다</EmptyTitle>
                <EmptyDescription>새 프로젝트를 생성하여 코드를 실행해보세요</EmptyDescription>
                <CreateButton onClick={() => setIsModalOpen(true)}>
                  <Plus size={18} />새 프로젝트 만들기
                </CreateButton>
              </EmptyState>
            )}
          </ProjectGrid>
        </ProjectsSection>
      </ContentWrapper>

      {/* 프로젝트 생성 모달 */}
      {isModalOpen && (
        <ModalOverlay onClick={handleModalClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>새 프로젝트 만들기</ModalTitle>
              <CloseButton onClick={handleModalClose}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <FormGroup>
                <Label>프로젝트 이름 *</Label>
                <Input
                  type="text"
                  placeholder="예: My Awesome Project"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  autoFocus
                />
              </FormGroup>

              <FormGroup>
                <Label>설명 (선택)</Label>
                <Input
                  type="text"
                  placeholder="프로젝트에 대한 간단한 설명"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                />
              </FormGroup>
            </ModalBody>

            <ModalFooter>
              <CancelButton onClick={handleModalClose}>취소</CancelButton>
              <SubmitButton onClick={handleCreateProject} disabled={createProjectMutation.isPending}>
                {createProjectMutation.isPending ? '생성 중...' : '프로젝트 생성'}
              </SubmitButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

/**
 * 상대 시간 포맷
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return '방금 전';
  }
  if (diffMins < 60) {
    return `${diffMins}분 전`;
  }
  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }
  return `${diffDays}일 전`;
}

/**
 * 날짜 포맷
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/* Styles */
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.color.baseColor1} 0%,
    ${(props) => props.theme.color.baseColor2} 100%
  );
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

/* Hero Section */
const HeroSection = styled.div`
  padding: 60px 20px 40px;
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.color.border1};
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
  background: ${(props) => props.theme.color.green1}33;
  filter: blur(25px);
  border-radius: 50%;
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
  color: ${(props) => props.theme.color.baseColor6};
  margin: 0 0 24px 0;
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
  background: ${(props) => props.theme.color.baseColor3};
  border-radius: 20px;
  font-size: 13px;
  color: ${(props) => props.theme.color.baseColor7};

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
  color: ${(props) => props.theme.color.baseColor6};
  background: ${(props) => props.theme.color.baseColor3};
  padding: 4px 12px;
  border-radius: 20px;
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${(props) => props.theme.color.green1};
  color: ${(props) => props.theme.color.baseColor1};
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(134, 195, 187, 0.4);
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
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    border-color: ${(props) => props.theme.color.green1};
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
  color: ${(props) => props.theme.color.baseColor5};
  font-family: monospace;
`;

const ProjectDescription = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.color.baseColor6};
  margin: 0 0 16px 0;
  line-height: 1.5;
`;

const ProjectStats = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${(props) => props.theme.color.green1};

  span {
    color: ${(props) => props.theme.color.baseColor6};
  }
`;

const ProjectFooter = styled.div`
  padding-top: 12px;
  border-top: 1px solid ${(props) => props.theme.color.border1};
`;

const CreatedAt = styled.span`
  font-size: 12px;
  color: ${(props) => props.theme.color.baseColor5};
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
  border: 2px dashed ${(props) => props.theme.color.border1};
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
  border-top-color: ${(props) => props.theme.color.green1};
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
  border-bottom: 1px solid ${(props) => props.theme.color.border1};
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
  border: 1px solid ${(props) => props.theme.color.border1};
  border-radius: 8px;
  font-size: 14px;
  color: ${(props) => props.theme.color.white};
  outline: none;
  transition: all 0.2s;

  &::placeholder {
    color: ${(props) => props.theme.color.baseColor5};
  }

  &:focus {
    border-color: ${(props) => props.theme.color.green1};
    box-shadow: 0 0 0 3px ${(props) => props.theme.color.green1}33;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid ${(props) => props.theme.color.border1};
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: transparent;
  border: 1px solid ${(props) => props.theme.color.border1};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.color.baseColor6};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => props.theme.color.baseColor3};
    color: ${(props) => props.theme.color.white};
  }
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background: ${(props) => props.theme.color.green1};
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.color.baseColor1};
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
