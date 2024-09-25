import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Fragment = ({ position, geometry, material, velocity, onRemove }) => {
  const fragmentRef = useRef();
  const velocityRef = useRef(new THREE.Vector3(...velocity));
  const rotationSpeed = useRef(new THREE.Vector3(
    Math.random() * 0.05,
    Math.random() * 0.05,
    Math.random() * 0.05
  ));

  const lifeDuration = 3 + Math.random(); // Random duration between 3-4 seconds
  const elapsedTime = useRef(0);

  useEffect(() => {
    return () => {
      if (fragmentRef.current && fragmentRef.current.geometry) {
        fragmentRef.current.geometry.dispose();
      }
      if (fragmentRef.current && fragmentRef.current.material) {
        fragmentRef.current.material.dispose();
      }
    };
  }, []);

  useFrame((state, delta) => {
    if (fragmentRef.current) {
      // Move the fragment
      fragmentRef.current.position.add(velocityRef.current.clone().multiplyScalar(delta));

      // Rotate the fragment
      fragmentRef.current.rotation.x += rotationSpeed.current.x;
      fragmentRef.current.rotation.y += rotationSpeed.current.y;
      fragmentRef.current.rotation.z += rotationSpeed.current.z;

      // Update elapsed time
      elapsedTime.current += delta;

      // Calculate opacity based on elapsed time
      const opacity = Math.max(0, 1 - (elapsedTime.current / lifeDuration));
      fragmentRef.current.material.opacity = opacity;

      // Remove fragment when it becomes fully transparent
      if (opacity <= 0) {
        onRemove();
      }
    }
  });

  return (
    <mesh
      ref={fragmentRef}
      position={position}
      geometry={geometry}
      material={material}
    />
  );
};

export default Fragment;