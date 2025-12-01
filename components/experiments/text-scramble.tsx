"use client"

import { useState, useEffect } from "react"

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"

export default function TextScramble() {
  const [text, setText] = useState("")
  const targetText = "EXPERIMENT"

  useEffect(() => {
    let iteration = 0
    const interval = setInterval(() => {
      setText(
        targetText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return targetText[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join(""),
      )

      if (iteration >= targetText.length) {
        clearInterval(interval)
      }

      iteration += 1 / 3
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center">
      <h1 className="font-mono text-6xl font-bold text-accent">{text}</h1>
    </div>
  )
}
