"use client"

import { useState } from 'react';

import CaseQueryForm from '@/components/case-query-form';
import GandhiModel from '@/components/courtroom-scene';
import Navigation from '@/components/navigation';
import SpeechSubtitle from '@/components/speech-subtitle';
import { Toaster } from '@/components/ui/toaster';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

export default function Home() {
  const [speaking, setSpeaking] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState("Welcome to ApnaWakeel.ai - Your AI Legal Advisor");

  return (
    <div className="relative bg-cover bg-center w-full h-screen"
      style={{ backgroundImage: "url('/courtroom-bg.png')" }}
    >
      <Navigation />
      
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={2} />
        <directionalLight position={[2, 2, 5]} />
        <GandhiModel speaking={speaking} />
        {/* <OrbitControls /> */}
      </Canvas>

      {/* Speech Subtitle Component */}
      <SpeechSubtitle 
        text={currentSubtitle}
        isVisible={true}
      />

      {/* Form positioned at bottom */}
      <div className="right-0 bottom-0 left-0 absolute bg-gradient-to-t from-black/80 to-transparent p-6">
        <CaseQueryForm setSpeaking={setSpeaking} />
      </div>

      <Toaster />
    </div>
  )
}