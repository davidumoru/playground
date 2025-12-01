"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { RotateCw, Grid3x3, Cylinder, Waves, Orbit } from "lucide-react"
import * as THREE from "three"

const images = [
  "https://images.unsplash.com/photo-1762204296168-e1b7675f6ae2?q=80&w=1452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1738777152204-0ec9ab3502cc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1516041774595-cc1b7969480c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1751315574558-d185d266b16d?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1675635656232-71d47b804a19?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1760978631985-590e3b5f4057?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1758120204495-e6af4c19668b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDl8aVVJc25WdGpCMFl8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1759697518276-acb067d0872e?q=80&w=1655&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1760605193118-a3536e1eea61?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1761478618389-f48b4b981d29?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1640301998084-c9b80babd03c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1556139918-9b92e8b00105?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE1fGlVSXNuVnRqQjBZfHxlbnwwfHx8fHw%3D",
  "https://plus.unsplash.com/premium_photo-1675874973165-2c875c9ed382?q=80&w=702&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1673726734894-73d068cb9454?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE3fGlVSXNuVnRqQjBZfHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1750672581729-a6da4cb5a0eb?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1761319480254-898e98443e4a?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1525019167271-be1690bb034f?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1669234305308-c2658f1fbf12?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1758220829551-6d02d06798c7?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1744646377302-1feb4ab3e9b9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1746420146061-0256c1335fe4?q=80&w=734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1637083041731-9028937c64d4?q=80&w=1398&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1747253590504-3a17cd5a4f9c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1757880555544-ac0bf6f9925a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1762204296168-e1b7675f6ae2?q=80&w=1452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1738777152204-0ec9ab3502cc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1516041774595-cc1b7969480c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1751315574558-d185d266b16d?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1675635656232-71d47b804a19?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1760978631985-590e3b5f4057?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1758120204495-e6af4c19668b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDl8aVVJc25WdGpCMFl8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1759697518276-acb067d0872e?q=80&w=1655&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1760605193118-a3536e1eea61?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1761478618389-f48b4b981d29?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1640301998084-c9b80babd03c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1556139918-9b92e8b00105?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE1fGlVSXNuVnRqQjBZfHxlbnwwfHx8fHw%3D",
  "https://plus.unsplash.com/premium_photo-1675874973165-2c875c9ed382?q=80&w=702&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1673726734894-73d068cb9454?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE3fGlVSXNuVnRqQjBZfHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1750672581729-a6da4cb5a0eb?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1761319480254-898e98443e4a?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1525019167271-be1690bb034f?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1669234305308-c2658f1fbf12?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1758220829551-6d02d06798c7?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1744646377302-1feb4ab3e9b9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1746420146061-0256c1335fe4?q=80&w=734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1637083041731-9028937c64d4?q=80&w=1398&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1747253590504-3a17cd5a4f9c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1757880555544-ac0bf6f9925a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1750672581729-a6da4cb5a0eb?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1760978631985-590e3b5f4057?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1758120204495-e6af4c19668b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDl8aVVJc25WdGpCMFl8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1759697518276-acb067d0872e?q=80&w=1655&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1760605193118-a3536e1eea61?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1761319480254-898e98443e4a?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1525019167271-be1690bb034f?q=80&w=689&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1669234305308-c2658f1fbf12?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1758220829551-6d02d06798c7?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

type PatternMode = "sphere" | "gallery" | "helix" | "wave" | "cylinder"

function ImageCard({
  position,
  rotation,
  image,
  scale = 1,
  targetPosition,
  targetRotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  image: string
  scale?: number
  targetPosition: [number, number, number]
  targetRotation: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [texture] = useState(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load(image)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    return tex
  })

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x += (targetPosition[0] - meshRef.current.position.x) * 0.1
      meshRef.current.position.y += (targetPosition[1] - meshRef.current.position.y) * 0.1
      meshRef.current.position.z += (targetPosition[2] - meshRef.current.position.z) * 0.1

      meshRef.current.rotation.x += (targetRotation[0] - meshRef.current.rotation.x) * 0.1
      meshRef.current.rotation.y += (targetRotation[1] - meshRef.current.rotation.y) * 0.1
      meshRef.current.rotation.z += (targetRotation[2] - meshRef.current.rotation.z) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[1.5, 1.8]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} transparent opacity={0.95} />
    </mesh>
  )
}

