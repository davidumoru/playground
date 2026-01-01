"use client"

import { useScroll } from "framer-motion"
import { useEffect, useRef } from "react"
import Lenis from "lenis"
import Card from "@/components/sticky-scroll-cards/card"

const CardImages = [
  "https://images.unsplash.com/photo-1760340769739-653d00200baf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
  "https://images.unsplash.com/photo-1753301639019-53340bb79d03?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627",
  "https://plus.unsplash.com/premium_photo-1756120053159-433dcffeeb10?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
  "https://plus.unsplash.com/premium_photo-1673137880579-c1ed2a4230b8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
  "https://images.unsplash.com/photo-1631034339054-a3ff59f238df?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=625",
]

export default function StickyScrollCards() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div ref={container}>
      {CardImages.map((src, i) => {
        const targetScale = 1 - (CardImages.length - i) * 0.05
        const mobileTargetScale = 1 - (CardImages.length - i) * 0.03

        return (
          <Card
            key={`p_${i}`}
            i={i}
            image={src}
            progress={scrollYProgress}
            range={[i * 0.2, 1]}
            targetScale={targetScale}
            mobileTargetScale={mobileTargetScale}
          />
        )
      })}
    </div>
  )
}
