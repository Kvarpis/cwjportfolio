// src/AxesHelper.jsx
import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { AxesHelper as ThreeAxesHelper } from 'three';

const Axes = () => {
  const { scene } = useThree();

  useEffect(() => {
    const axes = new ThreeAxesHelper(50); // Length of the axes lines
    scene.add(axes);
    return () => {
      scene.remove(axes);
    };
  }, [scene]);

  return null;
};

export default Axes;
