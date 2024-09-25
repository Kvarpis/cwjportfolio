// src/components/Nebula.jsx
import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const Nebula = ({ position = [0, 0, 0], scale = [100, 100, 100] }) => {
  const texture = useLoader(THREE.TextureLoader, '/skybox/negx.jpg'); // Ensure the path is correct

  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[50, 32, 32]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        transparent={true}
        opacity={0.5}
      />
    </mesh>
  );
};

export default Nebula;
