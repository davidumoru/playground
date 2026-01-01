"use client"
import Image from "next/image"
import { useTransform, motion, useScroll, type MotionValue } from "framer-motion"
import { useRef, useState, useEffect } from "react"

type CardProps = {
  i: number
  image: string
  progress: MotionValue<number>
  range: [number, number]
  targetScale: number
  mobileTargetScale: number
}

const Card = ({ i, image, progress, range, targetScale, mobileTargetScale }: CardProps) => {
  const container = useRef<HTMLDivElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  })

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])

  const desktopScale = useTransform(progress, range, [1, targetScale])
  const mobileScale = useTransform(progress, range, [1, mobileTargetScale])
  const scale = isMobile ? mobileScale : desktopScale

  const desktopTopOffset = `calc(-5vh + ${i * 25}px)`
  const mobileTopOffset = `calc(-5vh + ${i * 15}px)`

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0 px-0 md:px-0 sm:px-4">
      <motion.div
        style={{
          scale,
          top: isMobile ? mobileTopOffset : desktopTopOffset,
        }}
        className="relative w-full 
                   max-w-sm sm:max-w-2xl md:max-w-5xl
                   h-[300px] sm:h-[400px] md:h-[500px]
                   rounded-[12px] sm:rounded-[16px] md:rounded-[20px]
                   overflow-hidden"
      >
        <motion.div className="w-full h-full" style={{ scale: imageScale }}>
          <Image
            src={image || "/placeholder.svg"}
            alt={`Card ${i}`}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 100vw"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Card
