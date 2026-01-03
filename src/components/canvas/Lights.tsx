export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 5]} intensity={1} />
    </>
  );
}
