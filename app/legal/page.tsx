"use client"

import { useState } from 'react';
import CaseQueryForm from '@/components/case-query-form';
import GandhiModel from '@/components/courtroom-scene';
import SharedNavigation from '@/components/shared-navigation';
import { Toaster } from '@/components/ui/toaster';
import { Canvas } from '@react-three/fiber';

export default function LegalHome() {
  const [speaking, setSpeaking] = useState(false);

  return (
    <div className="relative overflow-hidden bg-cover bg-center w-full h-screen" style={{ backgroundImage: "url('/courtroom-bg.png')" }}>
      <SharedNavigation 
        platform="apnawaqeel"
        breadcrumbs={[
          { label: 'Legal Education', href: '/legal' }
        ]}
      />

      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={2} />
        <directionalLight position={[2, 2, 5]} />
        <GandhiModel speaking={speaking} />
      </Canvas>

      {/* Form positioned at bottom */}
      <div className="right-0 bottom-0 left-0 absolute bg-gradient-to-t from-black/80 to-transparent p-6">
        <CaseQueryForm setSpeaking={setSpeaking} />
      </div>

      <Toaster />
    </div>
  )
}