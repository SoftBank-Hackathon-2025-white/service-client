import styled from 'styled-components';
import React from 'react';

interface ProgressBarProps {
  percentage: number;
  color?: string;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color,
  label,
}) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <BarContainer>
        <BarFill
          $percentage={clampedPercentage}
          {...(color && { $color: color })}
        />
        <Percentage>{clampedPercentage.toFixed(1)}%</Percentage>
      </BarContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.color.baseColor7};
`;

const BarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 24px;
  background: ${(props) => props.theme.color.baseColor3};
  border-radius: 12px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $percentage: number; $color?: string }>`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  background: ${({ $color, theme }) =>
    $color ||
    `linear-gradient(90deg, ${theme.color.green1}, ${theme.color.greenDeep})`};
  border-radius: 12px;
  transition: width 0.5s ease;
`;

const Percentage = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.color.white};
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

export default ProgressBar;
