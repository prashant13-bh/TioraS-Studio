"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Garment from "./Garment";
import Needle from "./Needle";
import StitchThread from "./StitchThread";
import Lights from "./Lights";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const { camera } = useThree();

  useEffect(() => {
    gsap.to(camera.position, {
      z: 4,
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }, [camera]);

  return (
    <>
      <Lights />
      <Garment />
      <StitchThread />
      <Needle />
    </>
  );
}
