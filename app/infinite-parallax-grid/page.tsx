"use client";

import {
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
} from "react";
import gsap from "gsap";

const sources = [
  {
    src: "https://images.unsplash.com/photo-1683009427590-dd987135e66c",
  },
  {
    src: "https://images.unsplash.com/photo-1513622118278-bc041b3c13ed",
  },
  {
    src: "https://images.unsplash.com/photo-1605315188787-e3c8f6bf927a",
  },
  {
    src: "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb",
  },
  {
    src: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce",
  },
  {
    src: "https://images.unsplash.com/photo-1483653364400-eedcfb9f1f88",
  },
  {
    src: "https://images.unsplash.com/photo-1609412058473-c199497c3c5d",
  },
  {
    src: "https://images.unsplash.com/photo-1513622118278-bc041b3c13ed",
  },
  {
    src: "https://images.unsplash.com/photo-1605315188787-e3c8f6bf927a",
  },
];

const layoutData = [
  { x: 71, y: 58, w: 400, h: 270 },
  { x: 211, y: 255, w: 540, h: 360 },
  { x: 631, y: 158, w: 400, h: 270 },
  { x: 1191, y: 245, w: 260, h: 195 },
  { x: 351, y: 687, w: 260, h: 290 },
  { x: 751, y: 824, w: 205, h: 154 },
  { x: 911, y: 540, w: 260, h: 350 },
  { x: 1051, y: 803, w: 400, h: 300 },
  { x: 71, y: 922, w: 350, h: 260 },
];

interface GridItem {
  el: HTMLDivElement;
  container: HTMLDivElement;
  wrapper: HTMLDivElement;
  img: HTMLImageElement;
  x: number;
  y: number;
  w: number;
  h: number;
  extraX: number;
  extraY: number;
  rect: DOMRect;
  ease: number;
}

const originalSize = { w: 1522, h: 1238 };

