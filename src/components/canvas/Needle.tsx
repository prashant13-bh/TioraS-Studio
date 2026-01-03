"use client";

import * as THREE from "three";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Needle() {
  const needle = useRef<any>();

  useEffect(() => {
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1, 0.5, 0.1),
      new THREE.Vector3(-0.5, 0.2, 0.1),
      new THREE.Vector3(0, 0.4, 0.1),
      new THREE.Vector3(0.6, 0.1, 0.1)
    ]);

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const point = path.getPoint(self.progress);
        needle.current.position.copy(point);
      }
    });
  }, []);

  return (
    <mesh ref={needle}>
      <cylinderGeometry args={[0.02, 0.02, 1]} />
      <meshStandardMaterial color="#ccc" />
    </mesh>
  );
}
