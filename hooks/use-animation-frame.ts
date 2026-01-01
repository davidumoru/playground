"use client"

import { useEffect, useRef } from "react"

export function useAnimationFrame(callback: () => void) {
  const requestRef = useRef<number | null>(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const animate = () => {
      callbackRef.current()
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])
}