export default function InfiniteParallaxGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<GridItem[]>([]);
  const rafId = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scroll = useRef({
    ease: 0.06,
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    last: { x: 0, y: 0 },
    delta: { x: { c: 0, t: 0 }, y: { c: 0, t: 0 } },
  });

  const mouse = useRef({
    x: { t: 0.5, c: 0.5 },
    y: { t: 0.5, c: 0.5 },
    press: { t: 0, c: 0 },
  });

  const drag = useRef({ startX: 0, startY: 0, scrollX: 0, scrollY: 0 });
  const tileSize = useRef({ w: 0, h: 0 });
  const winSize = useRef({ w: 0, h: 0 });

  const [isDragging, setIsDragging] = useState(false);

  const createItems = useCallback(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";
    itemsRef.current = [];

    const baseItems = layoutData.map((d, i) => {
      const scaleX = tileSize.current.w / originalSize.w;
      const scaleY = tileSize.current.h / originalSize.h;
      const source = sources[i % sources.length];
      return {
        src: source.src,
        x: d.x * scaleX,
        y: d.y * scaleY,
        w: d.w * scaleX,
        h: d.h * scaleY,
      };
    });

    const repsX = [0, tileSize.current.w];
    const repsY = [0, tileSize.current.h];

    baseItems.forEach((base) => {
      repsX.forEach((offsetX) => {
        repsY.forEach((offsetY) => {
          const el = document.createElement("div");
          el.classList.add("item");
          el.style.position = "absolute";
          el.style.top = "0";
          el.style.left = "0";
          el.style.willChange = "transform";
          el.style.whiteSpace = "normal";
          el.style.width = `${base.w}px`;

          const wrapper = document.createElement("div");
          wrapper.classList.add("item-wrapper");
          wrapper.style.willChange = "transform";
          el.appendChild(wrapper);

          const itemImage = document.createElement("div");
          itemImage.classList.add("item-image");
          itemImage.style.overflow = "hidden";
          itemImage.style.width = `${base.w}px`;
          itemImage.style.height = `${base.h}px`;
          wrapper.appendChild(itemImage);

          const img = document.createElement("img");
          img.src = base.src;
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "cover";
          img.style.willChange = "transform";
          itemImage.appendChild(img);

          containerRef.current!.appendChild(el);

          itemsRef.current.push({
            el,
            container: itemImage,
            wrapper,
            img,
            x: base.x + offsetX,
            y: base.y + offsetY,
            w: base.w,
            h: base.h,
            extraX: 0,
            extraY: 0,
            rect: el.getBoundingClientRect(),
            ease: Math.random() * 0.5 + 0.5,
          });
        });
      });
    });

    tileSize.current.w *= 2;
    tileSize.current.h *= 2;

    const initialX = -winSize.current.w * 0.1;
    const initialY = -winSize.current.h * 0.1;
    scroll.current.current.x =
      scroll.current.target.x =
      scroll.current.last.x =
        initialX;
    scroll.current.current.y =
      scroll.current.target.y =
      scroll.current.last.y =
        initialY;
  }, []);

  const initIntro = useCallback(() => {
    if (!containerRef.current) return;

    const introItems = Array.from(
      containerRef.current.querySelectorAll(".item-wrapper")
    ).filter((item) => {
      const rect = item.getBoundingClientRect();
      return (
        rect.x > -rect.width &&
        rect.x < window.innerWidth + rect.width &&
        rect.y > -rect.height &&
        rect.y < window.innerHeight + rect.height
      );
    });

    introItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const x = -rect.x + window.innerWidth * 0.5 - rect.width * 0.5;
      const y = -rect.y + window.innerHeight * 0.5 - rect.height * 0.5;
      gsap.set(item, { x, y });
    });

    gsap.to(introItems.reverse(), {
      duration: 2,
      ease: "expo.inOut",
      x: 0,
      y: 0,
      stagger: 0.05,
    });
  }, []);

  const onResize = useCallback(() => {
    winSize.current.w = window.innerWidth;
    winSize.current.h = window.innerHeight;

    tileSize.current = {
      w: winSize.current.w,
      h: winSize.current.w * (originalSize.h / originalSize.w),
    };

    scroll.current.current = { x: 0, y: 0 };
    scroll.current.target = { x: 0, y: 0 };
    scroll.current.last = { x: 0, y: 0 };

    createItems();
    initIntro();
  }, [createItems, initIntro]);

  const render = useCallback(() => {
    scroll.current.current.x +=
      (scroll.current.target.x - scroll.current.current.x) *
      scroll.current.ease;
    scroll.current.current.y +=
      (scroll.current.target.y - scroll.current.current.y) *
      scroll.current.ease;

    scroll.current.delta.x.t = scroll.current.current.x - scroll.current.last.x;
    scroll.current.delta.y.t = scroll.current.current.y - scroll.current.last.y;
    scroll.current.delta.x.c +=
      (scroll.current.delta.x.t - scroll.current.delta.x.c) * 0.04;
    scroll.current.delta.y.c +=
      (scroll.current.delta.y.t - scroll.current.delta.y.c) * 0.04;

    mouse.current.x.c += (mouse.current.x.t - mouse.current.x.c) * 0.04;
    mouse.current.y.c += (mouse.current.y.t - mouse.current.y.c) * 0.04;
    mouse.current.press.c +=
      (mouse.current.press.t - mouse.current.press.c) * 0.04;

    const dirX =
      scroll.current.current.x > scroll.current.last.x ? "right" : "left";
    const dirY =
      scroll.current.current.y > scroll.current.last.y ? "down" : "up";

    itemsRef.current.forEach((item) => {
      const newX =
        5 * scroll.current.delta.x.c * item.ease +
        (mouse.current.x.c - 0.5) * item.rect.width * 0.6;
      const newY =
        5 * scroll.current.delta.y.c * item.ease +
        (mouse.current.y.c - 0.5) * item.rect.height * 0.6;

      const scrollX = scroll.current.current.x;
      const scrollY = scroll.current.current.y;

      const posX = item.x + scrollX + item.extraX + newX;
      const posY = item.y + scrollY + item.extraY + newY;

      const beforeX = posX > winSize.current.w;
      const afterX = posX + item.rect.width < 0;
      if (dirX === "right" && beforeX) item.extraX -= tileSize.current.w;
      if (dirX === "left" && afterX) item.extraX += tileSize.current.w;

      const beforeY = posY > winSize.current.h;
      const afterY = posY + item.rect.height < 0;
      if (dirY === "down" && beforeY) item.extraY -= tileSize.current.h;
      if (dirY === "up" && afterY) item.extraY += tileSize.current.h;

      const fx = item.x + scrollX + item.extraX + newX;
      const fy = item.y + scrollY + item.extraY + newY;

      item.el.style.transform = `translate(${fx}px, ${fy}px)`;
      item.img.style.transform = `scale(${
        1.2 + 0.2 * mouse.current.press.c * item.ease
      }) translate(${-mouse.current.x.c * item.ease * 10}%, ${
        -mouse.current.y.c * item.ease * 10
      }%)`;
    });

    scroll.current.last.x = scroll.current.current.x;
    scroll.current.last.y = scroll.current.current.y;

    rafId.current = requestAnimationFrame(render);
  }, []);

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const factor = 0.4;
    scroll.current.target.x -= e.deltaX * factor;
    scroll.current.target.y -= e.deltaY * factor;
  }, []);

  const onMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.documentElement.classList.add("dragging");
    mouse.current.press.t = 1;
    drag.current.startX = e.clientX;
    drag.current.startY = e.clientY;
    drag.current.scrollX = scroll.current.target.x;
    drag.current.scrollY = scroll.current.target.y;
  }, []);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    document.documentElement.classList.remove("dragging");
    mouse.current.press.t = 0;
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      mouse.current.x.t = e.clientX / winSize.current.w;
      mouse.current.y.t = e.clientY / winSize.current.h;

      if (isDragging) {
        const dx = e.clientX - drag.current.startX;
        const dy = e.clientY - drag.current.startY;
        scroll.current.target.x = drag.current.scrollX + dx;
        scroll.current.target.y = drag.current.scrollY + dy;
      }
    },
    [isDragging]
  );

  useLayoutEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("visible", entry.isIntersecting);
      });
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useLayoutEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);

  useEffect(() => {
    const container = containerRef.current;

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    if (container) {
      container.addEventListener("mousedown", onMouseDown);
    }

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (container) {
        container.removeEventListener("mousedown", onMouseDown);
      }
    };
  }, [onWheel, onMouseMove, onMouseUp, onMouseDown]);

  useEffect(() => {
    rafId.current = requestAnimationFrame(render);
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [render]);

  return (
    <main
      className={`w-screen h-screen font-mono overflow-hidden select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <div
        id="images"
        ref={containerRef}
        className="relative w-full h-full inline-block whitespace-nowrap"
        style={{
          whiteSpace: "nowrap",
          position: "relative",
        }}
      />

      <style jsx global>{`
        html.dragging {
          cursor: grabbing !important;
        }

        html.dragging * {
          cursor: grabbing !important;
        }
      `}</style>
    </main>
  );
}
