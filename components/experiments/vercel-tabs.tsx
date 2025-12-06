"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useState, useRef, useEffect } from "react"

const tabs = ["Overview", "Integrations", "Deployments", "Activity", "Domains", "Usage"]

export default function Frame() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverStyle, setHoverStyle] = useState({})
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" })
  
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])

  const updateTabStyle = (index: number | null, setStyle: (style: any) => void) => {
    if (index === null) return
    const element = tabRefs.current[index]
    if (element) {
      setStyle({
        left: `${element.offsetLeft}px`,
        width: `${element.offsetWidth}px`,
      })
    }
  }

  useEffect(() => {
    updateTabStyle(hoveredIndex, setHoverStyle)
  }, [hoveredIndex])

  useEffect(() => {
    updateTabStyle(activeIndex, setActiveStyle)
  }, [activeIndex])

  useEffect(() => {
    requestAnimationFrame(() => {
      updateTabStyle(0, setActiveStyle)
    })
  }, [])

  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <Card className="w-full max-w-[1200px] h-[100px] border-none shadow-none relative flex items-center justify-center">
        <CardContent className="p-0">
          <div className="relative">
            
            <div
              className="absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] rounded-[6px] flex items-center"
              style={{
                ...hoverStyle,
                opacity: hoveredIndex !== null ? 1 : 0,
              }}
            />

            <div
              className="absolute bottom-[-6px] h-[2px] bg-[#0e0f11] transition-all duration-300 ease-out"
              style={activeStyle}
            />

            <div className="relative flex space-x-[6px] items-center">
              {tabs.map((tab, index) => (
                <div
                  key={index}
                  ref={(el) => { tabRefs.current[index] = el }}
                  className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] ${
                    index === activeIndex || index === hoveredIndex ? "text-[#0e0e10]" : "text-[#0e0f1199]"
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className="text-sm leading-5 whitespace-nowrap flex items-center justify-center h-full">
                    {tab}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
