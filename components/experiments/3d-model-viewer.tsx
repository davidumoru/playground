"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import type * as THREE from "three"

function Model() {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
    }
  })

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, 0]}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

export default function ModelViewer() {
  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Model />
        <Environment preset="studio" />
        <OrbitControls enableZoom={true} enablePan={false} minDistance={3} maxDistance={8} />
      </Canvas>
    </div>
  )
}
