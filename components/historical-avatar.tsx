"use client"

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface HistoricalAvatarProps {
  figureId: string;
  speaking: boolean;
}

// Avatar configurations for different historical figures
const avatarConfigs = {
  'ashoka': {
    color: '#8B4513', // Brown for ancient emperor
    scale: 1.0,
    position: [0, -0.5, 0]
  },
  'akbar': {
    color: '#4A5568', // Gray for Mughal emperor
    scale: 1.1,
    position: [0, -0.6, 0]
  },
  'rani-lakshmibai': {
    color: '#E53E3E', // Red for warrior queen
    scale: 0.9,
    position: [0, -0.4, 0]
  },
  'subhas-chandra-bose': {
    color: '#2D3748', // Dark gray for modern leader
    scale: 1.0,
    position: [0, -0.5, 0]
  }
};

export default function HistoricalAvatar({ figureId, speaking }: HistoricalAvatarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const eyesRef = useRef<THREE.Group>(null);
  
  const config = avatarConfigs[figureId as keyof typeof avatarConfigs] || avatarConfigs['ashoka'];

  // Blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      if (eyesRef.current) {
        eyesRef.current.scale.y = 0.1;
        setTimeout(() => {
          if (eyesRef.current) {
            eyesRef.current.scale.y = 1;
          }
        }, 150);
      }
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Speaking animation
  useFrame((state) => {
    if (!meshRef.current || !headRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Gentle breathing animation
    meshRef.current.scale.y = 1 + Math.sin(time * 2) * 0.02;
    
    // Head movement
    headRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    headRef.current.rotation.x = Math.sin(time * 0.3) * 0.05;
    
    // Speaking animation - mouth movement
    if (speaking && headRef.current.children.length > 0) {
      const mouth = headRef.current.children.find(child => child.name === 'mouth') as THREE.Mesh;
      if (mouth) {
        mouth.scale.y = 1 + Math.sin(time * 8) * 0.3;
      }
    }
  });

  return (
    <group position={config.position} scale={config.scale}>
      {/* Main Body */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 1.2, 2.5, 8]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
      
      {/* Head */}
      <group ref={headRef} position={[0, 1.8, 0]}>
        {/* Head Sphere */}
        <mesh>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#FDBCB4" />
        </mesh>
        
        {/* Eyes */}
        <group ref={eyesRef} position={[0, 0.1, 0.4]}>
          <mesh position={[-0.2, 0, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.2, 0, 0]}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
        
        {/* Nose */}
        <mesh position={[0, -0.1, 0.5]}>
          <coneGeometry args={[0.05, 0.15, 6]} />
          <meshStandardMaterial color="#FDBCB4" />
        </mesh>
        
        {/* Mouth */}
        <mesh name="mouth" position={[0, -0.3, 0.4]}>
          <sphereGeometry args={[0.1, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>
        
        {/* Hair/Crown */}
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.65, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#4A5568" />
        </mesh>
      </group>
      
      {/* Arms */}
      <mesh position={[-1.2, 0.5, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.2, 0.25, 1.5, 8]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
      <mesh position={[1.2, 0.5, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.2, 0.25, 1.5, 8]} />
        <meshStandardMaterial color={config.color} />
      </mesh>
      
      {/* Hands */}
      <mesh position={[-1.5, -0.3, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color="#FDBCB4" />
      </mesh>
      <mesh position={[1.5, -0.3, 0]}>
        <sphereGeometry args={[0.25, 8, 8]} />
        <meshStandardMaterial color="#FDBCB4" />
      </mesh>
      
      {/* Decorative Elements based on figure */}
      {figureId === 'ashoka' && (
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.3, 6]} />
          <meshStandardMaterial color="#FFD700" />
        </mesh>
      )}
      
      {figureId === 'akbar' && (
        <mesh position={[0, 2.3, 0]}>
          <coneGeometry args={[0.3, 0.4, 8]} />
          <meshStandardMaterial color="#4A5568" />
        </mesh>
      )}
      
      {figureId === 'rani-lakshmibai' && (
        <>
          <mesh position={[-0.8, 0.8, 0]} rotation={[0, 0, -0.5]}>
            <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[-1.3, 1.4, 0]}>
            <coneGeometry args={[0.1, 0.3, 6]} />
            <meshStandardMaterial color="#C0C0C0" />
          </mesh>
        </>
      )}
      
      {figureId === 'subhas-chandra-bose' && (
        <mesh position={[0, 2.1, 0.3]}>
          <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      )}
    </group>
  );
}