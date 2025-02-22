/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.2 public/models/asteroid.glb -o src/Asteroidss.jsx -r public 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/models/asteroid.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.origin.geometry} material={materials.Material} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell.geometry} material={materials.Material} position={[-0.389, -0.343, -0.019]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell001.geometry} material={materials.Material} position={[-0.322, 0.414, 0.159]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell002.geometry} material={materials.Material} position={[0.562, -0.336, 0.061]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell003.geometry} material={materials.Material} position={[0.218, -0.305, 0.33]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell004.geometry} material={materials.Material} position={[0.39, 0.281, 0.1]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell005.geometry} material={materials.Material} position={[0.122, 0.567, 0.268]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell006.geometry} material={materials.Material} position={[0.028, 0.729, 0.017]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell007.geometry} material={materials.Material} position={[0.357, -0.074, -0.483]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell008.geometry} material={materials.Material} position={[-0.097, 0.174, -0.725]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell009.geometry} material={materials.Material} position={[-0.11, -0.199, -0.478]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell010.geometry} material={materials.Material} position={[0.627, 0.14, -0.108]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell011.geometry} material={materials.Material} position={[0.524, 0.037, 0.403]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell012.geometry} material={materials.Material} position={[-0.409, 0.343, -0.276]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell013.geometry} material={materials.Material} position={[0.013, 0.097, 0.597]} />
      <mesh geometry={nodes.Asteroid_Icosphere_cell014.geometry} material={materials.Material} position={[0.058, 0.542, -0.341]} />
    </group>
  )
}

useGLTF.preload('/models/asteroid.glb')
