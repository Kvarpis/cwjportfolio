import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls } from './useKeyboardControls';
import Projectile from './Projectile';
import { playShootSound, playThrusterSound, stopThrusterSound, initializeSounds, cleanupSounds } from './SoundManager';
import * as THREE from 'three';
import { Trail, useGLTF } from '@react-three/drei';
import { useStore } from './store';
import FollowCamera from './FollowCamera';

const Plane = () => {
  const planeRef = useRef();
  const [modelLoaded, setModelLoaded] = useState(false);
  const [isThrottleUp, setIsThrottleUp] = useState(false);
  const { scene } = useThree();
  
  const [isAppearing, setIsAppearing] = useState(true);
  const [appearProgress, setAppearProgress] = useState(0);
  
  const { scene: planeScene } = useGLTF('/models/spaceship1.glb', true, 
    (error) => console.error('Error loading 3D model:', error)
  );

  const {
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    rollLeft,
    rollRight,
    throttleUp,
    throttleDown,
    shoot,
  } = useKeyboardControls();

  const [projectiles, setProjectiles] = useState([]);
  const [canShoot, setCanShoot] = useState(true);

  const rotationSpeed = 0.02;
  const maxSpeed = 1;
  const acceleration = 0.02;
  const deceleration = 0.01;
  const friction = 0.005;

  const [speed, setSpeed] = useState(0.3);
  const setGlobalSpeed = useStore((state) => state.setSpeed);

  const MIN_PITCH = -Math.PI / 4;
  const MAX_PITCH = Math.PI / 4;
  const MIN_ROLL = -Math.PI / 6;
  const MAX_ROLL = Math.PI / 6;

  const [targetRotation, setTargetRotation] = useState(new THREE.Euler());
  const [lastResetTime, setLastResetTime] = useState(0);
  const resetDelay = 5000;

  const [tiltAngle, setTiltAngle] = useState(0);
  const tiltSpeed = 0.15;
  const maxTiltAngle = Math.PI / 1;
  const springStrength = 0.4;

 // Particle system for teleportation effect
 const particleCount = 2000; // Increased particle count for a denser effect
 const teleportParticles = useMemo(() => {
  const temp = [];
  for (let i = 0; i < particleCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = Math.random() * 5 + 2; // Particles start further away
    temp.push({
      position: new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ),
      scale: Math.random() * 0.03 + 0.01,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      ),
    });
  }
  return temp;
}, []);

  // Particle system for thrusters
  const thrusterParticleCount = 300;
  const thrusterParticles = useMemo(() => {
    return Array.from({ length: thrusterParticleCount }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        Math.random() * 0.5 + 1
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        Math.random() * -0.3 - 0.2
      ),
      color: new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.8, 0.6),
      scale: Math.random() * 0.3 + 0.1,
      lifetime: 0,
      maxLifetime: Math.random() * 1 + 0.5
    }));
  }, []);

  const jetGeometry = useMemo(() => {
    const geometry = new THREE.ConeGeometry(0.2, 0.1, 8);
    geometry.rotateX(Math.PI / 2);
    return geometry;
  }, []);
  const jetMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.8 }), []);

  useEffect(() => {
    if (planeScene) {
      setModelLoaded(true);
      planeScene.rotation.order = 'YXZ';
      planeScene.rotation.y = -11;
      planeScene.rotation.x = 0;
      planeScene.rotation.z = 0;
      planeScene.position.set(0, 0, 0);
      planeScene.scale.set(1, 1, 1);
      planeScene.visible = false; // Hide the model initially
      planeScene.name = 'Plane';
    }
    initializeSounds();
    if (planeRef.current) {
      planeRef.current.rotation.order = 'YXZ';
    }
    return () => {
      cleanupSounds();
      stopThrusterSound();
    };
  }, [planeScene]);

  useFrame((state, delta) => {
    if (planeRef.current && modelLoaded) {
      const plane = planeRef.current;

      if (isAppearing) {
        setAppearProgress((prev) => Math.min(prev + delta * 1, 1)); // Even slower appearance
      
        // Update teleportation particles
        teleportParticles.forEach((particle, i) => {
          particle.position.add(particle.velocity);
          const targetPos = new THREE.Vector3(0, 0, 0);
          particle.position.lerp(targetPos, appearProgress * 0.05);
          particle.scale = Math.max(0.001, particle.scale - 0.0001); // Particles shrink as they converge
        });
      
        // Gradually reveal the plane model
        if (planeScene) {
          planeScene.visible = true;
          planeScene.scale.setScalar(appearProgress);
          
          // Adjust opacity of all materials in the plane model
          planeScene.traverse((child) => {
            if (child.isMesh && child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  mat.transparent = true;
                  mat.opacity = appearProgress;
                });
              } else {
                child.material.transparent = true;
                child.material.opacity = appearProgress;
              }
            }
          });
        }
      
        if (appearProgress >= 1) {
          setIsAppearing(false);
        }
        
      } else {
        // Normal flight controls and updates
        let targetTilt = 0;
        if (moveLeft) {
          setTargetRotation(current => new THREE.Euler(current.x, current.y + rotationSpeed, current.z));
          targetTilt = maxTiltAngle;
        }
        if (moveRight) {
          setTargetRotation(current => new THREE.Euler(current.x, current.y - rotationSpeed, current.z));
          targetTilt = -maxTiltAngle;
        }
        if (moveUp) setTargetRotation(current => new THREE.Euler(current.x + rotationSpeed, current.y, current.z));
        if (moveDown) setTargetRotation(current => new THREE.Euler(current.x - rotationSpeed, current.y, current.z));
        if (rollLeft) setTargetRotation(current => new THREE.Euler(current.x, current.y, current.z + rotationSpeed));
        if (rollRight) setTargetRotation(current => new THREE.Euler(current.x, current.y, current.z - rotationSpeed));

        const tiltDiff = targetTilt - tiltAngle;
        setTiltAngle(current => current + tiltDiff * tiltSpeed);
        setTiltAngle(current => current * (1 - springStrength));

        plane.rotation.x = THREE.MathUtils.lerp(plane.rotation.x, targetRotation.x, 0.1);
        plane.rotation.y = THREE.MathUtils.lerp(plane.rotation.y, targetRotation.y, 0.1);
        plane.rotation.z = THREE.MathUtils.lerp(plane.rotation.z, tiltAngle, 0.1);

        const now = Date.now();
        if (Math.abs(plane.rotation.z) > Math.PI / 2 && now - lastResetTime > resetDelay) {
          setTargetRotation(new THREE.Euler(0, plane.rotation.y, 0));
          setLastResetTime(now);
        }

        plane.rotation.z = THREE.MathUtils.clamp(plane.rotation.z, MIN_ROLL, MAX_ROLL);

        if (throttleUp) {
          setIsThrottleUp(true);
          if (speed < maxSpeed) {
            setSpeed((prev) => Math.min(prev + acceleration, maxSpeed));
          }
        } else {
          setIsThrottleUp(false);
          if (speed > 0) {
            setSpeed((prev) => Math.max(prev - (throttleDown ? deceleration : friction), 0));
          }
        }

        if (isThrottleUp) {
          playThrusterSound();
        } else {
          stopThrusterSound();
        }

        setGlobalSpeed(speed);

        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyEuler(plane.rotation);
        direction.normalize();

        plane.position.add(direction.clone().multiplyScalar(speed));

        const boundary = 500;
        const pos = plane.position;
        if (pos.x > boundary) pos.x = -boundary;
        if (pos.x < -boundary) pos.x = boundary;
        if (pos.z > boundary) pos.z = -boundary;
        if (pos.z < -boundary) pos.z = boundary;

        // Collision detection and other updates...

        // Update thruster particles
        thrusterParticles.forEach(particle => {
          particle.position.add(particle.velocity);
          particle.lifetime += delta;

          const pulseFactor = (Math.sin(particle.lifetime * 10) + 1) / 2;
          particle.scale = (Math.random() * 0.2 + 0.1) * (pulseFactor * 0.5 + 0.5);

          const hue = 0.6 + pulseFactor * 0.1;
          const lightness = 0.5 + pulseFactor * 0.3;
          particle.color.setHSL(hue, 0.8, lightness);

          if (particle.position.z < plane.position.z - 3 || particle.lifetime > particle.maxLifetime) {
            particle.position.set(
              plane.position.x + (Math.random() - 0.5) * 0.3,
              plane.position.y + (Math.random() - 0.5) * 0.3,
              plane.position.z + 1
            );
            particle.velocity.set(
              (Math.random() - 0.5) * 0.1,
              (Math.random() - 0.5) * 0.1,
              Math.random() * -0.3 - 0.2
            );
            particle.lifetime = 0;
            particle.maxLifetime = Math.random() * 1 + 0.5;
          }
        });
      }
    }

    // Handle Projectile Shooting
    if (shoot && canShoot && !isAppearing) {
      if (planeRef.current) {
        const plane = planeRef.current;
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyEuler(plane.rotation);
        direction.normalize();

        const projectilePosition = plane.position.clone().add(direction.clone().multiplyScalar(1));

        const id = Date.now();

        const newProjectile = {
          id,
          position: [projectilePosition.x, projectilePosition.y, projectilePosition.z],
          direction: [direction.x, direction.y, direction.z],
        };

        const MAX_PROJECTILES = 50;
        if (projectiles.length < MAX_PROJECTILES) {
          setProjectiles((prev) => [...prev, newProjectile]);
        }

        playShootSound();
        setCanShoot(false);
        setTimeout(() => setCanShoot(true), 500);
      }
    }

    // Clean up projectiles
    setProjectiles((prev) => prev.filter((proj) => !proj.removed));
  });

  const removeProjectile = (id) => {
    setProjectiles((prev) =>
      prev.map((proj) =>
        proj.id === id ? { ...proj, removed: true } : proj
      )
    );
  };

  return (
    <>
      <group ref={planeRef} position={[0, 0, 0]} scale={[2, 2, 2]}>
        {modelLoaded && (
          <primitive object={planeScene} />
        )}
        
        {/* Teleportation particles */}
        {isAppearing && teleportParticles.map((particle, index) => (
        <mesh key={`teleport-${index}`} position={particle.position} scale={[particle.scale, particle.scale, particle.scale]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={0x00ffff} transparent opacity={0.6 * (1 - appearProgress)} />
        </mesh>
        ))}

        {/* Thruster particles */}
        {!isAppearing && thrusterParticles.map((particle, index) => (
          <mesh 
            key={`thruster-${index}`}
            position={particle.position} 
            scale={[particle.scale, particle.scale, particle.scale]}
            geometry={jetGeometry}
            material={jetMaterial}
          >
            <meshBasicMaterial color={particle.color} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      {/* Engine Trail */}
      {!isAppearing && (
        <Trail
          width={0.2}
          length={5}
          color="orange"
          attenuation={(t) => t * t}
        >
          <mesh position={[0, 0, 1]} scale={[0.1, 0.1, 0.1]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color="orange" />
          </mesh>
        </Trail>
      )}

      {/* Render Projectiles */}
      {projectiles.map((proj) => (
        <Projectile
          key={proj.id}
          id={proj.id}
          position={proj.position}
          direction={proj.direction}
          onRemove={removeProjectile}
        />
      ))}

      {/* Follow Camera */}
      <FollowCamera planeRef={planeRef} />
    </>
  );
};

export default Plane;