// src/Planet.jsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

const Planet = ({ position, size, screenPosition, screenSize, onClick, label }) => {
  const planetRef = useRef();

  return (
    <mesh
      ref={planetRef}
      position={position}
      scale={[size, size, size]}
      onClick={onClick}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="green" emissive="green" emissiveIntensity={0.2} />
      
      {/* Label */}
      <Html distanceFactor={10}>
        <div className="label">{label}</div>
      </Html>
    </mesh>
  );
};

export default Planet;
