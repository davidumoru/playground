import { motion, Variants } from "framer-motion";

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
            {images.map((url) => (
              <div
                key={url}
                className="relative mx-3 h-64 w-64 flex-shrink-0 overflow-hidden"
              >
                <img
                  src={url}
                  alt=""
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};