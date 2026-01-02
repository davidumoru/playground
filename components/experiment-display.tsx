"use client"

import type React from "react"

import dynamic from "next/dynamic"

const experiments: Record<string, React.ComponentType> = {
  DiagonalCarousel: dynamic(() => import("./experiments/diagonal-carousel"), {
    loading: () => <ExperimentLoader />,
  }),
  VerticalTextReveal: dynamic(() => import("./experiments/vertical-text-reveal"), {
    loading: () => <ExperimentLoader />,
  }),
  ThreeDHoverTransform: dynamic(() => import("./experiments/three-d-hover-transform"), {
    loading: () => <ExperimentLoader />,
  }),
  PhotoSphere: dynamic(() => import("./experiments/photo-sphere"), {
    loading: () => <ExperimentLoader />,
  }),
  ThreeDPhotoCarousel: dynamic(() => import("./experiments/three-d-photo-carousel"), {
    loading: () => <ExperimentLoader />,
  }),
  HoverPreview: dynamic(() => import("./experiments/hover-preview"), {
    loading: () => <ExperimentLoader />,
  }),
  ImageTrail: dynamic(() => import("./experiments/image-trail"), {
    loading: () => <ExperimentLoader />,
  }),
  InfiniteParallaxGrid: dynamic(() => import("./experiments/infinite-parallax-grid"), {
    loading: () => <ExperimentLoader />,
  }),
  StickyScrollCards: dynamic(() => import("./experiments/sticky-scroll-cards"), {
    loading: () => <ExperimentLoader />,
  }),
  ScrollVelocity: dynamic(() => import("./experiments/scroll-velocity"), {
    loading: () => <ExperimentLoader />,
  }),
  BentoHover: dynamic(() => import("./experiments/bento-hover"), {
    loading: () => <ExperimentLoader />,
  }),
  InfiniteCarousel: dynamic(() => import("./experiments/infinite-carousel"), {
    loading: () => <ExperimentLoader />,
  }),
  VercelTabs: dynamic(() => import("./experiments/vercel-tabs"), {
    loading: () => <ExperimentLoader />,
  }),
  ScrollImageReveal: dynamic(() => import("./experiments/scroll-image-reveal"), {
    loading: () => <ExperimentLoader />,
  }),
  InfiniteCanvas: dynamic(() => import("./experiments/infinite-canvas"), {
    loading: () => <ExperimentLoader />,
  }),
  CircularScroll: dynamic(() => import("./experiments/circular-scroll"), {
    loading: () => <ExperimentLoader />,
  }),
}

function ExperimentLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          {/* Center dot */}
          <circle cx="50" cy="50" r="3" fill="currentColor" className="text-foreground">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" begin="0s" />
          </circle>

          {/* Orbiting dots */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i * 60 * Math.PI) / 180
            const x = 50 + Math.cos(angle) * 25
            const y = 50 + Math.sin(angle) * 25
            return (
              <circle key={i} cx={x} cy={y} r="2.5" fill="currentColor" className="text-foreground/60">
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="1.5s"
                  repeatCount="indefinite"
                  begin={`${i * 0.15}s`}
                />
              </circle>
            )
          })}

          {/* Rotating ring */}
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-foreground/20"
            strokeDasharray="4 4"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 50 50"
              to="360 50 50"
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
    </div>
  )
}

interface ExperimentDisplayProps {
  experimentId: string
}

export function ExperimentDisplay({ experimentId }: ExperimentDisplayProps) {
  const ExperimentComponent = experiments[experimentId]

  if (!ExperimentComponent) {
    return <div className="flex items-center justify-center text-muted-foreground">Experiment not found</div>
  }

  return (
    <div className="h-full w-full">
      <ExperimentComponent />
    </div>
  )
}
