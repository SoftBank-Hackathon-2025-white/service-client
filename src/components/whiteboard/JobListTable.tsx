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

  const formatDuration = (duration?: number) => {
    if (!duration) return '-';
    const seconds = Math.floor(duration / 1000);
    if (seconds < 60) return `${seconds}초`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}분 ${remainingSeconds}초`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Container>
      <Header>
        <Title>최근 실행 이력</Title>
        <FilterContainer>
          <FilterButton $active={filterStatus === 'ALL'} onClick={() => setFilterStatus('ALL')}>
            전체
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
              <Th>상태</Th>
              <Th>언어</Th>
              <Th>시작 시간</Th>
              <Th>실행 시간</Th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length === 0 ? (
              <tr>
                <Td colSpan={5}>
                  <EmptyMessage>실행 이력이 없습니다.</EmptyMessage>
                </Td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <Tr key={job.id} $clickable={!!onJobClick} onClick={() => onJobClick?.(job.id)}>
                  <Td>
                    <JobId>{job.id.substring(0, 8)}</JobId>
                  </Td>
                  <Td>
                    <StatusBadge status={job.status} />
                  </Td>
                  <Td>
                    <Language>{job.language}</Language>
                  </Td>
                  <Td>{formatTime(job.startedAt)}</Td>
                  <Td>{formatDuration(job.duration)}</Td>
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

const JobId = styled.code`
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: ${(props) => props.theme.color.green1};
  background: ${(props) => props.theme.color.baseColor2};
  padding: 4px 8px;
  border-radius: 4px;
`;

const Language = styled.span`
  font-weight: 500;
  color: ${(props) => props.theme.color.white};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: ${(props) => props.theme.color.baseColor6};
  font-size: 14px;
`;

export default JobListTable;
