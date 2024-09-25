// src/components/FloatingScreen.jsx
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const FloatingScreen = ({ position, size = [2, 1], url, texture, id }) => {
  const screenRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    // Name the screen for identification
    if (screenRef.current) {
      screenRef.current.name = `screen-${id}`;
      scene.add(screenRef.current);
    }

    return () => {
      if (screenRef.current) {
        scene.remove(screenRef.current);
      }
    };
  }, [id, scene]);

  useFrame(() => {
    if (screenRef.current) {
      // Optional: Add subtle floating animation
      screenRef.current.position.y += Math.sin(Date.now() * 0.001) * 0.01;
    }
  });

  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <mesh
      ref={screenRef}
      position={position}
      scale={size}
      onClick={handleClick}
      castShadow
      receiveShadow
    >
      <planeGeometry args={[1, 0.5]} />
      <meshStandardMaterial
        map={new THREE.TextureLoader().load(texture)} // Replace with your image
        transparent={true}
      />
    </mesh>
  );
};

export default FloatingScreen;
