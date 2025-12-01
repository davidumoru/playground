"use client"

import { useRef, useEffect } from "react"
import { motion, type Variants } from "framer-motion"
import Image from "next/image"
import gsap from "gsap"

interface ProjectData {
  title: string
  imageSrc: string
  backgroundColor: string
}

interface ModalState {
  isActive: boolean
  activeIndex: number
}

interface HoverPreviewModalProps {
  modalState: ModalState
  projects: ProjectData[]
}

const modalScaleAnimation: Variants = {
  initial: { scale: 0, x: "-50%", y: "-50%" },
  enter: {
    scale: 1,
    x: "-50%",
    y: "-50%",
    transition: {
      duration: 0.4,
      ease: [0.76, 0, 0.24, 1] as [number, number, number, number],
    },
  },
  closed: {
    scale: 0,
    x: "-50%",
    y: "-50%",
    transition: {
      duration: 0.4,
      ease: [0.32, 0, 0.67, 0] as [number, number, number, number],
    },
  },
}

export default function HoverPreviewModal({ modalState, projects }: HoverPreviewModalProps) {
  const { isActive, activeIndex } = modalState
  const modalContainerRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorLabelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!modalContainerRef.current || !cursorRef.current || !cursorLabelRef.current) return

    const moveModalContainer = {
      x: gsap.quickTo(modalContainerRef.current, "left", {
        duration: 0.8,
        ease: "power3",
      }),
      y: gsap.quickTo(modalContainerRef.current, "top", {
        duration: 0.8,
        ease: "power3",
      }),
    }

    const moveCursor = {
      x: gsap.quickTo(cursorRef.current, "left", {
        duration: 0.5,
        ease: "power3",
      }),
      y: gsap.quickTo(cursorRef.current, "top", {
        duration: 0.5,
        ease: "power3",
      }),
    }

    const moveCursorLabel = {
      x: gsap.quickTo(cursorLabelRef.current, "left", {
        duration: 0.45,
        ease: "power3",
      }),
      y: gsap.quickTo(cursorLabelRef.current, "top", {
        duration: 0.45,
        ease: "power3",
      }),
    }

    const handleMouseMove = (event: MouseEvent) => {
      const { pageX, pageY } = event

      moveModalContainer.x(pageX)
      moveModalContainer.y(pageY)
      moveCursor.x(pageX)
      moveCursor.y(pageY)
      moveCursorLabel.x(pageX)
      moveCursorLabel.y(pageY)
    }

    if (!("ontouchstart" in window)) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <>
      <motion.div
        ref={modalContainerRef}
        variants={modalScaleAnimation}
        initial="initial"
        animate={isActive ? "enter" : "closed"}
        className="pointer-events-none absolute flex h-[200px] w-[250px] sm:h-[280px] sm:w-[320px] lg:h-[350px] lg:w-[400px] items-center justify-center overflow-hidden bg-white"
        style={{
          left: typeof window !== "undefined" && "ontouchstart" in window ? "50%" : undefined,
          top: typeof window !== "undefined" && "ontouchstart" in window ? "50%" : undefined,
        }}
      >
        <div
          className="absolute h-full w-full transition-[top] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
          style={{ top: `${activeIndex * -100}%` }}
        >
          {projects.map((project, index) => (
            <div
              key={`modal_${index}`}
              className="flex h-full w-full items-center justify-center"
              style={{ backgroundColor: project.backgroundColor }}
            >
              <Image
                src={`/images/hover-preview/${project.imageSrc}`}
                width={300}
                height={0}
                alt={`${project.title} preview`}
                className="h-auto w-[180px] sm:w-[240px] lg:w-[300px]"
              />
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        ref={cursorRef}
        className="pointer-events-none absolute z-[2] hidden lg:flex h-12 w-12 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-[#455CE9] text-xs lg:text-sm font-light text-white"
        variants={modalScaleAnimation}
        initial="initial"
        animate={isActive ? "enter" : "closed"}
        style={{
          display: typeof window !== "undefined" && "ontouchstart" in window ? "none" : undefined,
        }}
      />

      <motion.div
        ref={cursorLabelRef}
        className="pointer-events-none absolute z-[2] hidden lg:flex h-12 w-12 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-transparent text-xs lg:text-sm font-light text-white"
        variants={modalScaleAnimation}
        initial="initial"
        animate={isActive ? "enter" : "closed"}
        style={{
          display: typeof window !== "undefined" && "ontouchstart" in window ? "none" : undefined,
        }}
      >
        View
      </motion.div>
    </>
  )
}
