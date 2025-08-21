"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

export const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  const animate = useCallback(
    (time: number) => {
      if (previousTimeRef.current !== null) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};

interface ActiveImage {
  id: number;
  x: number;
  y: number;
  url: string;
  timestamp: number;
  isExpiring?: boolean;
  rotation: number;
  scale: number;
  velocity: { x: number; y: number };
  targetX: number;
  targetY: number;
}

interface ImageTrailProps {
  images: string[];
  duration?: number;
  fadeOutDuration?: number;
  spawnInterval?: number;
  maxImages?: number;
  movementEase?: string;
}

export const ImageTrail: React.FC<ImageTrailProps> = ({
  images,
  duration = 2.5,
  fadeOutDuration = 0.6,
  spawnInterval = 80,
  maxImages = 12,
}) => {
  const [activeImages, setActiveImages] = useState<ActiveImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const lastSpawnTimeRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const imageIdCounter = useRef(0);

  const manageImageLifecycle = useCallback(() => {
    const now = performance.now();
    const timeToStartFading = duration * 1000 - fadeOutDuration * 1000;
    const timeForFullRemoval = duration * 1000;

    setActiveImages((prevImages) => {
      const updatedImages = prevImages.map((img) => {
        if (now - img.timestamp > timeToStartFading && !img.isExpiring) {
          const imgElement = imageContainerRef.current?.querySelector(
            `[data-id="${img.id}"]`
          );
          if (imgElement) {
            gsap.to(imgElement, {
              opacity: 0,
              scale: img.scale * 0.7,
              duration: fadeOutDuration,
              ease: "power1.out",
            });
          }
          return { ...img, isExpiring: true };
        }
        return img;
      });

      return updatedImages.filter(
        (img) => now - img.timestamp < timeForFullRemoval
      );
    });
  }, [duration, fadeOutDuration]);

  useAnimationFrame(manageImageLifecycle);

  useGSAP(
    () => {
      if (activeImages.length === 0 || !imageContainerRef.current) return;

      const latestImageInfo = activeImages[activeImages.length - 1];
      const latestImageElement = imageContainerRef.current.querySelector(
        `[data-id="${latestImageInfo.id}"]`
      );

      if (!latestImageElement) return;

      gsap.set(latestImageElement, {
        opacity: 0,
        scale: 0.1,
        x: latestImageInfo.x,
        y: latestImageInfo.y,
        rotation: latestImageInfo.rotation,
      });

      gsap.to(latestImageElement, {
        opacity: 0.9,
        scale: latestImageInfo.scale,
        duration: 0.2,
        ease: "power1.out",
      });
    },
    { dependencies: [activeImages], scope: containerRef }
  );

  const addImage = useCallback(
    (x: number, y: number) => {
      const now = performance.now();
      if (now - lastSpawnTimeRef.current < spawnInterval) return;

      lastSpawnTimeRef.current = now;
      lastPositionRef.current = { x, y };

      const newImage: ActiveImage = {
        id: imageIdCounter.current++,
        x,
        y,
        targetX: x,
        targetY: y,
        url: images[currentImageIndex],
        timestamp: now,
        rotation: (Math.random() - 0.5) * 15,
        scale: 0.8 + Math.random() * 0.3,
        velocity: { x: 0, y: 0 },
      };

      setActiveImages((prev) => {
        const newImageList = [...prev, newImage];
        if (newImageList.length > maxImages) {
          return newImageList.slice(newImageList.length - maxImages);
        }
        return newImageList;
      });

      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    },
    [currentImageIndex, images, maxImages, spawnInterval]
  );

  const handlePointerEvent = useCallback(
    (x: number, y: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      addImage(x - rect.left, y - rect.top);
    },
    [addImage]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => handlePointerEvent(e.clientX, e.clientY),
    [handlePointerEvent]
  );

  const preventDefault = (e: TouchEvent) => e.preventDefault();

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        handlePointerEvent(touch.clientX, touch.clientY);
      }
    },
    [handlePointerEvent]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      containerRef.current?.addEventListener("touchmove", preventDefault, {
        passive: false,
      });
      const touch = e.touches[0];
      if (touch) handlePointerEvent(touch.clientX, touch.clientY);
    },
    [handlePointerEvent]
  );

  const handleTouchEnd = useCallback(() => {
    containerRef.current?.removeEventListener("touchmove", preventDefault);
  }, []);

  useEffect(() => {
    const currentRef = containerRef.current;
    return () => {
      currentRef?.removeEventListener("touchmove", preventDefault);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-pointer"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div className="absolute inset-0" ref={imageContainerRef}>
        {activeImages.map((img) => (
          <Image
            key={img.id}
            data-id={img.id}
            src={img.url}
            alt=""
            width={120}
            height={120}
            className="absolute pointer-events-none rounded-lg"
            style={{
              top: 0,
              left: 0,
              transform: `translate(${img.x}px, ${img.y}px)`,
              width: "120px",
              height: "120px",
              objectFit: "cover",
              willChange: "transform, opacity, scale",
            }}
            unoptimized
          />
        ))}
      </div>
    </div>
  );
};

export default function Page() {
  const imageUrls = [
    "https://images.unsplash.com/photo-1683009427590-dd987135e66c",
    "https://images.unsplash.com/photo-1513622118278-bc041b3c13ed",
    "https://images.unsplash.com/photo-1605315188787-e3c8f6bf927a",
    "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb",
    "https://images.unsplash.com/photo-1503614472-8c93d56e92ce",
    "https://images.unsplash.com/photo-1483653364400-eedcfb9f1f88",
    "https://images.unsplash.com/photo-1609412058473-c199497c3c5d",
    "https://images.unsplash.com/photo-1741571530246-227ba4024cdf",
    "https://images.unsplash.com/photo-1741484730838-d8cc2e4a9bf4",
    "https://images.unsplash.com/photo-1741526798351-50eeb46b2a06",
  ].map((url) => `${url}?auto=format&fit=crop&w=400&q=80`);

  return (
    <div className="w-full h-screen">
      <ImageTrail
        images={imageUrls}
        duration={2.0}
        fadeOutDuration={0.5}
        spawnInterval={80}
        maxImages={8}
      />
    </div>
  );
}
