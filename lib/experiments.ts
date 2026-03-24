export interface Experiment {
  id: string;
  title: string;
  description: string;
  category:
    | "animation"
    | "interaction"
    | "generative"
    | "shader"
    | "layout"
    | "3d";
  tags: string[];
  author: string;
  authorUrl: string;
  sourceUrl: string;
  createdAt: string;
  component: string;
  previewImage?: string;
  previewVideo?: string;
}

export const experiments: Experiment[] = [
  {
    id: "diagonal-carousel",
    title: "Diagonal Carousel",
    description:
      "A smooth diagonal scrolling carousel with spring physics and curved motion paths. Features wheel, keyboard, and drag controls.",
    category: "interaction",
    tags: ["motion", "useMotionValue", "useSpring", "useTransform", "animate"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/diagonal-carousel.tsx",
    createdAt: "2025-10-15",
    component: "DiagonalCarousel",
    previewImage: "/images/previews/diagonal-carousel.jpg",
    previewVideo:
      "https://idfsjg9tmemggmgn.public.blob.vercel-storage.com/infinite-diagonal-carousel.mp4",
  },
  {
    id: "vertical-text-reveal",
    title: "Vertical Text Reveal",
    description:
      "Interactive text reveal animation with GSAP. Hover over profile images to reveal names with smooth staggered letter animations.",
    category: "animation",
    tags: ["gsap", "gsap.to", "gsap.set", "stagger"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/vertical-text-reveal.tsx",
    createdAt: "2025-11-15",
    component: "VerticalTextReveal",
    previewImage: "/images/previews/vertical-text-reveal.jpg",
    previewVideo:
      "https://idfsjg9tmemggmgn.public.blob.vercel-storage.com/vertical-text-reveal.mp4",
  },
  {
    id: "three-d-hover-transform",
    title: "3D Hover Transform",
    description:
      "Smooth 3D perspective transforms on hover with automated rotation cycles. Features spring-based easing and preserve-3d styling.",
    category: "3d",
    tags: ["css", "perspective", "transform3d", "transitions"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/three-d-hover-transform.tsx",
    createdAt: "2025-09-20",
    component: "ThreeDHoverTransform",
    previewImage: "/images/previews/three-d-hover-transform.jpg",
    previewVideo:
      "https://idfsjg9tmemggmgn.public.blob.vercel-storage.com/3d-hover-transform.mp4",
  },
  {
    id: "photo-sphere",
    title: "Photo Sphere",
    description:
      "Interactive 3D photo gallery with React Three Fiber. Switch between sphere, gallery, helix, wave, and cylinder layouts with smooth transitions.",
    category: "3d",
    tags: ["r3f", "three.js", "useFrame", "OrbitControls"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/photo-sphere.tsx",
    createdAt: "2025-11-22",
    component: "PhotoSphere",
    previewImage: "/images/previews/photo-sphere.jpg",
    previewVideo:
      "https://idfsjg9tmemggmgn.public.blob.vercel-storage.com/photo-sphere-2.mp4",
  },
  {
    id: "three-d-photo-carousel",
    title: "3D Photo Carousel",
    description:
      "A cylindrical 3D photo carousel with drag and scroll controls. Features spring-based momentum physics and responsive sizing.",
    category: "3d",
    tags: ["motion", "useMotionValue", "useTransform", "useAnimation"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/three-d-photo-carousel.tsx",
    createdAt: "2025-11-01",
    component: "ThreeDPhotoCarousel",
    previewImage: "/images/previews/three-d-photo-carousel.jpg",
    previewVideo:
      "https://idfsjg9tmemggmgn.public.blob.vercel-storage.com/3d-carousel.mp4",
  },
  {
    id: "hover-preview",
    title: "Hover Preview",
    description:
      "Interactive portfolio list with cursor-following image preview modal. Features GSAP-powered smooth cursor tracking and touch support.",
    category: "interaction",
    tags: ["gsap", "quickTo", "motion"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/hover-preview.tsx",
    createdAt: "2025-08-07",
    component: "HoverPreview",
    previewImage: "/images/previews/hover-preview.jpg",
    previewVideo:
      "https://idfsjg9tmemggmgn.public.blob.vercel-storage.com/hover-preview.mp4",
  },
  {
    id: "image-trail",
    title: "Image Trail",
    description:
      "Interactive cursor-following image trail with GSAP animations. Drag or move your cursor to create a dynamic trail of images with rotation and scale effects.",
    category: "interaction",
    tags: ["gsap", "gsap.to", "gsap.set", "useAnimationFrame"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/image-trail.tsx",
    createdAt: "2025-08-18",
    component: "ImageTrail",
    previewImage: "/images/previews/image-trail.jpg",
    previewVideo:
      "https://idfsjg9tmemggmgn.public.blob.vercel-storage.com/cursor-trail.mp4",
  },
  {
    id: "infinite-parallax-grid",
    title: "Infinite Parallax Grid",
    description:
      "An infinite scrolling grid with drag controls and smooth parallax effects. Features GSAP-powered intro animation and dynamic image repositioning.",
    category: "layout",
    tags: ["gsap", "gsap.to", "gsap.set", "stagger"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/infinite-parallax-grid.tsx",
    createdAt: "2025-10-08",
    component: "InfiniteParallaxGrid",
    previewImage: "/images/previews/infinite-parallax-grid.jpg",
    previewVideo:
      "https://idfsjg9tmemggmgn.public.blob.vercel-storage.com/infinite-parallax-grid.mp4",
  },
  {
    id: "sticky-scroll-cards",
    title: "Sticky Scroll Cards",
    description:
      "Layered card stack with scroll-based scaling and zoom effects. Features smooth Lenis scrolling and responsive stacking behavior.",
    category: "layout",
    tags: ["motion", "useScroll", "useTransform", "lenis"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/sticky-scroll-cards.tsx",
    createdAt: "2025-09-10",
    component: "StickyScrollCards",
    previewImage: "/images/previews/sticky-scroll-cards.jpg",
    previewVideo:
      "https://idfsjg9tmemggmgn.public.blob.vercel-storage.com/stacked-images.mp4",
  },
  {
    id: "vercel-tabs",
    title: "Vercel Tabs",
    description:
      "A navigation component with a sliding active indicator and smooth hover effects, similar to the Vercel dashboard.",
    category: "layout",
    tags: ["css", "transitions"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/vercel-tabs.tsx",
    createdAt: "2025-12-06",
    component: "VercelTabs",
    previewImage: "/images/previews/vercel-tabs.jpg",
    previewVideo:
      "https://idfsjg9tmemggmgn.public.blob.vercel-storage.com/vercel-tabs.mp4",
  },
  {
    id: "scroll-image-reveal",
    title: "Scroll Image Reveal",
    description:
      "A vertical scroll container that reveals stacked images using sticky positioning and dynamic clip-path masking. Features smooth scaling, brightness transitions, and a custom scroll progress indicator.",
    category: "layout",
    tags: ["css", "clip-path", "transitions"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/scroll-image-reveal.tsx",
    createdAt: "2025-12-03",
    component: "ScrollImageReveal",
    previewImage: "/images/previews/scroll-image-reveal.jpg",
    previewVideo: "/images/previews/scroll-image-reveal.mp4",
  },
  {
    id: "infinite-canvas",
    title: "Infinite Canvas",
    description:
      "An infinite, draggable image grid featuring physics-based inertia, hover spotlight effects, and seamless zoom-to-preview transitions.",
    category: "interaction",
    tags: ["gsap", "quickSetter", "gsap.ticker", "gsap.fromTo"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/infinite-canvas.tsx",
    createdAt: "2025-12-05",
    component: "InfiniteCanvas",
    previewImage: "/images/previews/infinite-canvas.jpg",
    previewVideo:
      "https://idfsjg9tmemggmgn.public.blob.vercel-storage.com/infinite-canvas-2.mp4",
  },
  {
    id: "circular-scroll",
    title: "Circular Scroll",
    description:
      "A circular scroll animation with GSAP, featuring rotating text elements and smooth scrolling behavior.",
    category: "interaction",
    tags: ["gsap", "gsap.to", "gsap.fromTo", "gsap.ticker"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/circular-scroll.tsx",
    createdAt: "2025-12-11",
    component: "CircularScroll",
    previewImage: "/images/previews/circular-scroll.jpg",
    previewVideo: "/images/previews/circular-scroll.mp4",
  },
  {
    id: "shader-orb",
    title: "Shader Orb",
    description:
      "A vibrant warm watercolor shader orb in a dynamic listening state with simulated audio reactivity.",
    category: "shader",
    tags: ["webgl2", "glsl", "shader", "noise", "fbm"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/shader-orb.tsx",
    createdAt: "2026-02-12",
    component: "ShaderOrb",
    previewImage: "/images/previews/chat-shader.jpg",
  },
  {
    id: "grain-gradient",
    title: "Grain Gradient",
    description:
      "Multi-color gradients with grainy, noise-textured distortion featuring 7 animated procedural shapes and flexible fitting modes.",
    category: "shader",
    tags: ["webgl2", "glsl", "shader", "noise", "procedural", "grain"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/grain-gradient.tsx",
    createdAt: "2026-02-16",
    component: "GrainGradient",
    previewImage: "/images/previews/chat-shader.jpg",
  },
  {
    id: "path-marquee",
    title: "Path Marquee",
    description:
      "A dynamic marquee animation that follows any SVG path. Features interactive dragging, scroll-aware velocity, and auto-scaling SVG paths.",
    category: "animation",
    tags: [
      "motion",
      "useAnimationFrame",
      "useMotionValue",
      "useTransform",
      "useSpring",
    ],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/path-marquee.tsx",
    createdAt: "2026-02-19",
    component: "PathMarquee",
    previewImage: "/images/previews/path-marquee.jpg",
  },
  {
    id: "portfolio-case-study",
    title: "Portfolio Case Study",
    description:
      "A scroll-driven portfolio case study with alternating cover and detail sections. Uses stacked perspective transitions to reveal project context, metrics, and imagery.",
    category: "layout",
    tags: ["motion", "useScroll", "useTransform", "lenis"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl:
      "https://github.com/davidumoru/playground/blob/main/components/experiments/portfolio-case-study.tsx",
    createdAt: "2026-03-12",
    component: "PortfolioCaseStudy",
  },
];

export const sortedExperiments: Experiment[] = [...experiments].sort((a, b) => {
  const dateA = new Date(a.createdAt).getTime();
  const dateB = new Date(b.createdAt).getTime();
  return dateB - dateA;
});
