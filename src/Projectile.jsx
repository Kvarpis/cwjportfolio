import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Projectile = ({ id, position, direction, onRemove }) => {
  const projectileRef = useRef();
  const glowRef = useRef();
  const particlesRef = useRef();
  const { scene } = useThree();

  const normalizedDirection = useMemo(() => {
    const dir = new THREE.Vector3(...direction);
    return dir.normalize();
  }, [direction]);

  const raycaster = useRef(new THREE.Raycaster());

  // Create particle positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(300);
    for (let i = 0; i < 300; i += 3) {
      positions[i] = (Math.random() - 0.5) * 0.5;
      positions[i + 1] = (Math.random() - 0.5) * 0.5;
      positions[i + 2] = (Math.random() - 0.5) * 5; // Spread along the beam
    }
    return positions;
  }, []);

  useEffect(() => {
    if (projectileRef.current) {
      projectileRef.current.name = `projectile-${id}`;
      scene.add(projectileRef.current);
    }

    return () => {
      if (projectileRef.current) {
        scene.remove(projectileRef.current);
      }
    };
  }, [id, scene]);

  useFrame((state, delta) => {
    if (projectileRef.current) {
      const speed = 1000;
      const moveDistance = speed * delta;
      projectileRef.current.position.addScaledVector(normalizedDirection, moveDistance);

      // Rotate the glow effect
      if (glowRef.current) {
        glowRef.current.rotation.z += delta * 2;
      }

      // Update particles
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 2] -= delta * 10; // Move particles along the beam
          if (positions[i + 2] < -5) positions[i + 2] = 5; // Reset particle position
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      raycaster.current.set(projectileRef.current.position, normalizedDirection);
      raycaster.current.far = moveDistance;

      const intersects = raycaster.current.intersectObjects(scene.children, true)
        .filter(intersect => intersect.object !== projectileRef.current);

      if (intersects.length > 0) {
        const firstIntersect = intersects[0].object;
        if (firstIntersect.userData) {
          if (typeof firstIntersect.userData.onClick === 'function') {
            firstIntersect.userData.onClick();
          }
          if (typeof firstIntersect.userData.setHit === 'function') {
            firstIntersect.userData.setHit();
          }
        }
        onRemove(id);
      }

      const boundary = 1000;
      const pos = projectileRef.current.position;
      if (Math.abs(pos.x) > boundary || Math.abs(pos.y) > boundary || Math.abs(pos.z) > boundary) {
        onRemove(id);
      }
    }
  });

  return (
    <group ref={projectileRef} position={position}>
      {/* Main laser beam */}
      <mesh>
        <sphereGeometry args={[0.5, 0.5, 10, 8]} />
        <meshBasicMaterial color="#00ff00" transparent opacity={0.7} />
      </mesh>
      
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.2, 0.2, 10, 16]} />
        <shaderMaterial
          transparent
          uniforms={{
            color: { value: new THREE.Color(0x00ff00) },
          }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 color;
            varying vec2 vUv;
            void main() {
              float strength = distance(vUv, vec2(0.5));
              strength = 1.0 - strength;
              strength = pow(strength, 3.0);
              gl_FragColor = vec4(color, strength * 0.5);
            }
          `}
        />
      </mesh>
      
      {/* Particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={50}
            array={particlePositions}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#00ff00"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

export default Projectile;