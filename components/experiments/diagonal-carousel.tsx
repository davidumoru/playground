"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
  animate,
} from "framer-motion"

const images = [
  "https://images.unsplash.com/photo-1760340769739-653d00200baf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
  "https://images.unsplash.com/photo-1753301639019-53340bb79d03?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627",
  "https://plus.unsplash.com/premium_photo-1756120053159-433dcffeeb10?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
  "https://plus.unsplash.com/premium_photo-1673137880579-c1ed2a4230b8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
  "https://images.unsplash.com/photo-1631034339054-a3ff59f238df?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=625",
  "https://plus.unsplash.com/premium_photo-1728280883821-8e2b416a878a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
]

interface CarouselItemProps {
  index: number
  scrollProgress: MotionValue<number>
  image: string
}

const CarouselItem = ({ index, scrollProgress, image }: CarouselItemProps) => {
  const transforms = useTransform(scrollProgress, (latestScroll: number) => {
    const itemProgress = index - latestScroll
    const diagonalProgress = itemProgress

    const curveAmount = 0.08
    const curveOffset = Math.sin(diagonalProgress * Math.PI * 0.3) * curveAmount

    const xVal = diagonalProgress * 25 + curveOffset * 15
    const yVal = diagonalProgress * 25 - curveOffset * 10

    const bottomAngle = -30
    const topAngle = -5
    const yRange = 50
    const normalizedY = (yVal + yRange / 2) / yRange
    const clampedY = Math.max(0, Math.min(1, normalizedY))
    const rotateVal = bottomAngle + (topAngle - bottomAngle) * clampedY

    const scaleFactor = 1 - Math.abs(Math.sin(diagonalProgress * 0.2)) * 0.1
    const scaleVal = Math.max(0.8, Math.min(1, scaleFactor))

    return {
      x: xVal,
      y: yVal,
      rotate: rotateVal,
      scale: scaleVal,
    }
  })

  const x = useTransform(transforms, (t) => `calc(-50% + ${t.x}vh)`)
  const y = useTransform(transforms, (t) => `calc(-50% + ${t.y}vh)`)
  const rotate = useTransform(transforms, (t) => `${t.rotate}deg`)
  const scale = useTransform(transforms, (t) => t.scale)

  return (
    <motion.div
      className="absolute pointer-events-auto will-change-transform"
      style={{
        left: "50%",
        top: "50%",
        x,
        y,
        rotate,
        scale,
      }}
    >
      <div
        className="rounded-2xl shadow-2xl overflow-hidden bg-gray-800 select-none"
        style={{
          width: "280px",
          height: "380px",
        }}
      >
        <img src={image} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
      </div>
    </motion.div>
  )
}

export default function DiagonalCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollProgress = useMotionValue(0)

  // stiffness 300 + damping 18 creates a spring that oscillates slightly (overshoots) before settling
  const smoothProgress = useSpring(scrollProgress, {
    damping: 18,
    stiffness: 300,
    mass: 1,
  })

  const [visibleIndex, setVisibleIndex] = useState(0)
  const isDragging = useRef(false)
  const startY = useRef(0)
  const initialScroll = useRef(0)
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null)

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const rounded = Math.round(latest)
    if (rounded !== visibleIndex) {
      setVisibleIndex(rounded)
    }
  })

  const snapToNearest = useCallback(() => {
    const current = scrollProgress.get()
    const target = Math.round(current)
    animate(scrollProgress, target, { duration: 0.1 })
  }, [scrollProgress])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current)

      const current = scrollProgress.get()
      scrollProgress.set(current + e.deltaY * 0.001)

      wheelTimeout.current = setTimeout(() => {
        snapToNearest()
      }, 150)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const current = scrollProgress.get()
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault()
        scrollProgress.set(Math.round(current) + 1)
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        scrollProgress.set(Math.round(current) - 1)
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("keydown", handleKeyDown)
      if (wheelTimeout.current) clearTimeout(wheelTimeout.current)
    }
  }, [scrollProgress, snapToNearest])

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    startY.current = e.clientY
    initialScroll.current = scrollProgress.get()

    if (wheelTimeout.current) clearTimeout(wheelTimeout.current)

    if (containerRef.current) containerRef.current.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const deltaY = e.clientY - startY.current
    const scrollDelta = -deltaY * 0.002
    scrollProgress.set(initialScroll.current + scrollDelta)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    isDragging.current = false
    if (containerRef.current) containerRef.current.releasePointerCapture(e.pointerId)

    snapToNearest()
  }

  const totalItems = images.length
  const startIndex = visibleIndex - 10
  const endIndex = visibleIndex + 17

  const renderedItems: React.ReactNode[] = []
  for (let i = startIndex; i <= endIndex; i++) {
    const imageIndex = ((i % totalItems) + totalItems) % totalItems
    renderedItems.push(<CarouselItem key={i} index={i} scrollProgress={smoothProgress} image={images[imageIndex]} />)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden cursor-grab active:cursor-grabbing touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">{renderedItems}</div>
    </div>
  )
}
