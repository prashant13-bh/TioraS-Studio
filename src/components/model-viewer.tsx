'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';

// A stylized 3D T-Shirt-like shape using basic Three.js geometry
function TShirtModel({ color = '#ffffff' }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  const materialProps = {
    color: new THREE.Color(color),
    roughness: 0.8,
    metalness: 0.05,
  };

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={[0, 0, 0]} scale={1}>
        {/* Main Body - Torso */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2, 2.5, 0.6]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Left Sleeve */}
        <mesh position={[-1.4, 0.6, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <boxGeometry args={[1, 0.8, 0.5]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Right Sleeve */}
        <mesh position={[1.4, 0.6, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
          <boxGeometry args={[1, 0.8, 0.5]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Collar */}
        <mesh position={[0, 1.35, 0.1]} castShadow>
          <torusGeometry args={[0.35, 0.08, 8, 24, Math.PI]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.7} />
        </mesh>

        {/* Design Print Area Indicator */}
        <mesh position={[0, 0.2, 0.32]}>
          <planeGeometry args={[1.2, 1.2]} />
          <meshStandardMaterial
            color="#6c63ff"
            opacity={0.15}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </Float>
  );
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 rounded-2xl">
      <div className="text-center space-y-2">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Loading 3D Preview...</p>
      </div>
    </div>
  );
}

interface ModelViewerProps {
  color?: string;
  className?: string;
}

export default function ModelViewer({ color = '#ffffff', className = '' }: ModelViewerProps) {
  return (
    <div className={`w-full aspect-square rounded-2xl overflow-hidden border bg-gradient-to-b from-muted/30 to-background relative ${className}`}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          shadows
          camera={{ position: [0, 1, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-5, 3, -5]} intensity={0.3} />

          <TShirtModel color={color} />

          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} />
          <Environment preset="city" />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate
            autoRotateSpeed={1}
          />
        </Canvas>
      </Suspense>
      
      {/* Overlay Label */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded-full">
          3D Preview
        </span>
        <span className="text-[10px] text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded-full">
          Drag to rotate
        </span>
      </div>
    </div>
  );
}
