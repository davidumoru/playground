"use client";

import {
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
} from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";

gsap.registerPlugin(SplitText);

const images = [
  "https://images.unsplash.com/photo-1683009427590-dd987135e66c",
  "https://images.unsplash.com/photo-1513622118278-bc041b3c13ed",
  "https://images.unsplash.com/photo-1605315188787-e3c8f6bf927a",
  "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb",
  "https://images.unsplash.com/photo-1503614472-8c93d56e92ce",
  "https://images.unsplash.com/photo-1483653364400-eedcfb9f1f88",
  "https://images.unsplash.com/photo-1609412058473-c199497c3c5d",
  "https://images.unsplash.com/photo-1513622118278-bc041b3c13ed",
  "https://images.unsplash.com/photo-1605315188787-e3c8f6bf927a",
  "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb",
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

const imageSources = [
  { caption: "Cybernetic Bloom" },
  { caption: "Digital Oasis" },
  { caption: "Neon Dreams" },
  { caption: "Retro Futures" },
  { caption: "Synthwave City" },
  { caption: "Glitch Garden" },
  { caption: "Virtual Vista" },
  { caption: "Holographic Hues" },
  { caption: "Pixelated Peaks" },
];

interface GridItemData {
  id: string;
  uniqueId: string;
  src: string;
  caption: string;
  x: number;
  y: number;
  w: number;
  h: number;
  offsetX: number;
  offsetY: number;
}

interface GridItemRef {
  el: HTMLDivElement;
  wrapper: HTMLDivElement;
  img: HTMLImageElement;
  caption: HTMLElement;
  splitText?: SplitText;
  x: number;
  y: number;
  w: number;
  h: number;
  extraX: number;
  extraY: number;
  ease: number;
}

export default function InfiniteParallaxGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<GridItemRef[]>([]);
  const rafId = useRef<number | null>(null);

  const scroll = useRef({
    ease: 0.06,
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
    last: { x: 0, y: 0 },
    delta: {
      x: { c: 0, t: 0 },
      y: { c: 0, t: 0 },
    },
  });

  const mouse = useRef({
    x: { t: 0.5, c: 0.5 },
    y: { t: 0.5, c: 0.5 },
    press: { t: 0, c: 0 },
  });

  const drag = useRef({ startX: 0, startY: 0, scrollX: 0, scrollY: 0 });
  const tileSize = useRef({ w: 0, h: 0 });
  const winSize = useRef({ w: 0, h: 0 });

  const [gridItemsData, setGridItemsData] = useState<GridItemData[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const calculateLayout = useCallback(() => {
    if (!containerRef.current) return;

    winSize.current = { w: window.innerWidth, h: window.innerHeight };
    const originalSize = { w: 1522, h: 1238 };

    tileSize.current = {
      w: winSize.current.w,
      h: winSize.current.w * (originalSize.h / originalSize.w),
    };

    const baseItems = layoutData.map((d, i) => {
      const scaleX = tileSize.current.w / originalSize.w;
      const scaleY = tileSize.current.h / originalSize.h;
      const source = imageSources[i % imageSources.length];
      return {
        id: `item_${i}`,
        src: images[i % images.length],
        caption: source.caption,
        x: d.x * scaleX,
        y: d.y * scaleY,
        w: d.w * scaleX,
        h: d.h * scaleY,
      };
    });

    const allItems: GridItemData[] = [];
    const repsX = [0, tileSize.current.w];
    const repsY = [0, tileSize.current.h];
    let uniqueId = 0;

    repsY.forEach((offsetY) => {
      repsX.forEach((offsetX) => {
        baseItems.forEach((base) => {
          allItems.push({
            ...base,
            uniqueId: `tile_${uniqueId++}`,
            offsetX: base.x + offsetX,
            offsetY: base.y + offsetY,
          });
        });
      });
    });

    setGridItemsData(allItems);

    tileSize.current.w *= 2;
    tileSize.current.h *= 2;

    const initialX = -winSize.current.w * 0.1;
    const initialY = -winSize.current.h * 0.1;
    scroll.current.target.x =
      scroll.current.current.x =
      scroll.current.last.x =
        initialX;
    scroll.current.target.y =
      scroll.current.current.y =
      scroll.current.last.y =
        initialY;
  }, []);

  useLayoutEffect(() => {
    calculateLayout();
    window.addEventListener("resize", calculateLayout);
    return () => window.removeEventListener("resize", calculateLayout);
  }, [calculateLayout]);

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

    for (let i = 0; i < itemsRef.current.length; i++) {
      const item = itemsRef.current[i];
      if (!item || !item.el) continue;

      const parallaxX =
        5 * scroll.current.delta.x.c * item.ease +
        (mouse.current.x.c - 0.5) * item.w * 0.6;
      const parallaxY =
        5 * scroll.current.delta.y.c * item.ease +
        (mouse.current.y.c - 0.5) * item.h * 0.6;

      const posX = item.x + scroll.current.current.x + item.extraX + parallaxX;
      const posY = item.y + scroll.current.current.y + item.extraY + parallaxY;

      if (dirX === "right" && posX > winSize.current.w) {
        item.extraX -= tileSize.current.w;
      }
      if (dirX === "left" && posX + item.w < 0) {
        item.extraX += tileSize.current.w;
      }
      if (dirY === "down" && posY > winSize.current.h) {
        item.extraY -= tileSize.current.h;
      }
      if (dirY === "up" && posY + item.h < 0) {
        item.extraY += tileSize.current.h;
      }

      const finalX =
        item.x + scroll.current.current.x + item.extraX + parallaxX;
      const finalY =
        item.y + scroll.current.current.y + item.extraY + parallaxY;

      item.el.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;

      if (item.img) {
        const scaleEffect = 1.2 + 0.2 * mouse.current.press.c * item.ease;
        const translateEffectX = -mouse.current.x.c * item.ease * 10;
        const translateEffectY = -mouse.current.y.c * item.ease * 10;
        item.img.style.transform = `scale(${scaleEffect}) translate(${translateEffectX}%, ${translateEffectY}%)`;
      }
    }

    scroll.current.last.x = scroll.current.current.x;
    scroll.current.last.y = scroll.current.current.y;
    rafId.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    rafId.current = requestAnimationFrame(render);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [render]);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = 0.4;
      scroll.current.target.x -= e.deltaX * factor;
      scroll.current.target.y -= e.deltaY * factor;
    };

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      mouse.current.press.t = 1;
      drag.current.startX = e.clientX;
      drag.current.startY = e.clientY;
      drag.current.scrollX = scroll.current.target.x;
      drag.current.scrollY = scroll.current.target.y;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x.t = e.clientX / winSize.current.w;
      mouse.current.y.t = e.clientY / winSize.current.h;

      if (isDragging) {
        const dx = e.clientX - drag.current.startX;
        const dy = e.clientY - drag.current.startY;
        scroll.current.target.x = drag.current.scrollX + dx;
        scroll.current.target.y = drag.current.scrollY + dy;
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
      mouse.current.press.t = 0;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  useLayoutEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("visible", entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    const currentItems = itemsRef.current;

    const splits: SplitText[] = [];
    currentItems.forEach((item) => {
      if (item && item.caption) {
        observer.observe(item.caption);
        const split = new SplitText(item.caption, {
          type: "lines",
          linesClass: "line-wrapper",
        });
        const split2 = new SplitText(split.lines, {
          type: "lines",
          linesClass: "line",
        });
        splits.push(split, split2);
        item.splitText = split;
      }
    });

    return () => {
      currentItems.forEach((item) => {
        if (item && item.caption) observer.unobserve(item.caption);
      });
      splits.forEach((s) => s.revert());
    };
  }, [gridItemsData]);

  useEffect(() => {
    if (gridItemsData.length === 0) return;

    const timeoutId = setTimeout(() => {
      const introItemWrappers = itemsRef.current
        .map((item) => item.wrapper)
        .filter((wrapper) => {
          if (!wrapper) return false;
          const rect = wrapper.getBoundingClientRect();
          return (
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0
          );
        });

      gsap.fromTo(
        introItemWrappers,
        {
          x: (i) =>
            -introItemWrappers[i].getBoundingClientRect().left +
            window.innerWidth / 2 -
            introItemWrappers[i].getBoundingClientRect().width / 2,
          y: (i) =>
            -introItemWrappers[i].getBoundingClientRect().top +
            window.innerHeight / 2 -
            introItemWrappers[i].getBoundingClientRect().height / 2,
          scale: 0.5,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: "expo.inOut",
          stagger: 0.05,
        }
      );
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [gridItemsData]);

  return (
    <main
      className={`w-screen h-screen bg-black text-white font-sans overflow-hidden cursor-grab ${
        isDragging ? "cursor-grabbing" : ""
      }`}
    >
           {" "}
      <div id="images" ref={containerRef} className="relative w-full h-full">
               {" "}
        {gridItemsData.map((itemData, index) => (
          <div
            key={itemData.uniqueId}
            className="item absolute top-0 left-0 will-change-transform whitespace-normal"
            ref={(el) => {
              if (el) {
                const currentItem = itemsRef.current[index] || {};
                itemsRef.current[index] = {
                  ...currentItem,
                  el,
                  x: itemData.offsetX,
                  y: itemData.offsetY,
                  w: itemData.w,
                  h: itemData.h,
                  extraX: 0,
                  extraY: 0,
                  ease: Math.random() * 0.5 + 0.5,
                };
              }
            }}
            style={{ width: `${itemData.w}px` }}
          >
                       {" "}
            <div
              className="item-wrapper will-change-transform"
              ref={(el) => {
                if (el && itemsRef.current[index])
                  itemsRef.current[index].wrapper = el;
              }}
            >
                           {" "}
              <div
                className="item-image overflow-hidden rounded-lg"
                style={{ height: `${itemData.h}px` }}
              >
                               {" "}
                <Image
                  ref={(el) => {
                    if (el && itemsRef.current[index])
                      itemsRef.current[index].img = el;
                  }}
                  src={itemData.src}
                  alt={itemData.caption}
                  fill
                  className="object-cover will-change-transform"
                  priority
                />
                             {" "}
              </div>
                           {" "}
              <small
                ref={(el) => {
                  if (el && itemsRef.current[index])
                    itemsRef.current[index].caption = el;
                }}
                className="block w-full text-base sm:text-lg md:text-xl mt-4"
              >
                                {itemData.caption}             {" "}
              </small>
                         {" "}
            </div>
                     {" "}
          </div>
        ))}
             {" "}
      </div>
           {" "}
      <style jsx global>{`
        .line-wrapper {
          overflow: hidden;
        }
        small:not(.visible) .line {
          transform: translateY(110%);
        }
        .line {
          transition: transform 1.5s cubic-bezier(0.6, 0.14, 0, 1);
        }
      `}</style>
         {" "}
    </main>
  );
}
