"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useState, useRef } from "react"

const cards = [
  { id: 1, title: "Design", color: "#3b82f6" },
  { id: 2, title: "Development", color: "#8b5cf6" },
  { id: 3, title: "Animation", color: "#ec4899" },
  { id: 4, title: "Interaction", color: "#f59e0b" },
]

function MagneticCard({ title, color }: { title: string; color: string }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY

    setPosition({
      x: distanceX * 0.3,
      y: distanceY * 0.3,
    })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      className="w-64 h-80 rounded-2xl cursor-pointer relative"
      style={{ backgroundColor: color }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <h3 className="text-white text-3xl font-bold">{title}</h3>
      </div>
    </motion.div>
  )
}

export default function MagneticCards() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-6 flex-wrap p-8">
      {cards.map((card) => (
        <MagneticCard key={card.id} title={card.title} color={card.color} />
      ))}
    </div>
  )
}
