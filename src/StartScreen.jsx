import React, { useState, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const StartScreen = ({ onStart }) => {
  const [targetPosition] = useState(new THREE.Vector3(0, 0, -10));
  const textRef = useRef();
  const { camera, mouse } = useThree();
  const [isHit, setIsHit] = useState(false);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position);
    }
  });

  const handleShoot = (event) => {
    event.stopPropagation();
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(textRef.current);

    if (intersects.length > 0) {
      setIsHit(true);
      setTimeout(() => {
        onStart();
      }, 1000);
    }
  };

  return (
    <group position={targetPosition}>
      <Text
        ref={textRef}
        color={isHit ? "red" : "white"}
        fontSize={1}
        maxWidth={10}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
        onClick={handleShoot}
      >
        {isHit ? "Loading..." : "Shoot here to start!"}
      </Text>
    </group>
  );
};

export default StartScreen;