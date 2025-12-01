"use client"

import { useEffect, useRef } from "react"

export default function GenerativeGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 400
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const gridSize = 20
    const cellSize = size / gridSize

    let time = 0
    const animate = () => {
      ctx.clearRect(0, 0, size, size)

      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const x = i * cellSize
          const y = j * cellSize
          const noise = Math.sin(i * 0.5 + time) * Math.cos(j * 0.5 + time)
          const alpha = (noise + 1) / 2

          ctx.fillStyle = `rgba(79, 209, 197, ${alpha * 0.6})`
          ctx.fillRect(x, y, cellSize - 2, cellSize - 2)
        }
      }

      time += 0.02
      requestAnimationFrame(animate)
    }

    animate()
  }, [])

  return (
    <div className="flex items-center justify-center">
      <canvas ref={canvasRef} className="rounded-2xl" />
    </div>
  )
}
