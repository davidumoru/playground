"use client"

import { useEffect, useRef, useState } from "react"

interface ImageItem {
  src: string
  alt: string
  title: string
  description: string
}

const images: ImageItem[] = [
  {
    src: "https://images.unsplash.com/photo-1612676239016-41e2c92b8e06?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Mountain landscape",
    title: "Alpine Majesty",
    description: "Where earth meets sky in eternal conversation",
  },
  {
    src: "https://images.unsplash.com/photo-1616141893496-fbc65370493e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Ocean waves",
    title: "Endless Horizons",
    description: "The rhythm of tides, the pulse of nature",
  },
  {
    src: "https://images.unsplash.com/photo-1486707471592-8e7eb7e36f78?q=80&w=1394&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Misty forest",
    title: "Forest Whispers",
    description: "Ancient trees sharing secrets through the mist",
  },
  {
    src: "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Desert dunes",
    title: "Golden Sands",
    description: "Time sculpted into waves of gold",
  },
  {
    src: "https://images.unsplash.com/photo-1475518845976-0fd87b7e4e5d?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Northern lights",
    title: "Celestial Dance",
    description: "When the sky paints with light",
  },
]

const ScrollImageReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const maxScroll = scrollHeight - clientHeight
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0
      setScrollProgress(progress)

      const sectionProgress = progress * images.length
      const newIndex = Math.min(Math.floor(sectionProgress), images.length - 1)
      setActiveIndex(newIndex)
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const getImageProgress = (index: number) => {
    const sectionSize = 1 / images.length
    const sectionStart = index * sectionSize
    const sectionEnd = (index + 1) * sectionSize

    if (scrollProgress < sectionStart) return 0
    if (scrollProgress > sectionEnd) return 1

    return (scrollProgress - sectionStart) / sectionSize
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-neutral-950">
      <div className="fixed right-8 top-1/2 z-50 -translate-y-1/2">
        <div className="h-32 w-0.5 overflow-hidden rounded-full bg-neutral-800">
          <div
            className="w-full rounded-full bg-white transition-all duration-150 ease-out"
            style={{ height: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>

      <div ref={containerRef} className="h-full overflow-y-auto scroll-smooth" style={{ scrollbarWidth: "none" }}>
        <div style={{ height: `${images.length * 100}vh` }}>
          <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
            {images.map((image, index) => {
              const progress = getImageProgress(index)
              const isActive = activeIndex === index
              const isPast = activeIndex > index

              const clipProgress = Math.min(progress * 1.5, 1)
              const clipPath = `inset(${(1 - clipProgress) * 50}% 0 ${(1 - clipProgress) * 50}% 0)`

              const brightness = isPast ? 0.3 : isActive ? 0.4 + progress * 0.6 : 0

              const scale = 1 + progress * 0.1

              return (
                <div
                  key={index}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    zIndex: index,
                    opacity: isPast || isActive ? 1 : 0,
                    transition: "opacity 0.5s ease-out",
                  }}
                >
                  <div
                    className="relative h-[70vh] w-[85vw] overflow-hidden rounded-2xl"
                    style={{
                      clipPath,
                      transition: "clip-path 0.1s ease-out",
                    }}
                  >
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      className="h-full w-full object-cover"
                      style={{
                        filter: `brightness(${brightness})`,
                        transform: `scale(${scale})`,
                        transition: "filter 0.1s ease-out, transform 0.1s ease-out",
                      }}
                    />

                    <div
                      className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/30"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transition: "opacity 0.5s ease-out",
                      }}
                    />

                    <div
                      className="absolute bottom-0 left-0 right-0 p-8 md:p-12"
                      style={{
                        opacity: isActive ? Math.min(progress * 2, 1) : 0,
                        transform: `translateY(${(1 - Math.min(progress * 2, 1)) * 30}px)`,
                        transition: "opacity 0.3s ease-out, transform 0.3s ease-out",
                      }}
                    >
                      <span className="mb-2 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/70 backdrop-blur-sm">
                        {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                      </span>
                      <h2 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-6xl">{image.title}</h2>
                      <p className="max-w-md text-lg text-white/70">{image.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50 transition-opacity duration-500"
        style={{ opacity: scrollProgress < 0.05 ? 1 : 0 }}
      >
        <span className="text-sm font-medium uppercase tracking-widest">Scroll to explore</span>
        <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-white/30 p-1">
          <div className="h-2 w-1 animate-bounce rounded-full bg-white/50" />
        </div>
      </div>
    </div>
  )
}

export default ScrollImageReveal;
