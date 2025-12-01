"use client"

import { useState } from "react"

const items = [
  { id: 1, size: "large" },
  { id: 2, size: "small" },
  { id: 3, size: "small" },
  { id: 4, size: "medium" },
  { id: 5, size: "medium" },
]

export default function BentoHover() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="flex items-center justify-center p-12">
      <div className="grid grid-cols-4 gap-4 w-full max-w-3xl">
        {items.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`
              rounded-2xl bg-card border border-border transition-all duration-300
              ${item.size === "large" ? "col-span-2 row-span-2" : ""}
              ${item.size === "medium" ? "col-span-2" : ""}
              ${item.size === "small" ? "col-span-1" : ""}
              ${hoveredId === item.id ? "bg-accent border-accent scale-105 shadow-2xl shadow-accent/20" : ""}
              ${hoveredId && hoveredId !== item.id ? "opacity-40 scale-95" : ""}
              aspect-square
            `}
          />
        ))}
      </div>
    </div>
  )
}
