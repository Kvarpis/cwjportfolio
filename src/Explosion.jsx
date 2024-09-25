// src/components/Explosion.jsx
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

const Explosion = ({ position }) => {
  const explosionRef = useRef();
  const [active, setActive] = useState(true);
  
  useFrame((state, delta) => {
    if (explosionRef.current) {
      // Expand the explosion
      explosionRef.current.scale.x += delta * 5;
      explosionRef.current.scale.y += delta * 5;
      explosionRef.current.scale.z += delta * 5;
      
      // Fade out the explosion
      explosionRef.current.material.opacity -= delta * 2;
      
      // Deactivate explosion after it becomes fully transparent
      if (explosionRef.current.material.opacity <= 0) {
        setActive(false);
      }
    }
  });

  // Remove the explosion from the scene after it's inactive
  if (!active) return null;

  return (
    <mesh position={position} ref={explosionRef}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="orange"
        emissive="yellow"
        emissiveIntensity={1}
        transparent
        opacity={1}
        depthWrite={false}
      />
    </mesh>
  );
};

export default Explosion;
