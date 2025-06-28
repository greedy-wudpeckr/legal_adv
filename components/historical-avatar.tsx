"use client";

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

interface HistoricalAvatarProps {
  figureId: string;
}

const avatarConfigs = {
  'ashoka': {
    scale: 1.5,
    position: [0, 0, 0]
  },
  'akbar': {
    scale: 1.1,
    position: [0, -0.6, 0]
  },
  'rani-lakshmibai': {
    scale: 0.9,
    position: [0, -0.4, 0]
  },
  'subhas-chandra-bose': {
    scale: 1.0,
    position: [0, -0.5, 0]
  }
};

export default function HistoricalAvatar({ figureId }: HistoricalAvatarProps) {
  const config = avatarConfigs[figureId as keyof typeof avatarConfigs] || avatarConfigs['ashoka'];
  const modelPath = useMemo(() => `/models/${figureId}.glb`, [figureId]);
  const { scene } = useGLTF(modelPath);

  return (
    <group scale={config.scale} position={config.position as [number, number, number]}>
      <primitive object={scene} />
    </group>
  );
}