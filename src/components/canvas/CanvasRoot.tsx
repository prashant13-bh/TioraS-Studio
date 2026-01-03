"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Experience from "./Experience";

export default function CanvasRoot() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 35 }}
      style={{ position: "fixed", inset: 0, zIndex: -1 }}
    >
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </Canvas>
  );
}
