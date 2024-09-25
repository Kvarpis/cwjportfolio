// src/FollowCamera.jsx
import React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const FollowCamera = ({ planeRef }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (planeRef.current) {
      const plane = planeRef.current;

      // Define the offset (relative to plane's local space)
      const offset = new THREE.Vector3(0, 2, 10); // Increased Z for a wider view

      // Apply plane's rotation to the offset
      const rotatedOffset = offset.applyQuaternion(plane.quaternion);

      // Compute desired camera position
      const desiredPosition = plane.position.clone().add(rotatedOffset);

      // Smoothly interpolate camera position
      camera.position.lerp(desiredPosition, 0.1);

      // Make the camera look at the plane
      camera.lookAt(plane.position);

      // Log positions for debugging
      console.log('Camera Position:', camera.position);
      console.log('Plane Position:', plane.position);
    }
  });

  return null;
};

export default FollowCamera;
