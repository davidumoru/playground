"use client";
import { useState } from "react";
import HoverPreviewItem from "@/components/hover-preview/HoverPreviewItem";
import HoverPreviewModal from "@/components/hover-preview/HoverPreviewModal";

interface ProjectData {
  title: string;
  imageSrc: string;
  backgroundColor: string;
  role: string;
}

const portfolios: ProjectData[] = [
  {
    title: "Dennis Snellenberg",
    imageSrc: "snellenberg.png",
    backgroundColor: "#1f2d3d",
    role: "Designer & Developer",
  },
  {
    title: "Oluwafemi Fashikun",
    imageSrc: "fashikun.png",
    backgroundColor: "#ffa500",
    role: "Graphic & Motion Designer ",
  },
  {
    title: "Oluwaseyi Oluwadare",
    imageSrc: "oluwadare.png",
    backgroundColor: "#2c2c2c",
    role: "Frontend Developer",
  },
  {
    title: "Isaac Fayemi",
    imageSrc: "fayemi.png",
    backgroundColor: "#1e1e1e",
    role: "Visual Designer & Art Director",
  },
];

interface ModalState {
  isActive: boolean;
  activeIndex: number;
}

export default function HoverPreview() {
  const [modalState, setModalState] = useState<ModalState>({
    isActive: false,
    activeIndex: 0,
  });

  return (
    <main className="flex h-screen items-center justify-center px-4 sm:px-6 lg:px-0">
      <div className="flex w-full max-w-[1000px] lg:w-[1000px] flex-col items-center justify-center">
        {portfolios.map((project, index) => (
          <HoverPreviewItem
            key={index}
            index={index}
            title={project.title}
            role={project.role}
            onModalStateChange={setModalState}
          />
        ))}
      </div>
      <HoverPreviewModal modalState={modalState} projects={portfolios} />
    </main>
  );
}
