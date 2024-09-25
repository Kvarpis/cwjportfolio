import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const ProjectScreen = ({ position, onHit, projectData, index }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Load project image
  const texture = useLoader(THREE.TextureLoader, projectData.imageUrl);

  // Holographic effect shader
  const holographicMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      baseTexture: { value: texture },
      tint: { value: new THREE.Color(0x00ffff) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform sampler2D baseTexture;
      uniform vec3 tint;
      varying vec2 vUv;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }
      
      void main() {
        vec2 uv = vUv;
        
        // Subtle distortion
        uv += 0.002 * vec2(sin(uv.y * 100.0 + time), cos(uv.x * 100.0 + time));
        
        vec4 texColor = texture2D(baseTexture, uv);
        
        // Scanline effect
        float scanline = sin(vUv.y * 800.0 + time * 5.0) * 0.02 + 0.98;
        
        // Flicker effect
        float flicker = 0.95 + 0.05 * random(vec2(time, 0.0));
        
        vec3 holographicColor = mix(texColor.rgb, tint, 0.2) * scanline * flicker;
        gl_FragColor = vec4(holographicColor, texColor.a * 0.9);
      }
    `,
    transparent: true,
  }), [texture]);

  useFrame((state) => {
    holographicMaterial.uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <group position={position} name={`project-screen-${index}`}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onHit(projectData.url)}
        userData={{ url: projectData.url }}
      >
        <planeGeometry args={[21, 9]} /> {/* 16:9 aspect ratio */}
        <primitive object={holographicMaterial} />
      </mesh>
      {hovered && (
        <Html position={[0, -5, 0]}>
          <div style={{ background: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px', borderRadius: '5px', whiteSpace: 'nowrap' }}>
            <h3>{projectData.title}</h3>
          </div>
        </Html>
      )}
    </group>
  );
};

export default ProjectScreen;