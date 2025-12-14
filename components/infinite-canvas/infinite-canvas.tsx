"use client"

import type React from "react"
import { useEffect, useRef, useCallback, useState, useMemo } from "react"
import gsap from "gsap"
import Image from "next/image"

interface InfiniteCanvasProps {
  images?: string[]
  columns?: number
  imageWidth?: number
  gap?: number
}

const heightRatios = [
  1.4, 0.75, 1.2, 1.0, 1.5, 0.85, 1.3, 0.9, 1.15, 1.0, 0.8, 1.35, 1.1, 0.95, 1.25, 1.0, 0.7, 1.45, 1.05, 0.88,
]

const columnOffsets = [0, -120, -60, -180, -40, -140]

export function InfiniteCanvas({ images, columns = 5, imageWidth = 220, gap = 50 }: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  
  const positionRef = useRef({ x: 0, y: 0 })
  const velocityRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)
  const lastPointerRef = useRef({ x: 0, y: 0 })
  const dragDistanceRef = useRef(0)
  
  const xSet = useRef<((value: number) => void) | null>(null)
  const ySet = useRef<((value: number) => void) | null>(null)
  
  const tileRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const entranceAnimationRef = useRef<gsap.core.Tween | null>(null)
  
  const clickedRectRef = useRef<DOMRect | null>(null)
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedTileSize, setSelectedTileSize] = useState<{ width: number; height: number } | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)
  
  const previewRef = useRef<HTMLDivElement>(null)

  const defaultImages = [
    "https://images.unsplash.com/photo-1513569771920-c9e1d31714af?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1560233863-7b0ea060b62e?q=80&w=631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1518972734183-c5b490a7c637?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1676892435585-d29aee82ad6d?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1470338210301-5bb1f0876962?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1635297383087-8842f98f908a?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1520262494112-9fe481d36ec3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1484864771740-6464cff395d8?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1440899046124-38241f9fe54d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1535442015126-7f00526ce88a?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?q=80&w=681&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1504019853082-9a4cb128c1ef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661880452033-a41bd5e32eae?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1596803897647-af3caf0f4446?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1604971439899-0c23fe60ea9d?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1521035227181-90af4feddc6c?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1729262342250-597df6e7a365?q=80&w=694&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1746417461105-51b89a61907f?q=80&w=706&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1574415399341-1054f00bc9fc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1694094313123-36509fc3e1ab?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ]

  const imageList = images || defaultImages

  const columnWidth = imageWidth + gap
  const imagesPerColumn = 6

  const masterColumnLayouts = useMemo(() => {
    const rawColumns = Array.from({ length: columns }, (_, colIndex) => {
      const baseOffset = columnOffsets[colIndex % columnOffsets.length]
      const images = []
      let yOffset = 0

      for (let rowIndex = 0; rowIndex < imagesPerColumn; rowIndex++) {
        const imageIndex = (colIndex * imagesPerColumn + rowIndex) % imageList.length
        const ratio = heightRatios[imageIndex % heightRatios.length]
        const imageHeight = Math.round(imageWidth * ratio)

        images.push({
          src: imageList[imageIndex],
          width: imageWidth,
          height: imageHeight,
          rowIndex,
          originalHeight: imageHeight 
        })

        yOffset += imageHeight + gap
      }

      return {
        baseOffset,
        images,
        contentHeight: yOffset, 
      }
    })

    const maxContentHeight = Math.max(...rawColumns.map((c) => c.contentHeight))

    return rawColumns.map((col) => {
      const heightDeficit = maxContentHeight - col.contentHeight
      const addPerImage = heightDeficit / imagesPerColumn

      let currentY = 0
      
      const adjustedImages = col.images.map((img) => {
        const newHeight = img.originalHeight + addPerImage
        
        const imageObj = {
          ...img,
          relativeY: Math.round(col.baseOffset + currentY),
          height: newHeight, 
        }
        
        currentY += newHeight + gap
        return imageObj
      })

      return {
        images: adjustedImages,
        totalHeight: Math.round(col.baseOffset + currentY), 
      }
    })
  }, [columns, imageWidth, gap, imageList])

  const gridWidth = columnWidth * columns
  const gridHeight = Math.max(...masterColumnLayouts.map(col => col.totalHeight))

  const tiles = useMemo(() => {
    return Array.from({ length: 9 }, (_, tileIndex) => {
      const tileRow = Math.floor(tileIndex / 3) - 1
      const tileCol = (tileIndex % 3) - 1

      const columnTiles: Array<{
        x: number
        y: number
        src: string
        key: string
        width: number
        height: number
      }> = []

      for (let colIndex = 0; colIndex < columns; colIndex++) {
        const layout = masterColumnLayouts[colIndex]
        
        layout.images.forEach((img) => {
          columnTiles.push({
            x: tileCol * gridWidth + colIndex * columnWidth,
            y: tileRow * gridHeight + img.relativeY, 
            src: img.src,
            key: `${tileIndex}-${colIndex}-${img.rowIndex}`,
            width: img.width,
            height: img.height,
          })
        })
      }

      return columnTiles
    }).flat()
  }, [columns, columnWidth, gridWidth, gridHeight, masterColumnLayouts])

  useEffect(() => {
    if (gridRef.current) {
      xSet.current = gsap.quickSetter(gridRef.current, "x", "px") as (value: number) => void
      ySet.current = gsap.quickSetter(gridRef.current, "y", "px") as (value: number) => void
    }
  }, [])

  const updatePosition = useCallback(() => {
    if (!gridRef.current || !xSet.current || !ySet.current) return
    if (isPreviewOpen) return

    if (!isDraggingRef.current) {
      velocityRef.current.x *= 0.95
      velocityRef.current.y *= 0.95

      if (Math.abs(velocityRef.current.x) < 0.05 && Math.abs(velocityRef.current.y) < 0.05) {
        velocityRef.current.x = 0
        velocityRef.current.y = 0
      }
    }

    positionRef.current.x += velocityRef.current.x
    positionRef.current.y += velocityRef.current.y

    const wrappedX = ((positionRef.current.x % gridWidth) + gridWidth) % gridWidth
    const wrappedY = ((positionRef.current.y % gridHeight) + gridHeight) % gridHeight

    xSet.current(wrappedX - gridWidth)
    ySet.current(wrappedY - gridHeight)
  }, [gridWidth, gridHeight, isPreviewOpen])

  useEffect(() => {
    gsap.ticker.add(updatePosition)
    return () => {
      gsap.ticker.remove(updatePosition)
    }
  }, [updatePosition])

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isPreviewOpen) return

      isDraggingRef.current = true
      lastPointerRef.current = { x: e.clientX, y: e.clientY }
      velocityRef.current = { x: 0, y: 0 }
      dragDistanceRef.current = 0
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [isPreviewOpen],
  )

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return

    const dx = e.clientX - lastPointerRef.current.x
    const dy = e.clientY - lastPointerRef.current.y

    dragDistanceRef.current += Math.abs(dx) + Math.abs(dy)

    positionRef.current.x += dx
    positionRef.current.y += dy

    velocityRef.current.x = dx
    velocityRef.current.y = dy

    lastPointerRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (isPreviewOpen) return

      e.preventDefault()

      velocityRef.current.x -= e.deltaX * 0.02
      velocityRef.current.y -= e.deltaY * 0.02
    },
    [isPreviewOpen],
  )

  const slideOutImages = useCallback((clickedKey: string, originX: number, originY: number) => {
    const container = containerRef.current
    if (!container) return

    const viewportWidth = container.clientWidth
    const viewportHeight = container.clientHeight

    tileRefs.current.forEach((element, mapKey) => {
      const [key] = mapKey.split("|")

      if (key === clickedKey) return

      const rect = element.getBoundingClientRect()
      const tileCenterX = rect.left + rect.width / 2
      const tileCenterY = rect.top + rect.height / 2

      const dirX = tileCenterX - originX
      const dirY = tileCenterY - originY
      const distance = Math.sqrt(dirX * dirX + dirY * dirY) || 1
      const normalizedX = dirX / distance
      const normalizedY = dirY / distance

      const slideDistance = Math.max(viewportWidth, viewportHeight)

      gsap.to(element, {
        x: normalizedX * slideDistance,
        y: normalizedY * slideDistance,
        duration: 0.6,
        ease: "power3.inOut",
      })
    })
  }, [])

  const slideInImages = useCallback((excludeKey?: string) => {
    tileRefs.current.forEach((element, mapKey) => {
      const [key] = mapKey.split("|")
      
      if (key === excludeKey) return

      gsap.to(element, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
      })
    })
  }, [])

  const handleImageClick = useCallback(
    (key: string, src: string) => {
      if (dragDistanceRef.current < 5) {
        if (entranceAnimationRef.current && entranceAnimationRef.current.isActive()) {
            entranceAnimationRef.current.progress(1).kill();
        }
        
        const element = tileRefs.current.get(`${key}|${src}`)
        if (element) {
          const rect = element.getBoundingClientRect()
          clickedRectRef.current = rect
          
          setSelectedTileSize({ width: rect.width, height: rect.height })
          
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          
          setSelectedImage(src)
          setActiveKey(key)
          setIsPreviewOpen(true)
          
          slideOutImages(key, centerX, centerY)
        }
      }
    },
    [slideOutImages],
  )

  const closePreview = useCallback(() => {
    if (!previewRef.current || !clickedRectRef.current) return

    const clickedRect = clickedRectRef.current
    const previewRect = previewRef.current.getBoundingClientRect()
    const containerCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const clickedCenter = {
      x: clickedRect.left + clickedRect.width / 2,
      y: clickedRect.top + clickedRect.height / 2,
    }

    const xDiff = clickedCenter.x - containerCenter.x
    const yDiff = clickedCenter.y - containerCenter.y
    const scaleX = clickedRect.width / previewRect.width
    const scaleY = clickedRect.height / previewRect.height
    const scale = Math.min(scaleX, scaleY)

    gsap.to(previewRef.current, {
      x: xDiff,
      y: yDiff,
      scale: scale,
      boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)",
      duration: 0.5,
      ease: "power3.inOut",
      onComplete: () => {
        setIsRestoring(true)
        setActiveKey(null)
        
        setTimeout(() => {
          setIsPreviewOpen(false)
          setSelectedImage(null)
          setSelectedTileSize(null)
          clickedRectRef.current = null
          
          setIsRestoring(false)
        }, 10)
      },
    })

    slideInImages(activeKey || undefined)
  }, [slideInImages, activeKey])

  useEffect(() => {
    if (isPreviewOpen && previewRef.current && clickedRectRef.current) {
      const clickedRect = clickedRectRef.current
      const previewRect = previewRef.current.getBoundingClientRect()

      const containerCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      const clickedCenter = {
        x: clickedRect.left + clickedRect.width / 2,
        y: clickedRect.top + clickedRect.height / 2,
      }

      const xDiff = clickedCenter.x - containerCenter.x
      const yDiff = clickedCenter.y - containerCenter.y

      const scaleX = clickedRect.width / previewRect.width
      const scaleY = clickedRect.height / previewRect.height
      const scale = Math.min(scaleX, scaleY)

      gsap.fromTo(
        previewRef.current,
        {
          x: xDiff,
          y: yDiff,
          scale: scale,
          opacity: 1,
          boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)",
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          duration: 0.6,
          ease: "power3.inOut",
        },
      )
    }
  }, [isPreviewOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPreviewOpen) {
        closePreview()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPreviewOpen, closePreview])

  useEffect(() => {
    entranceAnimationRef.current = gsap.fromTo(
      gridRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
    )
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheelEvent = (e: WheelEvent) => handleWheel(e)
    container.addEventListener("wheel", handleWheelEvent, { passive: false })

    return () => {
      container.removeEventListener("wheel", handleWheelEvent)
    }
  }, [handleWheel])

  const setTileRef = useCallback((key: string, src: string, element: HTMLDivElement | null) => {
    const refKey = `${key}|${src}`
    if (element) {
      tileRefs.current.set(refKey, element)
    } else {
      tileRefs.current.delete(refKey)
    }
  }, [])

  const getPreviewDimensions = () => {
    if (!selectedTileSize) return { width: 0, height: 0 }

    const viewportWidth = window.innerWidth * 0.5
    const viewportHeight = window.innerHeight * 0.5
    const tileRatio = selectedTileSize.width / selectedTileSize.height

    let width = viewportHeight * tileRatio
    let height = viewportHeight

    if (width > viewportWidth) {
      width = viewportWidth
      height = viewportWidth / tileRatio
    }

    return { width, height }
  }

  const previewDims = isPreviewOpen ? getPreviewDimensions() : { width: 0, height: 0 }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing select-none"
      style={{ backgroundColor: "#ffffff" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div
        ref={gridRef}
        className="absolute will-change-transform"
        style={{
          width: gridWidth * 3,
          height: gridHeight * 3,
        }}
      >
        {tiles.map((tile) => (
          <div
            key={tile.key}
            ref={(el) => setTileRef(tile.key, tile.src, el)}
            className="absolute overflow-hidden bg-neutral-100"
            style={{
              left: tile.x + gridWidth,
              top: tile.y + gridHeight,
              width: tile.width,
              height: tile.height,
              opacity: activeKey === tile.key ? 0 : 1,
              transition: (activeKey === tile.key || isRestoring) ? "none" : "opacity 0.3s ease",
            }}
            onClick={() => handleImageClick(tile.key, tile.src)}
          >
            <Image
              src={tile.src || "/placeholder.svg"}
              alt=""
              fill
              className="object-cover pointer-events-none"
              draggable={false}
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-x-0 top-0 h-32"
          style={{ background: "linear-gradient(to bottom, #ffffff, transparent)" }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{ background: "linear-gradient(to top, #ffffff, transparent)" }}
        />
        <div
          className="absolute inset-y-0 left-0 w-32"
          style={{ background: "linear-gradient(to right, #ffffff, transparent)" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-32"
          style={{ background: "linear-gradient(to left, #ffffff, transparent)" }}
        />
      </div>

      {isPreviewOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={closePreview}>
          <div
            ref={previewRef}
            className="relative z-10 overflow-hidden"
            style={{
              width: previewDims.width,
              height: previewDims.height,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt=""
              fill
              className="object-cover block"
              priority
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  )
}
