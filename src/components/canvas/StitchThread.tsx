"use client";

import * as THREE from "three";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StitchThread() {
  const meshRef = useRef<any>();

  useEffect(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1, 0.5, 0.02),
      new THREE.Vector3(-0.5, 0.2, 0.02),
      new THREE.Vector3(0, 0.4, 0.02),
      new THREE.Vector3(0.6, 0.1, 0.02)
    ]);

    const geometry = new THREE.TubeGeometry(curve, 200, 0.01, 8, false);
    geometry.setDrawRange(0, 0);

    meshRef.current.geometry = geometry;

    gsap.to(geometry.drawRange, {
      count: geometry.index!.count,
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }, []);

  return (
    <mesh ref={meshRef}>
      <meshStandardMaterial color="#e0c38c" />
    </mesh>
  );
}
