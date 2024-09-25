import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { Model } from './Model';
import * as THREE from 'three';
import Fragment from './Fragment';
import { AudioLoader } from 'three';

const Asteroid = ({ position, size = 1, speed = 0.001, id }) => {
  const asteroidRef = useRef();
  const [health, setHealth] = useState(1);
  const [destroyed, setDestroyed] = useState(false);
  const [fragments, setFragments] = useState([]);

  const explosionSound = useMemo(() => {
    const listener = new THREE.AudioListener();
    const sound = new THREE.PositionalAudio(listener);
    new AudioLoader().load('/sounds/explosion.mp3', (buffer) => {
      sound.setBuffer(buffer);
      sound.setRefDistance(20);
      sound.setVolume(2);
    });
    return sound;
  }, []);

  const rotationSpeed = useMemo(() => ({
    x: (Math.random() * speed * 0.5) + (speed * 0.1),
    y: (Math.random() * speed * 0.5) + (speed * 0.1),
    z: (Math.random() * speed * 0.5) + (speed * 0.1),
  }), [speed]);

  useFrame(() => {
    if (asteroidRef.current && !destroyed) {
      asteroidRef.current.rotation.x += rotationSpeed.x;
      asteroidRef.current.rotation.y += rotationSpeed.y;
      asteroidRef.current.rotation.z += rotationSpeed.z;
    }
  });

  const handleHit = () => {
    setHealth(prev => {
      const newHealth = prev - 1;
      if (newHealth <= 0) {
        setDestroyed(true);
        generateFragments();
      }
      return newHealth;
    });
  };

  useEffect(() => {
    if (asteroidRef.current) {
      asteroidRef.current.userData.setHit = handleHit;
      asteroidRef.current.userData.isAsteroid = true;

      const boundingBox = new THREE.Box3().setFromObject(asteroidRef.current);
      const boundingSphere = new THREE.Sphere();
      boundingBox.getBoundingSphere(boundingSphere);
      asteroidRef.current.userData.boundingRadius = boundingSphere.radius * size;
    }
  }, [handleHit, size, id]);

  const generateFragments = () => {
    if (!asteroidRef.current) return;

    explosionSound.play();

    const newFragments = [];
    asteroidRef.current.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const worldPosition = new THREE.Vector3();
        child.getWorldPosition(worldPosition);

        const fragmentGeometry = child.geometry.clone();
        const fragmentMaterial = child.material.clone();

        fragmentMaterial.transparent = true;
        fragmentMaterial.opacity = 1;

        const direction = worldPosition.clone().sub(new THREE.Vector3(...position)).normalize();
        const speed = 0.1 + Math.random() * 0.2;
        const fragmentVelocity = direction.multiplyScalar(speed);

        newFragments.push({
          position: worldPosition.toArray(),
          geometry: fragmentGeometry,
          material: fragmentMaterial,
          velocity: fragmentVelocity.toArray(),
        });
      }
    });

    setFragments(newFragments);
  };

  const removeFragment = (index) => {
    setFragments(prevFragments => prevFragments.filter((_, i) => i !== index));
  };

  return (
    <>
      {!destroyed ? (
        <group
          ref={asteroidRef}
          position={position}
          scale={[size, size, size]}
          castShadow
          receiveShadow
          name={`asteroid-${id}`}
        >
          <Model />
          <primitive object={explosionSound} />
        </group>
      ) : (
        fragments.map((frag, index) => (
          <Fragment
            key={`fragment-${id}-${index}`}
            position={frag.position}
            geometry={frag.geometry}
            material={frag.material}
            velocity={frag.velocity}
            onRemove={() => removeFragment(index)}
          />
        ))
      )}
    </>
  );
};

export default Asteroid;