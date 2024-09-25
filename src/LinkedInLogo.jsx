// src/components/LinkedInLogo.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from './store'; // Import the store to update global state

const LinkedInLogo = ({ position = [0, 0, 0], scale = [9, 9, 9], url = 'https://www.linkedin.com/in/chriswillyjensen/' }) => {
  const logoRef = useRef();
  const { scene } = useGLTF('/models/linkedin-logo.glb'); // Ensure correct path


  // State to manage cooldown
  const [canBeShot, setCanBeShot] = useState(true);
  const cooldownRef = useRef(null); // To store the timeout ID

  useFrame(() => {
    if (logoRef.current) {
      // Spin the logo
      logoRef.current.rotation.y += 0.0;

      // Glowing effect: traverse all materials and adjust emissive intensity
      logoRef.current.traverse((child) => {
        if (child.isMesh && child.material && child.material.emissive) {
          // Optionally, reduce emissive intensity during cooldown for visual feedback
          const emissiveBase = 0.9;
          const emissiveVariation = Math.sin(Date.now() * 0.005) * 0.5;
          child.material.emissiveIntensity = canBeShot
            ? emissiveBase + emissiveVariation
            : emissiveBase * 0.5 + emissiveVariation * 0.5;
        }
      });
    }
  });

  // Assign a name and collision handler for collision detection
  useEffect(() => {
    if (logoRef.current) {
      logoRef.current.name = 'linkedin-logo';

      // Traverse all child meshes and assign the handleClick to userData.onClick
      logoRef.current.traverse((child) => {
        if (child.isMesh) {
          child.userData.onClick = handleClick;
        }
      });
    }

    // Cleanup timeout on unmount
    return () => {
      if (cooldownRef.current) {
        clearTimeout(cooldownRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (!canBeShot) {
      console.log('LinkedIn logo is on cooldown.');
      return; // Prevent action if on cooldown
    }

    // Trigger the desired action
    window.open(url, '_blank');
    console.log('LinkedIn logo clicked! Opening URL.');

    // Initiate cooldown
    setCanBeShot(false);
    cooldownRef.current = setTimeout(() => {
      setCanBeShot(true);
      console.log('LinkedIn logo cooldown ended. Spaceship can be controlled again.');
    }, 30000); // 30,000 milliseconds = 30 seconds
  };

  return (
    <primitive
      ref={logoRef}
      object={scene}
      position={position}
      scale={scale}
      onClick={handleClick} // Retain for mouse interactions
      castShadow
      receiveShadow
    />
  );
};

export default LinkedInLogo;
