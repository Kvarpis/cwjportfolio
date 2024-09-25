import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import Game from './Game';
import { OrbitControls } from '@react-three/drei';
import Score from './Score';
import GameOverlay from './GameOverlay';
import * as THREE from 'three';
import { initializeSounds, playBackgroundSound } from './SoundManager';

const Home = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleGameStart = useCallback(() => {
    console.log("Game fully loaded");
    initializeSounds();
    playBackgroundSound();
    setGameStarted(true);
  }, []);

  const handleLoadingProgress = useCallback((progress) => {
    setLoadingProgress(progress);
  }, []);

  return (
    <>
      {!gameStarted && (
        <GameOverlay 
          onStart={handleGameStart} 
          onProgress={handleLoadingProgress}
          setGameStarted={setGameStarted}
        />
      )}
      {gameStarted && <Score />}
      <Canvas
        shadows
        style={{ width: '100vw', height: '100vh' }}
        camera={{ position: [0, 5, 15], fov: 60, far: 10000 }}
        gl={{ shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap } }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight 
          position={[-5, 5, -5]} 
          intensity={0.8} 
          castShadow
        />
        <Game loadingProgress={loadingProgress} />
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default Home;