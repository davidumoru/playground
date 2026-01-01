"use client"

import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import type React from "react"
import { useRef, useState, useCallback, useEffect } from "react"
import Image from "next/image"
import { useAnimationFrame } from "@/hooks/use-animation-frame"

interface ActiveImage {
  id: number
  x: number
  y: number
  url: string
  timestamp: number
  isExpiring?: boolean
  rotation: number
  scale: number
  velocity: { x: number; y: number }
  targetX: number
  targetY: number
}

interface ImageTrailProps {
  images: string[]
  duration?: number
  fadeOutDuration?: number
  spawnInterval?: number
  maxImages?: number
  movementEase?: string
}

export const ImageTrail: React.FC<ImageTrailProps> = ({
  images,
  duration = 2.5,
  fadeOutDuration = 0.6,
  spawnInterval = 50,
  maxImages = 12,
}) => {
  const [activeImages, setActiveImages] = useState<ActiveImage[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const lastSpawnTimeRef = useRef(0)
  const lastPositionRef = useRef({ x: 0, y: 0 })
  const imageIdCounter = useRef(0)
  const velocityRef = useRef({ x: 0, y: 0 })
  const lastTimeRef = useRef(0)

  useAnimationFrame(() => {
    if (!imageContainerRef.current) return

    setActiveImages((prevImages) => {
      return prevImages.map((img) => {
        const element = imageContainerRef.current?.querySelector(`[data-id="${img.id}"]`) as HTMLElement
        if (element) {
          const lerpFactor = 0.15
          const newX = img.x + (img.targetX - img.x) * lerpFactor
          const newY = img.y + (img.targetY - img.y) * lerpFactor

          gsap.set(element, {
            x: newX,
            y: newY,
          })

          return { ...img, x: newX, y: newY }
        }
        return img
      })
    })
  })

  const manageImageLifecycle = useCallback(() => {
    const now = performance.now()
    const timeToStartFading = duration * 1000 - fadeOutDuration * 1000
    const timeForFullRemoval = duration * 1000

    setActiveImages((prevImages) => {
      const updatedImages = prevImages.map((img) => {
        if (now - img.timestamp > timeToStartFading && !img.isExpiring) {
          const imgElement = imageContainerRef.current?.querySelector(`[data-id="${img.id}"]`)
          if (imgElement) {
            gsap.to(imgElement, {
              opacity: 0,
              scale: img.scale * 0.6,
              rotation: img.rotation + (Math.random() - 0.5) * 20,
              duration: fadeOutDuration,
              ease: "power2.out",
            })
          }
          return { ...img, isExpiring: true }
        }
        return img
      })

      return updatedImages.filter((img) => now - img.timestamp < timeForFullRemoval)
    })
  }, [duration, fadeOutDuration])

  useAnimationFrame(manageImageLifecycle)

  useGSAP(
    () => {
      if (activeImages.length === 0 || !imageContainerRef.current) return

      const latestImageInfo = activeImages[activeImages.length - 1]
      const latestImageElement = imageContainerRef.current.querySelector(`[data-id="${latestImageInfo.id}"]`)

      if (!latestImageElement) return

      gsap.set(latestImageElement, {
        opacity: 0,
        scale: 0.2,
        x: latestImageInfo.x,
        y: latestImageInfo.y,
        rotation: latestImageInfo.rotation,
      })

      gsap.to(latestImageElement, {
        opacity: 0.95,
        scale: latestImageInfo.scale,
        duration: 0.4,
        ease: "back.out(1.2)",
      })
    },
    { dependencies: [activeImages], scope: containerRef },
  )

  const addImage = useCallback(
    (x: number, y: number) => {
      const now = performance.now()
      if (now - lastSpawnTimeRef.current < spawnInterval) return

      const deltaTime = now - lastTimeRef.current
      if (deltaTime > 0) {
        velocityRef.current = {
          x: (x - lastPositionRef.current.x) / deltaTime,
          y: (y - lastPositionRef.current.y) / deltaTime,
        }
      }

      lastSpawnTimeRef.current = now
      lastTimeRef.current = now
      lastPositionRef.current = { x, y }

      const velocityMagnitude = Math.sqrt(velocityRef.current.x ** 2 + velocityRef.current.y ** 2)
      const velocityRotation = Math.atan2(velocityRef.current.y, velocityRef.current.x) * (180 / Math.PI)
      const baseRotation = velocityMagnitude > 0.5 ? velocityRotation * 0.2 : 0

      const newImage: ActiveImage = {
        id: imageIdCounter.current++,
        x,
        y,
        targetX: x,
        targetY: y,
        url: images[currentImageIndex],
        timestamp: now,
        rotation: baseRotation + (Math.random() - 0.5) * 20,
        scale: 0.85 + Math.random() * 0.25,
        velocity: { ...velocityRef.current },
      }

      setActiveImages((prev) => {
        const newImageList = [...prev, newImage]
        if (newImageList.length > maxImages) {
          return newImageList.slice(newImageList.length - maxImages)
        }
        return newImageList
      })

      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    },
    [currentImageIndex, images, maxImages, spawnInterval],
  )

  const handlePointerEvent = useCallback(
    (x: number, y: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      addImage(x - rect.left, y - rect.top)
    },
    [addImage],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => handlePointerEvent(e.clientX, e.clientY),
    [handlePointerEvent],
  )

  const preventDefault = (e: TouchEvent) => e.preventDefault()

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0]
      if (touch) {
        handlePointerEvent(touch.clientX, touch.clientY)
      }
    },
    [handlePointerEvent],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      containerRef.current?.addEventListener("touchmove", preventDefault, {
        passive: false,
      })
      const touch = e.touches[0]
      if (touch) handlePointerEvent(touch.clientX, touch.clientY)
    },
    [handlePointerEvent],
  )

  const handleTouchEnd = useCallback(() => {
    containerRef.current?.removeEventListener("touchmove", preventDefault)
  }, [])

  useEffect(() => {
    const currentRef = containerRef.current
    return () => {
      currentRef?.removeEventListener("touchmove", preventDefault)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="absolute inset-0" ref={imageContainerRef}>
        {activeImages.map((img) => (
          <Image
            key={img.id}
            data-id={img.id}
            src={img.url || "/placeholder.svg"}
            alt=""
            width={120}
            height={120}
            className="absolute pointer-events-none rounded-lg"
            style={{
              top: 0,
              left: 0,
              transform: `translate(${img.x}px, ${img.y}px)`,
              width: "120px",
              height: "120px",
              objectFit: "cover",
              willChange: "transform, opacity, scale",
            }}
            unoptimized
          />
        ))}
      </div>
    </div>
  )
}

export default function ImageTrailExperiment() {
  const imageUrls = [
    "https://images.unsplash.com/photo-1760340769739-653d00200baf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
    "https://images.unsplash.com/photo-1753301639019-53340bb79d03?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627",
    "https://plus.unsplash.com/premium_photo-1756120053159-433dcffeeb10?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    "https://plus.unsplash.com/premium_photo-1673137880579-c1ed2a4230b8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
    "https://images.unsplash.com/photo-1631034339054-a3ff59f238df?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=625",
    "https://plus.unsplash.com/premium_photo-1728280883821-8e2b416a878a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    "https://images.unsplash.com/photo-1762204296168-e1b7675f6ae2?q=80&w=1452&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1738777152204-0ec9ab3502cc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1516041774595-cc1b7969480c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1751315574558-d185d266b16d?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ].map((url) => `${url}&auto=format&fit=crop&w=400&q=80`)

  return (
    <div className="w-full h-full">
      <ImageTrail images={imageUrls} duration={2.5} fadeOutDuration={0.7} spawnInterval={50} maxImages={10} />
    </div>
  )
}
