"use client"

import { useState } from "react"

export default function LiquidButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex items-center justify-center">
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative px-8 py-4 rounded-2xl bg-accent text-accent-foreground font-medium overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20"
      >
        <span className="relative z-10">Hover me</span>
        <div
          className={`absolute inset-0 bg-gradient-to-r from-accent to-accent/80 transition-transform duration-700 ease-out ${
            isHovered ? "scale-150" : "scale-0"
          }`}
          style={{
            borderRadius: "50%",
          }}
        />
      </button>
    </div>
  )
}
