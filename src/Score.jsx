// src/components/Score.jsx
import React from 'react';
import { useStore } from './store';

const Score = () => {
  const score = useStore((state) => state.score);

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '20px',
      color: 'white',
      fontSize: '24px',
      zIndex: 1,
      fontFamily: 'Arial, sans-serif',
    }}>
      Score: {score}
    </div>
  );
};

export default Score;
