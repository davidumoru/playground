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
    tags: ["carousel", "scroll", "spring", "motion"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl: "#",
    createdAt: "2025-11-24",
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
    tags: ["gsap", "text", "reveal", "stagger"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl: "#",
    createdAt: "2025-11-24",
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
    tags: ["3d", "perspective", "transform", "hover"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl: "#",
    createdAt: "2025-11-24",
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
    tags: ["r3f", "threejs", "gallery", "3d", "layout"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl: "#",
    createdAt: "2025-11-24",
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
    tags: ["3d", "carousel", "drag", "perspective", "motion"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl: "#",
    createdAt: "2025-11-24",
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
    tags: ["hover", "cursor", "gsap", "modal", "preview"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl: "#",
    createdAt: "2025-11-24",
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
    tags: ["gsap", "cursor", "trail", "animation", "interactive"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl: "#",
    createdAt: "2025-11-24",
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
    tags: ["parallax", "scroll", "grid", "gsap", "infinite"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl: "#",
    createdAt: "2025-11-24",
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
    tags: ["scroll", "stack", "lenis", "motion", "cards"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl: "#",
    createdAt: "2025-11-24",
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
    tags: ["tabs", "navigation", "animation", "react"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl: "#",
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
    tags: ["scroll", "sticky", "clip-path", "gallery"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl: "#",
    createdAt: "2025-12-06",
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
    tags: ["gsap", "drag", "grid", "gallery"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl: "#",
    createdAt: "2025-12-11",
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
    tags: ["gsap", "circular", "scroll", "animation"],
    author: "David Umoru",
    authorUrl: "https://x.com/theumoru",
    sourceUrl: "#",
    createdAt: "2025-12-11",
    component: "CircularScroll",
    previewImage: "/images/previews/circular-scroll.jpg",
    previewVideo: "/images/previews/circular-scroll.mp4",
  },
];

export const sortedExperiments: Experiment[] = [...experiments].sort((a, b) => {
  const dateA = new Date(a.createdAt).getTime();
  const dateB = new Date(b.createdAt).getTime();
  return dateB - dateA;
});
