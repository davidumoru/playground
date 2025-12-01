"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const images = [
  { id: 1, color: "#3b82f6", speed: 0.5 },
  { id: 2, color: "#8b5cf6", speed: 0.8 },
  { id: 3, color: "#ec4899", speed: 0.3 },
  { id: 4, color: "#f59e0b", speed: 0.6 },
  { id: 5, color: "#10b981", speed: 0.4 },
]

export default function SmoothParallax() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -images[0].speed * 500])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -images[1].speed * 500])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -images[2].speed * 500])
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -images[3].speed * 500])
  const y5 = useTransform(scrollYProgress, [0, 1], [0, -images[4].speed * 500])

  const yTransforms = [y1, y2, y3, y4, y5]

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto">
      <div className="h-[300vh] relative">
        {images.map((item, index) => {
          return (
            <motion.div
              key={item.id}
              style={{ y: yTransforms[index] }}
              className="sticky top-20 w-full h-64 rounded-2xl mb-8 mx-auto max-w-4xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full h-full rounded-2xl" style={{ backgroundColor: item.color }} />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
