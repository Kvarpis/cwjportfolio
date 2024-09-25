import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import Plane from './Plane';
import AsteroidSpawner from './AsteroidSpawner';
import CollisionManager from './CollisionManager';
import Stars from './Stars';
import Nebula from './Nebula';
import DynamicLights from './DynamicLights';
import ProjectScreensManager from './ProjectScreensManager';
import Background from './Background';
import LinkedInLogo from './LinkedInLogo';
import MobileControls from './MobileControls';

const Game = ({ loadingProgress }) => {
  const planeRef = useRef();
  const asteroidSpawnerRef = useRef();
  const [isMobile, setIsMobile] = useState(false);
  const [isThrottling, setIsThrottling] = useState(false);

  const [gameElements, setGameElements] = useState({
    background: false,
    stars: false,
    nebula: false,
    lights: false,
    asteroids: false,
    projectScreens: false,
    logo: false,
    plane: false,
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const newElements = { ...gameElements };
    if (loadingProgress >= 20) newElements.background = true;
    if (loadingProgress >= 30) newElements.stars = true;
    if (loadingProgress >= 40) newElements.nebula = true;
    if (loadingProgress >= 50) newElements.lights = true;
    if (loadingProgress >= 60) newElements.asteroids = true;
    if (loadingProgress >= 70) newElements.projectScreens = true;
    if (loadingProgress >= 80) newElements.logo = true;
    if (loadingProgress >= 100) newElements.plane = true;
    setGameElements(newElements);
  }, [loadingProgress]);

  const handleShoot = () => {
    if (planeRef.current && planeRef.current.shoot) {
      planeRef.current.shoot();
    }
  };

  const handleThrottle = (isActive) => {
    setIsThrottling(isActive);
  };

  useFrame((state, delta) => {
    if (planeRef.current) {
      if (isThrottling && planeRef.current.throttleUp) {
        planeRef.current.throttleUp();
      } else if (planeRef.current.throttleDown) {
        planeRef.current.throttleDown();
      }
    }
    // Other frame updates...
  });

  const memoizedElements = useMemo(() => ({
    background: <Background />,
    stars: <Stars count={1000} radius={500} />,
    nebula: <Nebula position={[0, -50, -100]} scale={[200, 200, 200]} />,
    lights: <DynamicLights />,
    asteroids: <AsteroidSpawner ref={asteroidSpawnerRef} count={75} boundary={500} />,
    projectScreens: <ProjectScreensManager />,
    logo: <LinkedInLogo position={[50, 0, -100]} scale={[9, 9, 9]} />,
    plane: <Plane ref={planeRef} />,
  }), []);

  return (
    <>
      {gameElements.background && memoizedElements.background}
      {gameElements.stars && memoizedElements.stars}
      {gameElements.nebula && memoizedElements.nebula}
      {gameElements.lights && memoizedElements.lights}
      {gameElements.asteroids && memoizedElements.asteroids}
      {gameElements.projectScreens && memoizedElements.projectScreens}
      {gameElements.logo && memoizedElements.logo}
      {gameElements.plane && memoizedElements.plane}
      <CollisionManager />
      {isMobile && <MobileControls onShoot={handleShoot} onThrottle={handleThrottle} />}
    </>
  );
};

export default Game;