function Scene({ autoRotate, patternMode }: { autoRotate: boolean; patternMode: PatternMode }) {
  const groupRef = useRef<THREE.Group>(null)

  const radius = 8

  const spherePositions = images.map((_, index) => {
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    const theta = (2 * Math.PI * index) / goldenRatio
    const phi = Math.acos(1 - (2 * (index + 0.5)) / images.length)

    const x = radius * Math.cos(theta) * Math.sin(phi)
    const y = radius * Math.sin(theta) * Math.sin(phi)
    const z = radius * Math.cos(phi)

    const position = new THREE.Vector3(x, y, z)
    const euler = new THREE.Euler()
    const quaternion = new THREE.Quaternion()

    const up = new THREE.Vector3(0, 1, 0)
    const lookAtMatrix = new THREE.Matrix4()
    lookAtMatrix.lookAt(position, new THREE.Vector3(0, 0, 0), up)
    quaternion.setFromRotationMatrix(lookAtMatrix)
    euler.setFromQuaternion(quaternion)

    return {
      position: [x, y, z] as [number, number, number],
      rotation: [euler.x, euler.y, euler.z] as [number, number, number],
      scale: 1,
    }
  })

  const galleryPositions = images.map((_, index) => {
    const cols = 8
    const row = Math.floor(index / cols)
    const col = index % cols

    const x = (col - cols / 2 + 0.5) * 2.5
    const y = -(row - 3.5) * 2.8
    const z = 0

    return {
      position: [x, y, z] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: 1,
    }
  })

  const helixPositions = images.map((_, index) => {
    const heightSpacing = 0.8
    const spiralRadius = 6
    const rotations = 3

    const progress = index / images.length
    const angle = progress * Math.PI * 2 * rotations
    const y = (progress - 0.5) * images.length * heightSpacing - 8

    const x = Math.cos(angle) * spiralRadius
    const z = Math.sin(angle) * spiralRadius

    return {
      position: [x, y, z] as [number, number, number],
      rotation: [0, -angle, 0] as [number, number, number],
      scale: 1,
    }
  })

  const wavePositions = images.map((_, index) => {
    const cols = 10
    const row = Math.floor(index / cols)
    const col = index % cols

    const x = (col - cols / 2 + 0.5) * 2.5
    const z = (row - 2.5) * 2.5
    const y = Math.sin(col * 0.5) * 2 + Math.cos(row * 0.5) * 2

    return {
      position: [x, y, z] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: 1,
    }
  })

  const cylinderPositions = images.map((_, index) => {
    const itemsPerRing = 10
    const rings = Math.ceil(images.length / itemsPerRing)
    const ring = Math.floor(index / itemsPerRing)
    const angleIndex = index % itemsPerRing

    const angle = (angleIndex / itemsPerRing) * Math.PI * 2
    const cylinderRadius = 8
    const y = (ring - rings / 2 + 0.5) * 3

    const x = Math.cos(angle) * cylinderRadius
    const z = Math.sin(angle) * cylinderRadius

    return {
      position: [x, y, z] as [number, number, number],
      rotation: [0, -angle + Math.PI / 2, 0] as [number, number, number],
      scale: 1,
    }
  })

  const getPatternPositions = () => {
    switch (patternMode) {
      case "gallery":
        return galleryPositions
      case "helix":
        return helixPositions
      case "wave":
        return wavePositions
      case "cylinder":
        return cylinderPositions
      default:
        return spherePositions
    }
  }

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (patternMode === "gallery") {
        groupRef.current.rotation.x += (0 - groupRef.current.rotation.x) * 0.1
        groupRef.current.rotation.y += (0 - groupRef.current.rotation.y) * 0.1
        groupRef.current.rotation.z += (0 - groupRef.current.rotation.z) * 0.1
      } else if (autoRotate) {
        groupRef.current.rotation.y += delta * 0.2
      }
    }
  })

  const currentPositions = getPatternPositions()

  return (
    <group ref={groupRef}>
      {images.map((image, index) => (
        <ImageCard
          key={index}
          image={image}
          position={spherePositions[index].position}
          rotation={spherePositions[index].rotation}
          scale={1}
          targetPosition={currentPositions[index].position}
          targetRotation={currentPositions[index].rotation}
        />
      ))}
    </group>
  )
}

