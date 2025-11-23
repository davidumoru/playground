'use client';

import { useState, useEffect } from 'react';

export default function DiagonalCarousel() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentScroll, setCurrentScroll] = useState(0);

  const images = [
    'https://images.unsplash.com/photo-1760340769739-653d00200baf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
    'https://images.unsplash.com/photo-1753301639019-53340bb79d03?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627',
    'https://plus.unsplash.com/premium_photo-1756120053159-433dcffeeb10?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
    'https://plus.unsplash.com/premium_photo-1673137880579-c1ed2a4230b8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764',
    'https://images.unsplash.com/photo-1631034339054-a3ff59f238df?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=625',
    'https://plus.unsplash.com/premium_photo-1728280883821-8e2b416a878a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  ];

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScrollProgress((prev) => prev + e.deltaY * 0.001);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setScrollProgress((prev) => Math.round(prev) + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setScrollProgress((prev) => Math.round(prev) - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setCurrentScroll(scrollProgress);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    const scrollDelta = -deltaY * 0.002;
    setScrollProgress(currentScroll + scrollDelta);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, startY, currentScroll]);

  const getItemPosition = (globalIndex: number) => {
    const itemProgress = globalIndex - scrollProgress;
    
    const diagonalProgress = itemProgress;
    
    const curveAmount = 0.08;
    const curveOffset = Math.sin(diagonalProgress * Math.PI * 0.3) * curveAmount;
    
    const x = diagonalProgress * 25 + curveOffset * 15;
    const y = diagonalProgress * 25 - curveOffset * 10;
    
    const bottomAngle = -30;
    const topAngle = -5;
    
    const yRange = 50;
    const normalizedY = (y + yRange/2) / yRange;
    const clampedY = Math.max(0, Math.min(1, normalizedY));
    
    const rotation = bottomAngle + (topAngle - bottomAngle) * clampedY;
    
    const scaleFactor = 1 - Math.abs(Math.sin(diagonalProgress * 0.2)) * 0.1;
    const scale = Math.max(0.8, Math.min(1, scaleFactor));
    
    return { x, y, scale, rotation };
  };

  const renderImages = () => {
    const elements: React.ReactNode[] = [];
    const totalItems = images.length;
    
    // Calculate which images to render based on scroll position
    const startIndex = Math.floor(scrollProgress) - 8;
    const endIndex = Math.floor(scrollProgress) + 15;
    
    for (let i = startIndex; i <= endIndex; i++) {
      const imageIndex = ((i % totalItems) + totalItems) % totalItems;
      const { x, y, scale, rotation } = getItemPosition(i);
      
      elements.push(
        <div
          key={`${i}`}
          className="absolute pointer-events-auto"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${x}vh), calc(-50% + ${y}vh)) rotate(${rotation}deg) scale(${scale})`,
            transition: isDragging 
              ? 'none' 
              : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            willChange: 'transform',
          }}
        >
          <div
            className="rounded-2xl shadow-2xl overflow-hidden bg-gray-800"
            style={{
              width: '280px',
              height: '380px',
            }}
          >
            <img
              src={images[imageIndex]}
              alt=""
              className="w-full h-full object-cover"
              draggable="false"
            />
          </div>
        </div>
      );
    }
    
    return elements;
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {renderImages()}
      </div>
    </div>
  );
}
