"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Float } from "@react-three/drei"
import type * as THREE from "three"

function Cube() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.7} roughness={0.2} />
      </mesh>
    </Float>
  )
}

export default function FloatingCube() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Cube />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}
