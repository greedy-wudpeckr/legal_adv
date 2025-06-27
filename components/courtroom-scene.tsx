import { useRef } from 'react';

import * as THREE from 'three';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

interface GandhiModelProps {
  speaking: boolean;
}

export default function GandhiModel({ speaking }: GandhiModelProps) {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/avatar.glb');

  useFrame(() => {
    if (!modelRef.current || !speaking) return;

    const time = performance.now() * 0.005;
    const value = Math.abs(Math.sin(time)) * 0.9;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;

        // Animate only head and teeth
        if (
          (mesh.name === 'Wolf3D_Head' || mesh.name === 'Wolf3D_Teeth') &&
          mesh.morphTargetInfluences &&
          mesh.morphTargetDictionary
        ) {
          const index = mesh.morphTargetDictionary['mouthOpen'];
          if (index !== undefined) {
            mesh.morphTargetInfluences[index] = value;
          }
        }
      }
    });
  });

  return <primitive ref={modelRef} object={scene} scale={1} position={[0, -0.4, 2]} />;
}