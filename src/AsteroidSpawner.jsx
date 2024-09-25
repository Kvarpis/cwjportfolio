// src/components/AsteroidSpawner.jsx
import React from 'react';
import Asteroid from './Asteroid';

const AsteroidSpawner = ({ count = 50, boundary = 500 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => {
        const id = `asteroid-${index}-${Date.now()}`;
        const position = [
          (Math.random() - 0.5) * boundary,
          (Math.random() - 0.5) * boundary,
          (Math.random() - 0.5) * boundary,
        ];
        const size = Math.random() * 2 + 0.5; // Size between 0.5 and 2.5
        const speed = Math.random() * 0.002 + 0.001; // Speed between 0.001 and 0.003

        return <Asteroid key={id} id={id} position={position} size={size} speed={speed} />;
      })}
    </>
  );
};

export default AsteroidSpawner;
