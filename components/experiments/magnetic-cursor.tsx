"use client"

import { useEffect, useRef, useState } from "react"

export default function MagneticCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2))

        if (distance < 150) {
          const strength = (150 - distance) / 150
          setPosition({
            x: (e.clientX - centerX) * strength * 0.3,
            y: (e.clientY - centerY) * strength * 0.3,
          })
        } else {
          setPosition({ x: 0, y: 0 })
        }
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="flex items-center justify-center">
      <div
        ref={targetRef}
        className="size-24 rounded-2xl bg-accent transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      />
    </div>
  )
}