export default function PhotoSphere() {
  const [autoRotate, setAutoRotate] = useState(true)
  const [patternMode, setPatternMode] = useState<PatternMode>("sphere")
  const [clickedButton, setClickedButton] = useState<string | null>(null)

  const handleButtonClick = (buttonName: string, action: () => void) => {
    setClickedButton(buttonName)
    setTimeout(() => setClickedButton(null), 150)
    action()
  }

  return (
    <div className="relative h-full w-full bg-white">
      <Canvas camera={{ position: [0, 0, 25], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <Suspense fallback={null}>
          <Scene autoRotate={autoRotate} patternMode={patternMode} />
        </Suspense>
        <OrbitControls enableZoom={true} enablePan={true} autoRotate={false} minDistance={10} maxDistance={30} />
      </Canvas>

      <div className="absolute bottom-20 right-36 flex gap-0 border-2 border-black">
        <button
          onClick={() => handleButtonClick("sphere", () => setPatternMode("sphere"))}
          className={`p-3 border-r-2 border-black transition-all duration-150 ${
            patternMode === "sphere" ? "bg-black" : "bg-white hover:bg-gray-100"
          } ${clickedButton === "sphere" ? "scale-90" : "scale-100"}`}
          title="Sphere view"
        >
          <Orbit className={`h-5 w-5 ${patternMode === "sphere" ? "text-white" : "text-black"}`} />
        </button>
        <button
          onClick={() => handleButtonClick("gallery", () => setPatternMode("gallery"))}
          className={`p-3 border-r-2 border-black transition-all duration-150 ${
            patternMode === "gallery" ? "bg-black" : "bg-white hover:bg-gray-100"
          } ${clickedButton === "gallery" ? "scale-90" : "scale-100"}`}
          title="Gallery view"
        >
          <Grid3x3 className={`h-5 w-5 ${patternMode === "gallery" ? "text-white" : "text-black"}`} />
        </button>
        <button
          onClick={() => handleButtonClick("helix", () => setPatternMode("helix"))}
          className={`p-3 border-r-2 border-black transition-all duration-150 ${
            patternMode === "helix" ? "bg-black" : "bg-white hover:bg-gray-100"
          } ${clickedButton === "helix" ? "scale-90" : "scale-100"}`}
          title="Helix view"
        >
          <svg
            className={`h-5 w-5 ${patternMode === "helix" ? "text-white" : "text-black"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 12c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8M4 12l8-8m8 8l-8 8"
            />
          </svg>
        </button>
        <button
          onClick={() => handleButtonClick("wave", () => setPatternMode("wave"))}
          className={`p-3 border-r-2 border-black transition-all duration-150 ${
            patternMode === "wave" ? "bg-black" : "bg-white hover:bg-gray-100"
          } ${clickedButton === "wave" ? "scale-90" : "scale-100"}`}
          title="Wave view"
        >
          <Waves className={`h-5 w-5 ${patternMode === "wave" ? "text-white" : "text-black"}`} />
        </button>
        <button
          onClick={() => handleButtonClick("cylinder", () => setPatternMode("cylinder"))}
          className={`p-3 border-r-2 border-black transition-all duration-150 ${
            patternMode === "cylinder" ? "bg-black" : "bg-white hover:bg-gray-100"
          } ${clickedButton === "cylinder" ? "scale-90" : "scale-100"}`}
          title="Cylinder view"
        >
          <Cylinder className={`h-5 w-5 ${patternMode === "cylinder" ? "text-white" : "text-black"}`} />
        </button>
        <button
          onClick={() => handleButtonClick("rotate", () => setAutoRotate(!autoRotate))}
          disabled={patternMode === "gallery"}
          className={`p-3 transition-all duration-150 ${
            patternMode === "gallery"
              ? "bg-gray-200 cursor-not-allowed"
              : autoRotate
                ? "bg-black"
                : "bg-white hover:bg-gray-100"
          } ${clickedButton === "rotate" ? "scale-90" : "scale-100"}`}
          title={patternMode === "gallery" ? "Auto-rotation disabled in gallery view" : "Toggle auto-rotation"}
        >
          <RotateCw
            className={`h-5 w-5 ${
              patternMode === "gallery" ? "text-gray-400" : autoRotate ? "text-white" : "text-black"
            }`}
          />
        </button>
      </div>
    </div>
  )
}
