"use client"

import { motion } from "framer-motion"
import { useRef } from "react"

const images = [
  { id: 1, color: "#3b82f6" },
  { id: 2, color: "#8b5cf6" },
  { id: 3, color: "#ec4899" },
  { id: 4, color: "#f59e0b" },
  { id: 5, color: "#10b981" },
]

export default function InfiniteCarousel() {
  const constraintsRef = useRef(null)

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden" ref={constraintsRef}>
      <motion.div
        className="flex gap-6"
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        whileTap={{ cursor: "grabbing" }}
      >
        {[...images, ...images].map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            className="min-w-[300px] h-[400px] rounded-2xl cursor-grab"
            style={{ backgroundColor: item.color }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  )
}
