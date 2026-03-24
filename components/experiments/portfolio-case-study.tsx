"use client";

import { useScroll, useTransform, motion, MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

const projects = [
  {
    type: "cover" as const,
    index: "01",
    title: "Horizon",
    subtitle: "Brand Identity & Design System",
    tags: ["Branding", "UI Design", "Motion"],
    bg: "#0f0f0f",
    accent: "#e8d5b0",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=2000",
  },
  {
    type: "case" as const,
    index: "01",
    title: "Horizon",
    subtitle: "Brand Identity & Design System",
    year: "2024",
    role: "Lead Designer",
    bg: "#e8d5b0",
    accent: "#0f0f0f",
    description:
      "A full identity overhaul for a fintech startup — from logo mark to component library. The system covers 200+ components across web and mobile with a token-based theming architecture.",
    stats: [
      { label: "Components", value: "200+" },
      { label: "Platforms", value: "3" },
      { label: "Shipped", value: "Q2 '24" },
    ],
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=2000",
  },
  {
    type: "cover" as const,
    index: "02",
    title: "Verdant",
    subtitle: "E-commerce Experience",
    tags: ["Product Design", "Interaction", "3D"],
    bg: "#1a2e1a",
    accent: "#b8e6b8",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000",
  },
  {
    type: "case" as const,
    index: "02",
    title: "Verdant",
    subtitle: "E-commerce Experience",
    year: "2024",
    role: "Product Designer",
    bg: "#b8e6b8",
    accent: "#1a2e1a",
    description:
      "Reimagined the shopping experience for a sustainable goods brand. Introduced 3D product previews, a scroll-driven storytelling flow, and a checkout redesign that cut drop-off by 34%.",
    stats: [
      { label: "Drop-off", value: "−34%" },
      { label: "Conv. Rate", value: "+18%" },
      { label: "NPS", value: "72" },
    ],
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000",
  },
  {
    type: "cover" as const,
    index: "03",
    title: "Solace",
    subtitle: "Health & Wellness App",
    tags: ["Mobile", "UX Research", "Accessibility"],
    bg: "#1e1a2e",
    accent: "#c4b8f0",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2000",
  },
  {
    type: "case" as const,
    index: "03",
    title: "Solace",
    subtitle: "Health & Wellness App",
    year: "2023",
    role: "UX Lead",
    bg: "#c4b8f0",
    accent: "#1e1a2e",
    description:
      "End-to-end design of a mental wellness app from research to launch. Conducted 40+ user interviews, built a WCAG AA compliant design system, and shipped to 50k users in the first month.",
    stats: [
      { label: "Users (M1)", value: "50k" },
      { label: "Retention", value: "61%" },
      { label: "Rating", value: "4.8★" },
    ],
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2000",
  },
];

function Section({
  index,
  total,
  scrollYProgress,
  data,
}: {
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  data: (typeof projects)[number];
}) {
  const transitions = total - 1;

  const getTransforms = () => {
    if (total === 1) return { scale: 1, rotate: 0 };

    const exitStart = index / transitions;
    const exitEnd = (index + 1) / transitions;
    const enterStart = (index - 1) / transitions;
    const enterEnd = index / transitions;

    if (index === 0) {
      return {
        scale: useTransform(scrollYProgress, [exitStart, exitEnd], [1, 0.8]),
        rotate: useTransform(scrollYProgress, [exitStart, exitEnd], [0, -5]),
      };
    }

    if (index === total - 1) {
      return {
        scale: useTransform(scrollYProgress, [enterStart, enterEnd], [0.8, 1]),
        rotate: useTransform(scrollYProgress, [enterStart, enterEnd], [5, 0]),
      };
    }

    return {
      scale: useTransform(
        scrollYProgress,
        [enterStart, enterEnd, exitStart, exitEnd],
        [0.8, 1, 1, 0.8],
      ),
      rotate: useTransform(
        scrollYProgress,
        [enterStart, enterEnd, exitStart, exitEnd],
        [5, 0, 0, -5],
      ),
    };
  };

  const { scale, rotate } = getTransforms();

  if (data.type === "cover") {
    return (
      <motion.div
        style={{ scale, rotate, backgroundColor: data.bg }}
        className="sticky top-0 h-screen overflow-hidden flex items-end"
      >
        <img
          src={data.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 p-10 md:p-16 w-full flex justify-between items-end">
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.2em] mb-4 font-medium"
              style={{ color: data.accent, opacity: 0.6 }}
            >
              Case Study {data.index}
            </p>
            <h2
              className="text-[12vw] md:text-[9vw] font-bold leading-none tracking-tight"
              style={{ color: data.accent }}
            >
              {data.title}
            </h2>
            <p
              className="text-lg md:text-xl mt-2 font-light"
              style={{ color: data.accent, opacity: 0.7 }}
            >
              {data.subtitle}
            </p>
          </div>
          <div className="hidden md:flex flex-col gap-2 items-end pb-2">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] uppercase tracking-widest px-3 py-1 rounded-full border font-medium"
                style={{
                  color: data.accent,
                  borderColor: `${data.accent}40`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ scale, rotate, backgroundColor: data.bg }}
      className="sticky top-0 h-screen overflow-hidden flex"
    >
      {/* Left: content */}
      <div className="flex flex-col justify-between p-10 md:p-16 w-full md:w-1/2 z-10">
        <div className="flex justify-between items-start">
          <p
            className="text-[11px] uppercase tracking-[0.2em] font-medium"
            style={{ color: data.accent, opacity: 0.5 }}
          >
            {data.year} — {data.role}
          </p>
          <span
            className="text-[11px] uppercase tracking-widest font-medium"
            style={{ color: data.accent, opacity: 0.4 }}
          >
            {data.index} / 03
          </span>
        </div>

        <div>
          <h2
            className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-4"
            style={{ color: data.accent }}
          >
            {data.title}
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed max-w-md font-light"
            style={{ color: data.accent, opacity: 0.7 }}
          >
            {data.description}
          </p>
        </div>

        <div className="flex gap-10">
          {data.stats.map((stat) => (
            <div key={stat.label}>
              <p
                className="text-3xl md:text-4xl font-bold tabular-nums"
                style={{ color: data.accent }}
              >
                {stat.value}
              </p>
              <p
                className="text-[11px] uppercase tracking-widest mt-1 font-medium"
                style={{ color: data.accent, opacity: 0.5 }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: image */}
      <div className="hidden md:block absolute right-0 top-0 w-1/2 h-full">
        <img
          src={data.image}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.6 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${data.bg} 0%, transparent 40%)`,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function PortfolioCaseStudyExperiment() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const lenis = new Lenis();

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
    <main
      ref={container}
      className="relative"
      style={{ height: `${projects.length * 100}vh` }}
    >
      {projects.map((data, i) => (
        <Section
          key={i}
          index={i}
          total={projects.length}
          scrollYProgress={scrollYProgress}
          data={data}
        />
      ))}
    </main>
  );
}
