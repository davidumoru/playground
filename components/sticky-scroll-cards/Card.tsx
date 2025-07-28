"use client";
import Image from "next/image";
import { useTransform, motion, useScroll, MotionValue } from "framer-motion";
import { useRef } from "react";

type CardProps = {
  i: number;
  image: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
};

const Card = ({ i, image, progress, range, targetScale }: CardProps) => {
  const container = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="relative w-full max-w-5xl h-[500px] rounded-[20px] overflow-hidden"
      >
        <motion.div className="w-full h-full" style={{ scale: imageScale }}>
          <Image src={image} alt={`Card ${i}`} fill className="object-cover" priority/>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Card;
