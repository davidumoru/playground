"use client"

import { useEffect, useState, useRef } from "react"

export default function ScrollVelocity() {
  const [velocity, setVelocity] = useState(0)
  const lastScrollY = useRef(0)
  const lastTime = useRef(Date.now())

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const currentTime = Date.now()
      const timeDiff = currentTime - lastTime.current
      const scrollDiff = currentScrollY - lastScrollY.current

      const newVelocity = Math.abs(scrollDiff / timeDiff) * 100
      setVelocity(Math.min(newVelocity, 100))

      lastScrollY.current = currentScrollY
      lastTime.current = currentTime
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Scroll to see velocity</p>
        <div
          className="text-8xl font-bold text-accent transition-all duration-200"
          style={{
            transform: `scale(${1 + velocity / 50})`,
            filter: `blur(${velocity / 20}px)`,
          }}
        >
          {Math.round(velocity)}
        </div>
      </div>

      <div className="h-[200vh]" />
    </div>
  )
}
