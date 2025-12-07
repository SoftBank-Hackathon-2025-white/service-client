import styled from 'styled-components';
import React from 'react';
import { JobStatus } from '../../types/whiteboard';

interface StatusBadgeProps {
  status: JobStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return <Badge $status={status}>{status}</Badge>;
};

const Badge = styled.span<{ $status: JobStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;

  ${({ $status, theme }) => {
    switch ($status) {
      case JobStatus.PENDING:
        return `
          background: ${theme.color.statusQueued || theme.color.baseColor5}20;
          color: ${theme.color.statusQueued || theme.color.baseColor5};
        `;
      case JobStatus.RUNNING:
        return `
          background: ${theme.color.statusRunning}20;
          color: ${theme.color.statusRunning};
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        `;
      case JobStatus.SUCCESS:
        return `
          background: ${theme.color.statusSuccess}20;
          color: ${theme.color.statusSuccess};
        `;
      case JobStatus.FAILED:
        return `
          background: ${theme.color.statusFailed}20;
          color: ${theme.color.statusFailed};
        `;
      case JobStatus.TIMEOUT:
        return `
          background: ${theme.color.statusFailed || '#f97316'}20;
          color: ${theme.color.statusFailed || '#f97316'};
        `;
      case JobStatus.CANCELLED:
        return `
          background: ${theme.color.baseColor5}20;
          color: ${theme.color.baseColor5};
        `;
      default:
        return `
          background: ${theme.color.baseColor5}20;
          color: ${theme.color.baseColor5};
        `;
    }
  }}

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
`;

export default StatusBadge;
