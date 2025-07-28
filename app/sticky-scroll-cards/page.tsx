"use client";

import { useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import Card from "@/components/sticky-scroll-cards/Card";

const CardImages = [
  "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb",
  "https://images.unsplash.com/photo-1513622118278-bc041b3c13ed",
  "https://images.unsplash.com/photo-1605315188787-e3c8f6bf927a",
  "https://images.unsplash.com/photo-1503614472-8c93d56e92ce",
  "https://images.unsplash.com/photo-1483653364400-eedcfb9f1f88",
  "https://images.unsplash.com/photo-1609412058473-c199497c3c5d",
];

export default function StickyScrollCards() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={container}>
      {CardImages.map((src, i) => {
        const targetScale = 1 - (CardImages.length - i) * 0.05;

        return (
          <Card
            key={`p_${i}`}
            i={i}
            image={src}
            progress={scrollYProgress}
            range={[i * 0.2, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
}
