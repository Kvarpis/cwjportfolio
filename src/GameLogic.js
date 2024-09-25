// src/GameLogic.js
import { useState } from 'react';

const useGameLogic = () => {
  const [score, setScore] = useState(0);

  const incrementScore = (amount) => {
    setScore((prevScore) => prevScore + amount);
  };

  return {
    score,
    incrementScore,
  };
};

export default useGameLogic;
