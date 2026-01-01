"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { type PanInfo, motion, useAnimation, useMotionValue, useTransform } from "framer-motion"
import Image from "next/image"

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    setMatches(mediaQuery.matches)

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches)
    mediaQuery.addEventListener("change", handler)

    return () => mediaQuery.removeEventListener("change", handler)
  }, [query])

  return matches
}

const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1575&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/uploads/1411400493228e06a6315/ad711a20?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/uploads/1412026095116d2b0c90e/3bf33993?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1429704658776-3d38c9990511?q=80&w=1979&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1682687220499-d9c06b872eee?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
] as const

const CAROUSEL_CONFIG = {
  cylinderWidth: {
    mobile: 2000,
    desktop: 3000,
  },
  dragSensitivity: 0.15,
  scrollSensitivity: 0.5,
  animation: {
    stiffness: 250,
    damping: 35,
    mass: 0.5,
  },
  viewport: {
    perspective: 1200,
  },
} as const

interface CarouselFaceProps {
  imageUrl: string
  index: number
  faceWidth: number
  faceCount: number
  radius: number
}

function CarouselFace({ imageUrl, index, faceWidth, faceCount, radius }: CarouselFaceProps) {
  const rotationAngle = index * (360 / faceCount)

  return (
    <div
      className="absolute flex h-full origin-center items-center justify-center p-4"
      style={{
        width: `${faceWidth}px`,
        transform: `rotateY(${rotationAngle}deg) translateZ(${radius}px)`,
      }}
    >
      <div className="relative h-20 w-full overflow-hidden rounded md:h-24 lg:h-32 aspect-video">
        <Image
          src={imageUrl}
          alt={`Gallery image ${index + 1}`}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover pointer-events-none select-none"
          priority={index < 6}
          draggable={false}
        />
      </div>
    </div>
  )
}

export default function ThreeDPhotoCarousel() {
  const isSmallScreen = useMediaQuery("(max-width: 768px)")

  const cylinderWidth = isSmallScreen ? CAROUSEL_CONFIG.cylinderWidth.mobile : CAROUSEL_CONFIG.cylinderWidth.desktop

  const faceCount = GALLERY_IMAGES.length
  const faceWidth = cylinderWidth / faceCount
  const radius = cylinderWidth / (2 * Math.PI)

  const rotation = useMotionValue(0)
  const controls = useAnimation()

  const handleDrag = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const newRotation = rotation.get() + info.delta.x * CAROUSEL_CONFIG.dragSensitivity
      rotation.set(newRotation)
    },
    [rotation],
  )

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const momentum = Math.abs(info.velocity.x) > 100 ? info.velocity.x * 0.02 : 0
      const finalRotation = rotation.get() + momentum

      controls.start({
        rotateY: finalRotation,
        transition: {
          type: "spring",
          stiffness: CAROUSEL_CONFIG.animation.stiffness,
          damping: CAROUSEL_CONFIG.animation.damping,
          mass: CAROUSEL_CONFIG.animation.mass,
        },
      })
    },
    [controls, rotation],
  )

  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault()
      const normalizedDelta = Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY), 100)
      const targetRotation = rotation.get() + normalizedDelta * CAROUSEL_CONFIG.scrollSensitivity

      controls.start({
        rotateY: targetRotation,
        transition: {
          type: "spring",
          stiffness: CAROUSEL_CONFIG.animation.stiffness,
          damping: CAROUSEL_CONFIG.animation.damping,
          mass: CAROUSEL_CONFIG.animation.mass,
          duration: 0.4,
        },
      })
    },
    [controls, rotation],
  )

  const transform = useTransform(rotation, (value) => `rotate3d(0, 1, 0, ${value}deg)`)

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div
        className="flex h-full items-center justify-center"
        style={{
          perspective: `${CAROUSEL_CONFIG.viewport.perspective}px`,
          transformStyle: "preserve-3d",
        }}
        onWheel={handleWheel}
      >
        <motion.div
          drag="x"
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing select-none"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
        >
          {GALLERY_IMAGES.map((imageUrl, index) => (
            <CarouselFace
              key={`carousel-face-${index}`}
              imageUrl={imageUrl}
              index={index}
              faceWidth={faceWidth}
              faceCount={faceCount}
              radius={radius}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
