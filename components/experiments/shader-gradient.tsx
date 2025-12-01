"use client"

import { useEffect, useRef } from "react"

export default function ShaderGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    let time = 0
    const animate = () => {
      const width = canvas.width
      const height = canvas.height

      // Create radial gradient
      const centerX = width / 2 + Math.sin(time * 0.5) * 100
      const centerY = height / 2 + Math.cos(time * 0.3) * 100

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.8)

      const hue1 = (time * 30) % 360
      const hue2 = (time * 30 + 120) % 360
      const hue3 = (time * 30 + 240) % 360

      gradient.addColorStop(0, `hsl(${hue1}, 70%, 60%)`)
      gradient.addColorStop(0.5, `hsl(${hue2}, 70%, 60%)`)
      gradient.addColorStop(1, `hsl(${hue3}, 70%, 60%)`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      time += 0.01
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
