// src/components/FloatingScreenSpawner.jsx
import React, { useMemo } from 'react';
import FloatingScreen from './FloatingScreen';
import * as THREE from 'three';

const FloatingScreenSpawner = ({ count = 10, boundary = 500 }) => {
  const screens = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = THREE.MathUtils.randFloatSpread(boundary * 2);
      const y = THREE.MathUtils.randFloatSpread(boundary * 2);
      const z = THREE.MathUtils.randFloatSpread(boundary * 2);
      const url = 'https://yourwebsite.com'; // Replace with actual URL
      const texture = '/screens/example.png'; // Replace with actual texture path
      temp.push({ position: [x, y, z], url, texture, id: i });
    }
    return temp;
  }, [count, boundary]);

  return (
    <>
      {screens.map((screen) => (
        <FloatingScreen
          key={screen.id}
          position={screen.position}
          url={screen.url}
          texture={screen.texture}
          id={screen.id}
        />
      ))}
    </>
  );
};

export default FloatingScreenSpawner;
