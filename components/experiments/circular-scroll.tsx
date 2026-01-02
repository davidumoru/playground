"use client"

import React, { useLayoutEffect, useRef, useEffect } from "react"
import gsap from "gsap"

const CHARACTERS = [
  { name: "Jon Snow", image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&h=400&fit=crop" },
  { name: "Daenerys Targaryen", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
  { name: "Tyrion Lannister", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  { name: "Arya Stark", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop" },
  { name: "Cersei Lannister", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
  { name: "Jaime Lannister", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
  { name: "Sansa Stark", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" },
  { name: "Bran Stark", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
  { name: "Jorah Mormont", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" },
  { name: "Theon Greyjoy", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop" },
  { name: "Samwell Tarly", image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop" },
  { name: "Brienne of Tarth", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop" },
  { name: "Sandor Clegane", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" },
  { name: "Petyr Baelish", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
  { name: "Varys", image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop" },
  { name: "Margaery Tyrell", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" },
  { name: "Ramsay Bolton", image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop" },
  { name: "Joffrey Baratheon", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop" },
  { name: "Melisandre", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop" },
  { name: "Davos Seaworth", image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=400&h=400&fit=crop" },
  { name: "Ygritte", image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop" },
  { name: "Tormund Giantsbane", image: "https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=400&h=400&fit=crop" },
  { name: "Catelyn Stark", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop" },
  { name: "Robb Stark", image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=400&fit=crop" },
]

const NAMES = CHARACTERS.map(c => c.name)
const IMAGES = CHARACTERS.map(c => c.image)

export default function CircularScrollExperiment() {
  const containerRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLUListElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  
  const activeIndexRef = useRef<number>(0)
  const previousIndexRef = useRef<number>(0)
  
  const itemsRef = useRef<HTMLElement[]>([])
  const imagesRef = useRef<HTMLImageElement[]>([])
  
  const scrollState = useRef({
    current: 0,
    target: 0,
    last: 0
  })

  // --- Animation Logic ---
  const updateActiveIndex = () => {
    if (!itemsRef.current.length) return
    
    const totalItems = NAMES.length
    const rawProgress = scrollState.current.current * totalItems
    const newActiveIndex = Math.round(rawProgress) % totalItems
    const normalizedIndex = ((newActiveIndex % totalItems) + totalItems) % totalItems
    
    if (normalizedIndex !== activeIndexRef.current) {
      previousIndexRef.current = activeIndexRef.current
      activeIndexRef.current = normalizedIndex
      updateImageDisplay()
    }
  }

  const updateImageDisplay = () => {
    if (!imagesRef.current.length) return
    
    const activeIndex = activeIndexRef.current
    const previousIndex = previousIndexRef.current
    const totalItems = NAMES.length

    gsap.to(imageContainerRef.current, {
      autoAlpha: 1,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto"
    })

    let direction = 1 
    if (previousIndex === totalItems - 1 && activeIndex === 0) {
        direction = 1 
    } else if (previousIndex === 0 && activeIndex === totalItems - 1) {
        direction = -1 
    } else {
        direction = activeIndex > previousIndex ? 1 : -1
    }

    imagesRef.current.forEach((img, i) => {
      if (i === activeIndex) {
        gsap.fromTo(img, 
          { y: direction > 0 ? "-100%" : "100%", opacity: 1, zIndex: 10 },
          {
            y: "0%",
            opacity: 1,
            zIndex: 10,
            duration: 0.5, 
            ease: "expo.out", 
            overwrite: "auto",
          }
        )
      } else if (i === previousIndex) {
        gsap.to(img, {
            y: direction > 0 ? "100%" : "-100%",
            opacity: 1,
            zIndex: 5,
            duration: 0.5, 
            ease: "expo.out",
            overwrite: "auto",
        })
      } else {
        gsap.set(img, { opacity: 0, zIndex: 1 })
      }
    })
  }

  useLayoutEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return

    itemsRef.current = gsap.utils.toArray<HTMLElement>(".circle-item")
    imagesRef.current = gsap.utils.toArray<HTMLImageElement>(".circle-image")
    const items = itemsRef.current

    gsap.set(imageContainerRef.current, { autoAlpha: 1 })
    gsap.set(imagesRef.current, { opacity: 0 })
    
    // Show first image on load
    if (imagesRef.current[0]) {
      gsap.set(imagesRef.current[0], { opacity: 1, zIndex: 10 })
    }

    const updateItemsPosition = () => {
      const radius = (wrapperRef.current!.offsetWidth / 2) * 0.9
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const totalItems = items.length
      const spacing = (Math.PI * 2) / totalItems
      
      const currentScroll = scrollState.current.current
      
      items.forEach((item, index) => {
        const angle = index * spacing - currentScroll * Math.PI * 2
        
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        const rotation = (angle * 180) / Math.PI
        
        // Calculate distance from center (top of screen)
        const distanceFromCenter = Math.abs(y - centerY)
        const maxDistance = centerY
        const proximityFactor = 1 - Math.min(distanceFromCenter / maxDistance, 1)
        
        // Spotlight effect: fade based on proximity to center
        const opacity = 0.2 + (proximityFactor * 0.8)

        gsap.set(item, { 
          x, 
          y, 
          rotation, 
          opacity,
          transformOrigin: "center center" 
        })
      })
      
      updateActiveIndex()
    }

    const ticker = gsap.ticker.add(() => {
      scrollState.current.current += (scrollState.current.target - scrollState.current.current) * 0.06
      
      if (Math.abs(scrollState.current.current - scrollState.current.last) > 0.00001) {
        updateItemsPosition()
        scrollState.current.last = scrollState.current.current
      }
    })

    return () => {
      gsap.ticker.remove(ticker)
    }
  }, [])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      scrollState.current.target += e.deltaY * 0.0005
    }

    let touchStart = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStart = e.touches[0].clientY
    }
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY
      const deltaY = touchStart - touchY
      scrollState.current.target += deltaY * 0.001
      touchStart = touchY
    }

    window.addEventListener("wheel", handleWheel)
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
        
        <div 
          ref={imageContainerRef}
          className="absolute right-[10vw] md:right-[15vw] top-1/2 -translate-y-1/2 w-62.5 h-62.5 md:w-87.5 md:h-87.5 pointer-events-none z-20 perspective-1000 overflow-hidden bg-background shadow-2xl opacity-0 invisible rounded-2xl border-2 border-foreground/20 p-2"
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            {IMAGES.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={NAMES[i]}
                className="circle-image absolute top-0 left-0 w-full h-full object-cover will-change-transform rounded-xl"
              />
            ))}
          </div>
        </div>

        <ul
          ref={wrapperRef}
          className="absolute w-screen h-full left-[30%] -translate-x-full list-none p-0 m-0 pointer-events-none"
        >
          {NAMES.map((name, i) => (
            <li
              key={i}
              className="circle-item pointer-events-none cursor-default absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-40 md:w-100 whitespace-nowrap text-[clamp(1rem,3vw,3rem)] uppercase font-sans will-change-transform select-none"
            >
              {name}
            </li>
          ))}
        </ul>

      </div>
    </div>
  )
}
