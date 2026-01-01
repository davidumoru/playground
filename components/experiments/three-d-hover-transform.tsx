"use client"

import { useState, useEffect } from "react"

const ThreeDHoverTransform = () => {
  const [currentVariant, setCurrentVariant] = useState("default")
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!isHovered) {
      const variants = ["default", "down", "default2", "down2"]
      let currentIndex = 0

      const interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % variants.length
        setCurrentVariant(variants[currentIndex])
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isHovered])

  const getTransform = () => {
    switch (currentVariant) {
      case "up":
        return "perspective(1200px) rotateX(20deg) rotateY(240deg) scale(1.3)"
      case "down":
        return "perspective(1200px) rotateX(-10deg) rotateY(0deg) scale(1.05)"
      case "default2":
        return "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)"
      case "up2":
        return "perspective(1200px) rotateX(25deg) rotateY(200deg) scale(1.2)"
      case "down2":
        return "perspective(1200px) rotateX(-15deg) rotateY(0deg) scale(1.1)"
      default:
        return "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)"
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="w-60 h-80 cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        onMouseEnter={() => {
          setIsHovered(true)
          setCurrentVariant("up")
        }}
        onMouseLeave={() => {
          setIsHovered(false)
          setCurrentVariant("default")
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1749198360408-e5358cce6ddc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="3D Hover Image"
          className="w-full h-full object-cover rounded-lg shadow-lg"
          style={{
            transform: getTransform(),
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
            transformOrigin: "center center",
          }}
          draggable={false}
        />
      </div>
    </div>
  )
}

export default ThreeDHoverTransform
