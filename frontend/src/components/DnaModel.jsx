import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

const Model = () => {
  const { scene } = useGLTF('/imgvid/dna.glb'); 
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      // Rotating the model slowly
      modelRef.current.rotation.y += 0.003;
    }
  });

  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      scale={0.35} 
      rotation={[0.3, 0, 0.2]}
      position={[0, 0, 0]}
    />
  );
};

export default function DnaModel() {
  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', zIndex: 50, background: 'transparent' }}> 
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} alpha="true">
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <Environment preset="city" />
        <Model />
      </Canvas>
    </div>
  );
}
