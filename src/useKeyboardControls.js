// src/useKeyboardControls.js
import { useState, useEffect } from 'react';

export const useKeyboardControls = () => {
  const [keysPressed, setKeysPressed] = useState({});

  const handleKeyDown = (e) => {
    setKeysPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
  };

  const handleKeyUp = (e) => {
    setKeysPressed((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return {
    moveLeft: keysPressed['arrowleft'] || keysPressed['a'],
    moveRight: keysPressed['arrowright'] || keysPressed['d'],
    moveUp: keysPressed['arrowup'] || keysPressed['w'],
    moveDown: keysPressed['arrowdown'] || keysPressed['s'],
    rollLeft: keysPressed['q'],
    rollRight: keysPressed['e'],
    throttleUp: keysPressed['shift'],
    throttleDown: keysPressed['ctrl'],
    shoot: keysPressed[' '], // Spacebar for shooting
  };
};
