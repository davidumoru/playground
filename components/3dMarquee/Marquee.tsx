import { motion, Variants } from "framer-motion";
import Image from "next/image";

interface MarqueeProps {
  images: string[];
  duration?: number;
  direction?: "left" | "right";
}

export const Marquee = ({
  images,
  duration = 60,
  direction = "left",
}: MarqueeProps) => {
  const marqueeVariants: Variants = {
    animate: {
      x: direction === "left" ? ["0%", "-100%"] : ["-100%", "0%"],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: duration,
        ease: "linear",
      },
    },
  };

  return (
    <div>
      <motion.div
        className="flex"
        variants={marqueeVariants}
        animate="animate"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-shrink-0">
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="relative mx-3 h-64 w-64 flex-shrink-0 overflow-hidden"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  draggable={false}
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};