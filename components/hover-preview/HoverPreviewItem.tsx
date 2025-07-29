"use client";
import React from "react";

interface ModalState {
  isActive: boolean;
  activeIndex: number;
}

interface HoverPreviewItemProps {
  index: number;
  title: string;
  role: string;
  onModalStateChange: (state: ModalState) => void;
}

export default function HoverPreviewItem({
  index,
  title,
  role,
  onModalStateChange,
}: HoverPreviewItemProps) {
  const handleMouseEnter = () => {
    onModalStateChange({ isActive: true, activeIndex: index });
  };

  const handleMouseLeave = () => {
    onModalStateChange({ isActive: false, activeIndex: index });
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex w-full cursor-pointer items-center justify-between border-t border-gray-300 px-25 py-12.5 transition-all duration-200 last:border-b hover:opacity-50"
    >
      <h2 className="m-0 text-6xl font-normal transition-all duration-400 group-hover:-translate-x-2.5">
        {title}
      </h2>
      <p className="font-light transition-all duration-400 group-hover:translate-x-2.5">
        {role}
      </p>
    </div>
  );
}
