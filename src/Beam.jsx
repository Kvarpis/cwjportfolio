// src/components/Beam.jsx
import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Beam = ({ position, direction, onHit, id }) => {
  const beamRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (beamRef.current) {
      beamRef.current.name = `beam-${id}`;
      scene.add(beamRef.current);
    }

    return () => {
      if (beamRef.current) {
        scene.remove(beamRef.current);
      }
    };
  }, [id, scene]);

  useFrame(() => {
    if (beamRef.current) {
      // Move the beam forward
      const moveDistance = 20 * 0.16; // Adjust speed as needed
      beamRef.current.position.x += direction[0] * moveDistance;
      beamRef.current.position.y += direction[1] * moveDistance;
      beamRef.current.position.z += direction[2] * moveDistance;

      // Optionally, implement beam lifespan or collision logic here
    }
  });

  return (
    <mesh ref={beamRef} position={position} castShadow receiveShadow>
      <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
      <meshStandardMaterial color="cyan" emissive="cyan" emissiveIntensity={1} />
    </mesh>
  );
};

export default Beam;
