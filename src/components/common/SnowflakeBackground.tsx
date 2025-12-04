import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

/**
 * 눈송이 배경 애니메이션 컴포넌트
 * 화면에 떨어지는 눈송이 효과를 제공
 */
export const SnowflakeBackground: React.FC = () => {
  interface Snowflake {
    id: number;
    x: number;
    size: number;
    duration: number;
    delay: number;
  }
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = [];
    
    // 50개의 랜덤 눈송이 생성
    for (let i = 0; i < 50; i++) {
      flakes.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 10 + 6,
        duration: Math.random() * 8 + 8,
        delay: Math.random() * 8
      });
    }
    
    setSnowflakes(flakes);
  }, []);

  return (
    <Container>
      {snowflakes.map((flake) => (
        <Snowflake
          key={flake.id}
          style={{
            left: `${flake.x}%`,
            width: flake.size,
            height: flake.size,
            top: -20
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, Math.sin(flake.id) * 100, 0],
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
`;

const Snowflake = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 20px rgba(186, 230, 253, 0.5);
`;
