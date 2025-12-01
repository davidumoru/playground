"use client"

import { motion } from "framer-motion"

const text = "Creative Coding Playground"

const container = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
  }),
}

const child = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
  },
}

export default function TextReveal() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div className="text-6xl font-bold text-center" variants={container} initial="hidden" animate="visible">
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={child}
            className="inline-block"
            style={{ display: char === " " ? "inline" : "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}
