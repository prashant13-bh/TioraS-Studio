"use client";

export default function Garment() {
  return (
    <mesh>
      <planeGeometry args={[3, 4, 64, 64]} />
      <meshStandardMaterial color="#111" />
    </mesh>
  );
}
