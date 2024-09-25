// src/components/Background.jsx
import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Background = () => {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new THREE.CubeTextureLoader();
    loader.setPath('/skybox/');

    loader.load(
      ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'],
      (texture) => {
        // Remove encoding to avoid errors if sRGBEncoding is unavailable
        // texture.encoding = THREE.sRGBEncoding; // Removed
        scene.background = texture;
        console.log('Skybox loaded successfully');
      },
      undefined,
      (error) => {
        console.error('Error loading skybox:', error);
        scene.background = new THREE.Color('skyblue'); // Fallback color
      }
    );

    return () => {
      scene.background = null;
    };
  }, [scene]);

  return null;
};

export default Background;
