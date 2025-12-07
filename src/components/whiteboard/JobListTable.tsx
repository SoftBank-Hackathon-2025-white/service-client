import styled from 'styled-components';
import React, { useState } from 'react';
import type { JobMetadata } from '../../types/whiteboard';
import { JobStatus } from '../../types/whiteboard';
import StatusBadge from '../common/StatusBadge';

interface JobListTableProps {
  jobs: JobMetadata[];
  onJobClick?: (jobId: string) => void;
}

const JobListTable: React.FC<JobListTableProps> = ({ jobs, onJobClick }) => {
  const [filterStatus, setFilterStatus] = useState<JobStatus | 'ALL'>('ALL');

  const filteredJobs = filterStatus === 'ALL' ? jobs : jobs.filter((job) => job.status === filterStatus);

  return (
    <Container>
      <Header>
        <Title>最近の実行履歴</Title>
        <FilterContainer>
          <FilterButton $active={filterStatus === 'ALL'} onClick={() => setFilterStatus('ALL')}>
            全体
          </FilterButton>
          {Object.values(JobStatus).map((status) => (
            <FilterButton key={status} $active={filterStatus === status} onClick={() => setFilterStatus(status)}>
              {status}
            </FilterButton>
          ))}
        </FilterContainer>
      </Header>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Job ID</Th>
              <Th>ステータス</Th>
              <Th>プロジェクト</Th>
              <Th>メッセージ</Th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr>
                <Td colSpan={4}>
                  <EmptyMessage>実行履歴がありません。</EmptyMessage>
                </Td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <Tr key={job.job_id} $clickable={!!onJobClick} onClick={() => onJobClick?.(job.job_id)}>
                  <Td>
                    <JobIdCell>{job.job_id.length > 16 ? `${job.job_id.substring(0, 16)}...` : job.job_id}</JobIdCell>
                  </Td>
                  <Td>
                    <StatusBadge status={job.status} />
                  </Td>
                  <Td>
                    <ProjectCell>{job.project}</ProjectCell>
                  </Td>
                  <Td>
                    <MessageCell>{job.message}</MessageCell>
                  </Td>
                </Tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

const Container = styled.div`
  background: ${(props) => props.theme.color.cardBackground};
  backdrop-filter: blur(10px);
  border: 1px solid ${(props) => props.theme.color.cardBorder};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.color.white};
  margin: 0;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ $active, theme }) => ($active ? theme.color.green1 : theme.color.baseColor3)};
  color: ${({ $active, theme }) => ($active ? theme.color.baseColor1 : theme.color.baseColor7)};

  &:hover {
    background: ${({ $active, theme }) => ($active ? theme.color.greenDeep : theme.color.baseColor4)};
    color: ${(props) => props.theme.color.white};
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.color.baseColor6};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid ${(props) => props.theme.color.baseColor3};
`;

const Tr = styled.tr<{ $clickable?: boolean }>`
  transition: all 0.2s ease;
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};

  &:hover {
    background: ${(props) => props.theme.color.baseColor2};
  }
`;

const Td = styled.td`
  padding: 16px;
  font-size: 14px;
  color: ${(props) => props.theme.color.baseColor7};
  border-bottom: 1px solid ${(props) => props.theme.color.baseColor3};
`;

const JobIdCell = styled.code`
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: ${(props) => props.theme.color.green1};
  background: ${(props) => props.theme.color.baseColor2};
  padding: 4px 8px;
  border-radius: 4px;
`;

const ProjectCell = styled.span`
  font-weight: 500;
  color: ${(props) => props.theme.color.white};
`;

const MessageCell = styled.span`
  color: ${(props) => props.theme.color.baseColor7};
  font-size: 14px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: ${(props) => props.theme.color.baseColor6};
  font-size: 14px;
`;

export default JobListTable;
