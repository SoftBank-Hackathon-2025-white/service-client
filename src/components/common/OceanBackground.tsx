import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

/**
 * 바다 배경 애니메이션 컴포넌트
 * 바다 속에서 떠오르는 기포(물방울) 효과를 제공
 * Lambda the Sea 테마 - 투명하고 깨끗한 바다 속 느낌
 */
export const OceanBackground: React.FC = () => {
  interface Bubble {
    id: number;
    x: number;
    size: number;
    duration: number;
    delay: number;
  }
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const bubbleArray: Bubble[] = [];

    // 60개의 랜덤 기포 생성
    for (let i = 0; i < 60; i++) {
      bubbleArray.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 12 + 4, // 4px ~ 16px
        duration: Math.random() * 10 + 12, // 12초 ~ 22초 (천천히 떠오름)
        delay: Math.random() * 10,
      });
    }

    setBubbles(bubbleArray);
  }, []);

  return (
    <Container>
      {bubbles.map((bubble) => (
        <Bubble
          key={bubble.id}
          style={{
            left: `${bubble.x}%`,
            width: bubble.size,
            height: bubble.size,
            bottom: -20,
          }}
          animate={{
            y: ['0vh', '-120vh'], // 아래에서 위로 떠오름
            x: [0, Math.sin(bubble.id) * 60, Math.cos(bubble.id) * 40, 0], // 물결치듯 좌우 움직임
            opacity: [0, 0.6, 0.8, 0.6, 0],
            scale: [0.8, 1, 1.1, 1, 0.8],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* 큰 기포 몇 개 추가 (더욱 생동감) */}
      {[1, 2, 3, 4, 5].map((i) => (
        <LargeBubble
          key={`large-${i}`}
          style={{
            left: `${i * 20 + Math.random() * 10}%`,
            bottom: -30,
          }}
          animate={{
            y: ['0vh', '-130vh'],
            x: [0, Math.sin(i * 2) * 100, 0],
            opacity: [0, 0.3, 0.4, 0.3, 0],
            scale: [0.5, 1, 1.2, 1, 0.5],
          }}
          transition={{
            duration: 18 + i * 2,
            delay: i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
  background: linear-gradient(
    180deg,
    rgba(240, 253, 255, 0.3) 0%,
    rgba(207, 250, 254, 0.2) 50%,
    rgba(165, 243, 252, 0.1) 100%
  );
`;

const Bubble = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.8),
    rgba(6, 182, 212, 0.4) 50%,
    rgba(14, 165, 233, 0.2) 100%
  );
  box-shadow:
    0 0 10px rgba(6, 182, 212, 0.4),
    inset -2px -2px 6px rgba(255, 255, 255, 0.6),
    inset 2px 2px 6px rgba(6, 182, 212, 0.3);
  backdrop-filter: blur(2px);
`;

const LargeBubble = styled(motion.div)`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 25% 25%,
    rgba(255, 255, 255, 0.6),
    rgba(6, 182, 212, 0.25) 40%,
    rgba(14, 165, 233, 0.15) 100%
  );
  box-shadow:
    0 0 20px rgba(6, 182, 212, 0.3),
    inset -3px -3px 8px rgba(255, 255, 255, 0.5),
    inset 3px 3px 8px rgba(6, 182, 212, 0.2);
  backdrop-filter: blur(3px);
`;
