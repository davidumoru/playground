"use client"

import { useRef, useEffect, useLayoutEffect, useCallback, useState } from "react"
import gsap from "gsap"

const sources = [
  {
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1575&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/uploads/1411400493228e06a6315/ad711a20?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/uploads/1412026095116d2b0c90e/3bf33993?q=80&w=1467&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1429704658776-3d38c9990511?q=80&w=1979&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    src: "https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
]

const layoutData = [
  { x: 71, y: 58, w: 400, h: 270 },
  { x: 211, y: 255, w: 540, h: 360 },
  { x: 631, y: 158, w: 400, h: 270 },
  { x: 1191, y: 245, w: 260, h: 195 },
  { x: 351, y: 687, w: 260, h: 290 },
  { x: 751, y: 824, w: 205, h: 154 },
  { x: 911, y: 540, w: 260, h: 350 },
  { x: 1051, y: 803, w: 400, h: 300 },
  { x: 71, y: 922, w: 350, h: 260 },
]

interface GridItem {
  el: HTMLDivElement
  container: HTMLDivElement
  wrapper: HTMLDivElement
  img: HTMLImageElement
  x: number
  y: number
  w: number
  h: number
  extraX: number
  extraY: number
  rect: DOMRect
  ease: number
}

const originalSize = { w: 1522, h: 1238 }

const debounceResize = (func: () => void, wait: number) => {
  let timeout: NodeJS.Timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(), wait)
  }
}

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export default function InfiniteParallaxGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<GridItem[]>([])
  const rafId = useRef<number | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isInitialized = useRef(false)
  const isMobile = useRef(false)

  const scroll = useRef({
    ease: 0.06,
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    last: { x: 0, y: 0 },
    delta: { x: { c: 0, t: 0 }, y: { c: 0, t: 0 } },
  })

  const mouse = useRef({
    x: { t: 0.5, c: 0.5 },
    y: { t: 0.5, c: 0.5 },
    press: { t: 0, c: 0 },
  })

  const drag = useRef({
    startX: 0,
    startY: 0,
    scrollX: 0,
    scrollY: 0,
    active: false,
  })

  const tileSize = useRef({ w: 0, h: 0 })
  const winSize = useRef({ w: 0, h: 0 })

  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    isMobile.current = isMobileDevice()
    if (isMobile.current) {
      scroll.current.ease = 0.08
    }
  }, [])

  const createItems = useCallback(() => {
    if (!containerRef.current) return

    containerRef.current.innerHTML = ""
    itemsRef.current = []

    const baseItems = layoutData.map((d, i) => {
      const scaleX = tileSize.current.w / originalSize.w
      const scaleY = tileSize.current.h / originalSize.h
      const source = sources[i % sources.length]
      return {
        src: source.src,
        x: d.x * scaleX,
        y: d.y * scaleY,
        w: d.w * scaleX,
        h: d.h * scaleY,
      }
    })

    const repsX = [0, tileSize.current.w]
    const repsY = [0, tileSize.current.h]

    baseItems.forEach((base) => {
      repsX.forEach((offsetX) => {
        repsY.forEach((offsetY) => {
          const el = document.createElement("div")
          el.classList.add("item")
          el.style.position = "absolute"
          el.style.top = "0"
          el.style.left = "0"
          el.style.willChange = "transform"
          el.style.whiteSpace = "normal"
          el.style.width = `${base.w}px`

          const wrapper = document.createElement("div")
          wrapper.classList.add("item-wrapper")
          wrapper.style.willChange = "transform"
          el.appendChild(wrapper)

          const itemImage = document.createElement("div")
          itemImage.classList.add("item-image")
          itemImage.style.overflow = "hidden"
          itemImage.style.width = `${base.w}px`
          itemImage.style.height = `${base.h}px`
          wrapper.appendChild(itemImage)

          const img = document.createElement("img")
          img.src = base.src
          img.style.width = "100%"
          img.style.height = "100%"
          img.style.objectFit = "cover"
          img.style.willChange = "transform"
          img.draggable = false
          itemImage.appendChild(img)

          containerRef.current!.appendChild(el)

          itemsRef.current.push({
            el,
            container: itemImage,
            wrapper,
            img,
            x: base.x + offsetX,
            y: base.y + offsetY,
            w: base.w,
            h: base.h,
            extraX: 0,
            extraY: 0,
            rect: el.getBoundingClientRect(),
            ease: Math.random() * 0.3 + 0.4,
          })
        })
      })
    })

    tileSize.current.w *= 2
    tileSize.current.h *= 2

    if (!isInitialized.current) {
      const initialX = -winSize.current.w * 0.1
      const initialY = -winSize.current.h * 0.1
      scroll.current.current.x = scroll.current.target.x = scroll.current.last.x = initialX
      scroll.current.current.y = scroll.current.target.y = scroll.current.last.y = initialY
    }
  }, [])

  const initIntro = useCallback(() => {
    if (!containerRef.current || isInitialized.current) return

    const introItems = Array.from(containerRef.current.querySelectorAll(".item-wrapper")).filter((item) => {
      const rect = item.getBoundingClientRect()
      return (
        rect.x > -rect.width &&
        rect.x < window.innerWidth + rect.width &&
        rect.y > -rect.height &&
        rect.y < window.innerHeight + rect.height
      )
    })

    introItems.forEach((item) => {
      const rect = item.getBoundingClientRect()
      const x = -rect.x + window.innerWidth * 0.5 - rect.width * 0.5
      const y = -rect.y + window.innerHeight * 0.5 - rect.height * 0.5
      gsap.set(item, { x, y })
    })

    gsap.to(introItems.reverse(), {
      duration: isMobile.current ? 1.5 : 2,
      ease: "expo.inOut",
      x: 0,
      y: 0,
      stagger: isMobile.current ? 0.03 : 0.05,
      onComplete: () => {
        isInitialized.current = true
      },
    })
  }, [])

  const handleResize = useCallback(() => {
    const oldWinSize = { ...winSize.current }

    winSize.current.w = window.innerWidth
    winSize.current.h = window.innerHeight

    tileSize.current = {
      w: winSize.current.w,
      h: winSize.current.w * (originalSize.h / originalSize.w),
    }

    const widthChange = Math.abs(winSize.current.w - oldWinSize.w)
    const heightChange = Math.abs(winSize.current.h - oldWinSize.h)

    if (!isInitialized.current || widthChange > 100 || heightChange > 100) {
      scroll.current.current = { x: 0, y: 0 }
      scroll.current.target = { x: 0, y: 0 }
      scroll.current.last = { x: 0, y: 0 }
    }

    createItems()
    initIntro()
  }, [createItems, initIntro])

  const onResize = useCallback(() => {
    const debouncedHandler = debounceResize(handleResize, isMobile.current ? 300 : 150)
    debouncedHandler()
  }, [handleResize])

  const render = useCallback(() => {
    const easeMultiplier = isMobile.current ? 0.5 : 1
    const parallaxIntensity = isMobile.current ? 0.3 : 0.6

    scroll.current.current.x += (scroll.current.target.x - scroll.current.current.x) * scroll.current.ease
    scroll.current.current.y += (scroll.current.target.y - scroll.current.current.y) * scroll.current.ease

    scroll.current.delta.x.t = scroll.current.current.x - scroll.current.last.x
    scroll.current.delta.y.t = scroll.current.current.y - scroll.current.last.y
    scroll.current.delta.x.c += (scroll.current.delta.x.t - scroll.current.delta.x.c) * 0.04
    scroll.current.delta.y.c += (scroll.current.delta.y.t - scroll.current.delta.y.c) * 0.04

    mouse.current.x.c += (mouse.current.x.t - mouse.current.x.c) * 0.04
    mouse.current.y.c += (mouse.current.y.t - mouse.current.y.c) * 0.04
    mouse.current.press.c += (mouse.current.press.t - mouse.current.press.c) * 0.04

    const dirX = scroll.current.current.x > scroll.current.last.x ? "right" : "left"
    const dirY = scroll.current.current.y > scroll.current.last.y ? "down" : "up"

    itemsRef.current.forEach((item) => {
      const newX =
        3 * scroll.current.delta.x.c * item.ease * easeMultiplier +
        (mouse.current.x.c - 0.5) * item.rect.width * parallaxIntensity
      const newY =
        3 * scroll.current.delta.y.c * item.ease * easeMultiplier +
        (mouse.current.y.c - 0.5) * item.rect.height * parallaxIntensity

      const scrollX = scroll.current.current.x
      const scrollY = scroll.current.current.y

      const posX = item.x + scrollX + item.extraX + newX
      const posY = item.y + scrollY + item.extraY + newY

      const beforeX = posX > winSize.current.w
      const afterX = posX + item.rect.width < 0
      if (dirX === "right" && beforeX) item.extraX -= tileSize.current.w
      if (dirX === "left" && afterX) item.extraX += tileSize.current.w

      const beforeY = posY > winSize.current.h
      const afterY = posY + item.rect.height < 0
      if (dirY === "down" && beforeY) item.extraY -= tileSize.current.h
      if (dirY === "up" && afterY) item.extraY += tileSize.current.h

      const fx = item.x + scrollX + item.extraX + newX
      const fy = item.y + scrollY + item.extraY + newY

      item.el.style.transform = `translate3d(${fx}px, ${fy}px, 0)`

      if (!isMobile.current) {
        item.img.style.transform = `scale(${
          1.2 + 0.2 * mouse.current.press.c * item.ease
        }) translate(${-mouse.current.x.c * item.ease * 10}%, ${-mouse.current.y.c * item.ease * 10}%)`
      } else {
        item.img.style.transform = `scale(${1.1 + 0.1 * mouse.current.press.c})`
      }
    })

    scroll.current.last.x = scroll.current.current.x
    scroll.current.last.y = scroll.current.current.y

    rafId.current = requestAnimationFrame(render)
  }, [])

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const factor = isMobile.current ? 0.6 : 0.4
    scroll.current.target.x -= e.deltaX * factor
    scroll.current.target.y -= e.deltaY * factor
  }, [])

  const handlePointerStart = useCallback((clientX: number, clientY: number, preventDefault: () => void) => {
    preventDefault()
    setIsDragging(true)
    document.documentElement.classList.add("dragging")
    mouse.current.press.t = 1
    drag.current.active = true
    drag.current.startX = clientX
    drag.current.startY = clientY
    drag.current.scrollX = scroll.current.target.x
    drag.current.scrollY = scroll.current.target.y
  }, [])

  const handlePointerEnd = useCallback(() => {
    setIsDragging(false)
    document.documentElement.classList.remove("dragging")
    mouse.current.press.t = 0
    drag.current.active = false
  }, [])

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    mouse.current.x.t = clientX / winSize.current.w
    mouse.current.y.t = clientY / winSize.current.h

    if (drag.current.active) {
      const dx = clientX - drag.current.startX
      const dy = clientY - drag.current.startY
      scroll.current.target.x = drag.current.scrollX + dx
      scroll.current.target.y = drag.current.scrollY + dy
    }
  }, [])

  const onMouseDown = useCallback(
    (e: MouseEvent) => {
      handlePointerStart(e.clientX, e.clientY, () => e.preventDefault())
    },
    [handlePointerStart],
  )

  const onMouseUp = useCallback(() => {
    handlePointerEnd()
  }, [handlePointerEnd])

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY)
    },
    [handlePointerMove],
  )

  const onTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0]
      handlePointerStart(touch.clientX, touch.clientY, () => e.preventDefault())
    },
    [handlePointerStart],
  )

  const onTouchEnd = useCallback(() => {
    handlePointerEnd()
  }, [handlePointerEnd])

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handlePointerMove(touch.clientX, touch.clientY)
    },
    [handlePointerMove],
  )

  useLayoutEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("visible", entry.isIntersecting)
      })
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  useLayoutEffect(() => {
    onResize()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [onResize])

  useEffect(() => {
    const container = containerRef.current

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)

    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("touchend", onTouchEnd)

    if (container) {
      container.addEventListener("mousedown", onMouseDown)
      container.addEventListener("touchstart", onTouchStart, {
        passive: false,
      })
    }

    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      if (container) {
        container.removeEventListener("mousedown", onMouseDown)
        container.removeEventListener("touchstart", onTouchStart)
      }
    }
  }, [onWheel, onMouseMove, onMouseUp, onTouchMove, onTouchEnd, onMouseDown, onTouchStart])

  useEffect(() => {
    rafId.current = requestAnimationFrame(render)
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [render])

  return (
    <main
      className={`w-screen h-screen font-mono overflow-hidden select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        fontFamily: "'Roboto Mono', monospace",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <div
        id="images"
        ref={containerRef}
        className="relative w-full h-full inline-block whitespace-nowrap"
        style={{
          whiteSpace: "nowrap",
          position: "relative",
        }}
      />

      <style jsx global>{`
        html.dragging {
          cursor: grabbing !important;
        }

        html.dragging * {
          cursor: grabbing !important;
        }

        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        img {
          pointer-events: none;
        }
      `}</style>
    </main>
  )
}
