// src/components/DynamicLights.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DynamicLights = () => {
  const lightRef = useRef();

  useFrame(({ clock }) => {
    if (lightRef.current) {
      const t = clock.getElapsedTime();
      lightRef.current.position.x = 10 * Math.sin(t);
      lightRef.current.position.z = 10 * Math.cos(t);
    }
  });

  return (
    <pointLight
      ref={lightRef}
      color="white"
      intensity={1}
      distance={100}
      castShadow
    />
  );
};

export default DynamicLights;
