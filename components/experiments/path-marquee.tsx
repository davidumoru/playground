"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { Slider } from "@/components/ui/slider";

// --- CONSTANTS & PRESETS ---

const loopSvg = `
<svg width="871" height="295" viewBox="0 0 871 295" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M-136 170.3L1.08594 231.344C352.809 387.946 512.017 209.267 529.76 135.148C543.975 75.7694 504.152 0.618567 446.536 0.61853C388.986 0.618494 339.625 59.6711 355.081 135.148C372.658 220.984 539.76 378.328 869.94 231.344L1007 170.3" stroke="white"/>
</svg>
`;

const waveSvg = `
<svg width="1255" height="233" viewBox="0 0 1255 233" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M-83.1 240.6L1.20703 116.533C105.589 -36.9698 209.971 -36.9698 314.353 116.533C418.736 270.036 523.118 270.036 627.5 116.533C731.882 -36.9698 836.264 -36.9698 940.646 116.533C1045.03 270.036 1149.41 270.036 1253.79 116.533L1338.1 -7.5" stroke="white"/>
</svg>
`;

const curlySvg = `
<svg width="1740" height="463" viewBox="200 0 1340 463" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M-136 170.3 L1.1 231.3 C352.8 387.9 512.0 209.3 529.8 135.1 C544.0 75.8 504.2 0.6 446.5 0.6 C389.0 0.6 339.6 59.7 355.1 135.1 C372.7 221.0 539.8 378.3 869.9 231.3 C1221.7 74.7 1380.9 253.4 1398.6 327.5 C1412.8 386.9 1373.0 462.1 1315.4 462.1 C1257.8 462.1 1208.5 403.0 1223.9 327.5 C1241.5 241.7 1408.6 84.4 1738.8 231.3 L1875 170.3" stroke="white"/>
</svg>
`;

const figure8Svg = `
<svg width="1400" height="800" viewBox="0 100 1400 800" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M -800 500 L 700 500 C 700 307 543 150 350 150 C 157 150 0 307 0 500 C 0 693 157 850 350 850 C 543 850 700 693 700 500 C 700 693 857 850 1050 850 C 1243 850 1400 693 1400 500 C 1400 307 1243 150 1050 150 C 857 150 700 307 700 500 L 2200 500" stroke="white"/>
</svg>
`;

const stripesSvg = `
<svg width="1823" height="756" viewBox="0 0 1823 756" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M932.4 -176.2L-175.5 931.7M357.6 931.7L1465.5 -176.2M1998.6 -176.2L890.7 931.7" stroke="white"/>
</svg>
`;

const presetSvgLookup: Record<string, string> = {
  loop: loopSvg,
  wave: waveSvg,
  curly: curlySvg,
  figure8: figure8Svg,
  stripes: stripesSvg,
};

const images = [
  "https://images.unsplash.com/photo-1760340769739-653d00200baf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
  "https://images.unsplash.com/photo-1753301639019-53340bb79d03?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=627",
  "https://plus.unsplash.com/premium_photo-1756120053159-433dcffeeb10?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
  "https://plus.unsplash.com/premium_photo-1673137880579-c1ed2a4230b8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764",
  "https://images.unsplash.com/photo-1631034339054-a3ff59f238df?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=625",
  "https://plus.unsplash.com/premium_photo-1728280883821-8e2b416a878a?auto=format&fit=crop&q=80&w=300",
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=300",
];

// --- UTILITIES ---

const wrap = (min: number, max: number, value: number) => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

const scaleAndTranslateSvgPath = (
  pathString: string,
  scale: number,
  offsetX: number,
  offsetY: number,
) => {
  if (!pathString || scale <= 0) return "";
  const commandRegex = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;

  return pathString.replace(commandRegex, (_match, command, params) => {
    const numbers = params
      .trim()
      .split(/[\s,]+/)
      .filter((n: string) => n !== "")
      .map(Number);

    if (command.toUpperCase() === "Z") {
      currentX = startX;
      currentY = startY;
      return command;
    }

    if (numbers.length === 0) return command;

    const transformedParams: number[] = [];
    const transformX = (x: number) => x * scale + offsetX;
    const transformY = (y: number) => y * scale + offsetY;
    const scaleValue = (val: number) => val * scale;

    const updateCurrentPoint = (x: number, y: number, isRelative: boolean) => {
      if (isRelative) {
        currentX += x;
        currentY += y;
      } else {
        currentX = x;
        currentY = y;
      }
    };

    switch (command) {
      case "M":
        transformedParams.push(transformX(numbers[0]), transformY(numbers[1]));
        updateCurrentPoint(numbers[0], numbers[1], false);
        startX = currentX;
        startY = currentY;
        for (let i = 2; i < numbers.length; i += 2) {
          transformedParams.push(
            transformX(numbers[i]),
            transformY(numbers[i + 1]),
          );
          updateCurrentPoint(numbers[i], numbers[i + 1], false);
        }
        break;
      case "L":
        for (let i = 0; i < numbers.length; i += 2) {
          transformedParams.push(
            transformX(numbers[i]),
            transformY(numbers[i + 1]),
          );
          updateCurrentPoint(numbers[i], numbers[i + 1], false);
        }
        break;
      case "H":
        for (let i = 0; i < numbers.length; i++) {
          transformedParams.push(transformX(numbers[i]));
          updateCurrentPoint(numbers[i], currentY, false);
        }
        break;
      case "V":
        for (let i = 0; i < numbers.length; i++) {
          transformedParams.push(transformY(numbers[i]));
          updateCurrentPoint(currentX, numbers[i], false);
        }
        break;
      case "C":
        for (let i = 0; i < numbers.length; i += 6) {
          transformedParams.push(
            transformX(numbers[i]),
            transformY(numbers[i + 1]),
            transformX(numbers[i + 2]),
            transformY(numbers[i + 3]),
            transformX(numbers[i + 4]),
            transformY(numbers[i + 5]),
          );
          updateCurrentPoint(numbers[i + 4], numbers[i + 5], false);
        }
        break;
      case "S":
        for (let i = 0; i < numbers.length; i += 4) {
          transformedParams.push(
            transformX(numbers[i]),
            transformY(numbers[i + 1]),
            transformX(numbers[i + 2]),
            transformY(numbers[i + 3]),
          );
          updateCurrentPoint(numbers[i + 2], numbers[i + 3], false);
        }
        break;
      case "Q":
        for (let i = 0; i < numbers.length; i += 4) {
          transformedParams.push(
            transformX(numbers[i]),
            transformY(numbers[i + 1]),
            transformX(numbers[i + 2]),
            transformY(numbers[i + 3]),
          );
          updateCurrentPoint(numbers[i + 2], numbers[i + 3], false);
        }
        break;
      case "T":
        for (let i = 0; i < numbers.length; i += 2) {
          transformedParams.push(
            transformX(numbers[i]),
            transformY(numbers[i + 1]),
          );
          updateCurrentPoint(numbers[i], numbers[i + 1], false);
        }
        break;
      case "A":
        for (let i = 0; i < numbers.length; i += 7) {
          transformedParams.push(
            scaleValue(numbers[i]),
            scaleValue(numbers[i + 1]),
            numbers[i + 2],
            numbers[i + 3],
            numbers[i + 4],
            transformX(numbers[i + 5]),
            transformY(numbers[i + 6]),
          );
          updateCurrentPoint(numbers[i + 5], numbers[i + 6], false);
        }
        break;
      case "m":
        transformedParams.push(scaleValue(numbers[0]), scaleValue(numbers[1]));
        updateCurrentPoint(numbers[0], numbers[1], true);
        startX = currentX;
        startY = currentY;
        for (let i = 2; i < numbers.length; i += 2) {
          transformedParams.push(
            scaleValue(numbers[i]),
            scaleValue(numbers[i + 1]),
          );
          updateCurrentPoint(numbers[i], numbers[i + 1], true);
        }
        break;
      case "l":
        for (let i = 0; i < numbers.length; i += 2) {
          transformedParams.push(
            scaleValue(numbers[i]),
            scaleValue(numbers[i + 1]),
          );
          updateCurrentPoint(numbers[i], numbers[i + 1], true);
        }
        break;
      case "h":
        for (let i = 0; i < numbers.length; i++) {
          transformedParams.push(scaleValue(numbers[i]));
          updateCurrentPoint(numbers[i], 0, true);
        }
        break;
      case "v":
        for (let i = 0; i < numbers.length; i++) {
          transformedParams.push(scaleValue(numbers[i]));
          updateCurrentPoint(0, numbers[i], true);
        }
        break;
      case "c":
        for (let i = 0; i < numbers.length; i += 6) {
          transformedParams.push(
            scaleValue(numbers[i]),
            scaleValue(numbers[i + 1]),
            scaleValue(numbers[i + 2]),
            scaleValue(numbers[i + 3]),
            scaleValue(numbers[i + 4]),
            scaleValue(numbers[i + 5]),
          );
          updateCurrentPoint(numbers[i + 4], numbers[i + 5], true);
        }
        break;
      case "s":
        for (let i = 0; i < numbers.length; i += 4) {
          transformedParams.push(
            scaleValue(numbers[i]),
            scaleValue(numbers[i + 1]),
            scaleValue(numbers[i + 2]),
            scaleValue(numbers[i + 3]),
          );
          updateCurrentPoint(numbers[i + 2], numbers[i + 3], true);
        }
        break;
      case "q":
        for (let i = 0; i < numbers.length; i += 4) {
          transformedParams.push(
            scaleValue(numbers[i]),
            scaleValue(numbers[i + 1]),
            scaleValue(numbers[i + 2]),
            scaleValue(numbers[i + 3]),
          );
          updateCurrentPoint(numbers[i + 2], numbers[i + 3], true);
        }
        break;
      case "t":
        for (let i = 0; i < numbers.length; i += 2) {
          transformedParams.push(
            scaleValue(numbers[i]),
            scaleValue(numbers[i + 1]),
          );
          updateCurrentPoint(numbers[i], numbers[i + 1], true);
        }
        break;
      case "a":
        for (let i = 0; i < numbers.length; i += 7) {
          transformedParams.push(
            scaleValue(numbers[i]),
            scaleValue(numbers[i + 1]),
            numbers[i + 2],
            numbers[i + 3],
            numbers[i + 4],
            scaleValue(numbers[i + 5]),
            scaleValue(numbers[i + 6]),
          );
          updateCurrentPoint(numbers[i + 5], numbers[i + 6], true);
        }
        break;
    }
    return (
      command +
      (transformedParams.length > 0 ? " " + transformedParams.join(" ") : "")
    );
  });
};

const extractPathsFromSvgString = async (
  svgString: string,
  containerWidth: number,
  containerHeight: number,
) => {
  try {
    if (!svgString) return "";
    if (containerWidth <= 0 || containerHeight <= 0) return "";

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const parserError = svgDoc.querySelector("parsererror");
    if (parserError) throw new Error("Invalid SVG format");

    const pathElements = svgDoc.querySelectorAll("path");
    const paths = Array.from(pathElements)
      .map((path) => path.getAttribute("d"))
      .filter((d) => d !== null) as string[];

    if (paths.length === 0) throw new Error("No paths found in SVG");

    const svgElement = svgDoc.querySelector("svg");
    const viewBox = svgElement?.getAttribute("viewBox")?.split(" ").map(Number);
    const svgWidth = parseFloat(svgElement?.getAttribute("width") || "100");
    const svgHeight = parseFloat(svgElement?.getAttribute("height") || "100");

    let originalWidth: number;
    let originalHeight: number;
    let viewBoxMinX = 0;
    let viewBoxMinY = 0;

    if (viewBox && viewBox.length === 4) {
      viewBoxMinX = viewBox[0];
      viewBoxMinY = viewBox[1];
      originalWidth = viewBox[2];
      originalHeight = viewBox[3];
    } else {
      originalWidth = svgWidth;
      originalHeight = svgHeight;
    }

    if (originalWidth <= 0 || originalHeight <= 0)
      throw new Error("Invalid SVG dimensions");

    const scaleX = containerWidth / originalWidth;
    const scaleY = containerHeight / originalHeight;
    const scale = Math.min(scaleX, scaleY);

    const scaledWidth = originalWidth * scale;
    const scaledHeight = originalHeight * scale;

    const offsetX = (containerWidth - scaledWidth) / 2 - viewBoxMinX * scale;
    const offsetY = (containerHeight - scaledHeight) / 2 - viewBoxMinY * scale;

    const transformedPaths = paths.map((path) =>
      scaleAndTranslateSvgPath(path, scale, offsetX, offsetY),
    );
    return transformedPaths.join(" ");
  } catch (error) {
    console.error("Error extracting paths from SVG:", error);
    return "";
  }
};

// --- SUBCOMPONENTS ---

interface CssVariableInterpolation {
  property: string;
  from: number;
  to: number;
}

interface MarqueeItemProps {
  child: React.ReactNode;
  itemIndex: number;
  totalItems: number;
  repeatIndex: number;
  baseOffset: any;
  path: string;
  easing?: (t: number) => number;
  enableRollingZIndex: boolean;
  calculateZIndex: (offset: number) => number | undefined;
  draggable: boolean;
  grabCursor: boolean;
  cssVariableInterpolation: CssVariableInterpolation[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  fade: boolean;
}

const MarqueeItem = ({
  child,
  itemIndex,
  totalItems,
  repeatIndex,
  baseOffset,
  path,
  easing,
  enableRollingZIndex,
  calculateZIndex,
  draggable,
  grabCursor,
  cssVariableInterpolation,
  onMouseEnter,
  onMouseLeave,
  fade,
}: MarqueeItemProps) => {
  const itemOffset = useTransform(baseOffset, (v: number) => {
    const position = (itemIndex * 100) / totalItems;
    const wrappedValue = wrap(0, 100, v + position);
    return `${easing ? easing(wrappedValue / 100) * 100 : wrappedValue}%`;
  });

  const currentOffsetDistance = useMotionValue(0);

  const opacity = useTransform(
    currentOffsetDistance,
    [0, 2, 98, 100],
    [0, 1, 1, 0],
  );

  const zIndex = useTransform(currentOffsetDistance, (value) =>
    calculateZIndex(value),
  );

  useEffect(() => {
    return itemOffset.on("change", (value) => {
      const match = value.match(/^([\d.]+)%$/);
      if (match && match[1]) {
        currentOffsetDistance.set(parseFloat(match[1]));
      }
    });
  }, [itemOffset, currentOffsetDistance]);

  const cssVariables = Object.fromEntries(
    (cssVariableInterpolation || []).map(({ property, from, to }) => [
      property,
      useTransform(currentOffsetDistance, [0, 100], [from, to]),
    ]),
  );

  return (
    <motion.div
      style={{
        offsetPath: `path('${path}')`,
        offsetDistance: itemOffset,
        opacity: fade ? opacity : 1,
        zIndex: enableRollingZIndex ? zIndex : undefined,
        position: "absolute",
        top: "0",
        left: "0",
        cursor: draggable && grabCursor ? "grab" : "default",
        ...cssVariables,
      }}
      aria-hidden={repeatIndex > 0}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {child}
    </motion.div>
  );
};

interface MarqueeAlongSvgPathProps {
  children: React.ReactNode;
  path: string;
  baseVelocity?: number;
  direction?: "normal" | "reverse";
  easing?: (t: number) => number;
  slowdownOnHover?: boolean;
  slowDownFactor?: number;
  useScrollVelocity?: boolean;
  scrollAwareDirection?: boolean;
  repeat?: number;
  draggable?: boolean;
  dragSensitivity?: number;
  dragVelocityDecay?: number;
  dragAwareDirection?: boolean;
  grabCursor?: boolean;
  enableRollingZIndex?: boolean;
  zIndexBase?: number;
  zIndexRange?: number;
  cssVariableInterpolation?: CssVariableInterpolation[];
  fade?: boolean;
}

const MarqueeAlongSvgPath = ({
  children,
  path,
  baseVelocity = 5,
  direction = "normal",
  easing,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  useScrollVelocity = false,
  scrollAwareDirection = true,
  repeat = 3,
  draggable = false,
  dragSensitivity = 0.02,
  dragVelocityDecay = 0.7,
  dragAwareDirection = false,
  grabCursor = false,
  enableRollingZIndex = true,
  zIndexBase = 1,
  zIndexRange = 100,
  cssVariableInterpolation = [],
  fade = true,
}: MarqueeAlongSvgPathProps) => {
  const container = useRef<HTMLDivElement>(null);
  const baseOffset = useMotionValue(0);

  const items = useMemo(() => {
    const childrenArray = React.Children.toArray(children);
    return childrenArray.flatMap((child, childIndex) =>
      Array.from({ length: repeat }, (_, repeatIndex) => {
        const itemIndex = repeatIndex * childrenArray.length + childIndex;
        const key = `${childIndex}-${repeatIndex}`;
        return { child, childIndex, repeatIndex, itemIndex, key };
      }),
    );
  }, [children, repeat]);

  const calculateZIndex = useCallback(
    (offsetDistance: number) => {
      if (!enableRollingZIndex) return undefined;
      if (offsetDistance < 2 || offsetDistance > 98) return zIndexBase;
      const normalizedDistance = offsetDistance / 100;
      return Math.round(zIndexBase + normalizedDistance * zIndexRange);
    },
    [enableRollingZIndex, zIndexBase, zIndexRange],
  );

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const isHovered = useRef(false);
  const isDragging = useRef(false);
  const dragVelocityRef = useRef(0);
  const directionFactor = useRef(direction === "normal" ? 1 : -1);

  const hoverFactorValue = useMotionValue(1);
  const smoothHoverFactor = useSpring(hoverFactorValue, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(
    useScrollVelocity ? smoothVelocity : useMotionValue(1),
    [0, 1000],
    [0, 5],
    {
      clamp: false,
    },
  );

  useEffect(() => {
    directionFactor.current = direction === "normal" ? 1 : -1;
  }, [direction]);

  useAnimationFrame((_, delta) => {
    if (isDragging.current && draggable) {
      baseOffset.set(baseOffset.get() + dragVelocityRef.current);
      dragVelocityRef.current *= 0.9;
      if (Math.abs(dragVelocityRef.current) < 0.01) dragVelocityRef.current = 0;
      return;
    }

    if (isHovered.current) {
      hoverFactorValue.set(slowdownOnHover ? slowDownFactor : 1);
    } else {
      hoverFactorValue.set(1);
    }

    let moveBy =
      directionFactor.current *
      baseVelocity *
      (delta / 1000) *
      smoothHoverFactor.get();

    if (scrollAwareDirection && !isDragging.current) {
      const v = velocityFactor.get();
      if (v < 0) directionFactor.current = -1;
      else if (v > 0) directionFactor.current = 1;
    }

    if (useScrollVelocity && !isDragging.current) {
      moveBy +=
        directionFactor.current * moveBy * Math.abs(velocityFactor.get());
    }

    if (draggable) {
      moveBy += dragVelocityRef.current;
      if (dragAwareDirection && Math.abs(dragVelocityRef.current) > 0.1) {
        directionFactor.current = Math.sign(dragVelocityRef.current);
      }
      if (!isDragging.current && Math.abs(dragVelocityRef.current) > 0.01) {
        dragVelocityRef.current *= dragVelocityDecay;
      } else if (!isDragging.current) {
        dragVelocityRef.current = 0;
      }
    }

    baseOffset.set(baseOffset.get() + moveBy);
  });

  const lastPointerPosition = useRef({ x: 0, y: 0 });

  const handleGlobalPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (grabCursor && container.current) {
      container.current.style.cursor = "grab";
    }
  }, [grabCursor]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    if (container.current) container.current.setPointerCapture(e.pointerId);
    if (grabCursor && container.current) {
      container.current.style.cursor = "grabbing";
    }
    isDragging.current = true;
    lastPointerPosition.current = { x: e.clientX, y: e.clientY };
    dragVelocityRef.current = 0;
    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointercancel", handleGlobalPointerUp);
    window.addEventListener("blur", handleGlobalPointerUp);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggable || !isDragging.current) return;
    const currentPosition = { x: e.clientX, y: e.clientY };
    const deltaX = currentPosition.x - lastPointerPosition.current.x;
    const deltaY = currentPosition.y - lastPointerPosition.current.y;
    const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const projectedDelta = deltaX > 0 ? delta : -delta;
    dragVelocityRef.current = projectedDelta * dragSensitivity;
    lastPointerPosition.current = currentPosition;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggable) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    handleGlobalPointerUp();
    window.removeEventListener("pointerup", handleGlobalPointerUp);
    window.removeEventListener("pointercancel", handleGlobalPointerUp);
    window.removeEventListener("blur", handleGlobalPointerUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointercancel", handleGlobalPointerUp);
      window.removeEventListener("blur", handleGlobalPointerUp);
    };
  }, [handleGlobalPointerUp]);

  const handleItemMouseEnter = useCallback(() => {
    isHovered.current = true;
  }, []);

  const handleItemMouseLeave = useCallback(() => {
    isHovered.current = false;
  }, []);

  return (
    <div
      ref={container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full select-none"
      style={{ cursor: draggable && grabCursor ? "grab" : undefined }}
    >
      {items.map(({ child, repeatIndex, itemIndex, key }) => (
        <MarqueeItem
          key={key}
          child={child}
          itemIndex={itemIndex}
          totalItems={items.length}
          repeatIndex={repeatIndex}
          baseOffset={baseOffset}
          path={path}
          easing={easing}
          enableRollingZIndex={enableRollingZIndex}
          calculateZIndex={calculateZIndex}
          draggable={draggable}
          grabCursor={grabCursor}
          cssVariableInterpolation={cssVariableInterpolation}
          onMouseEnter={handleItemMouseEnter}
          onMouseLeave={handleItemMouseLeave}
          fade={fade}
        />
      ))}
    </div>
  );
};

// --- MAIN EXPERIMENT COMPONENT ---

const presetRepeatDefaults: Record<string, number> = {
  loop: 4,
  curly: 4,
  stripes: 4,
};

export default function PathMarqueeExperiment() {
  const [preset, setPreset] = useState("loop");
  const [speed, setSpeed] = useState(5);
  const [repeat, setRepeat] = useState(3);

  const containerRef = useRef<HTMLDivElement>(null);
  const [extractedPath, setExtractedPath] = useState("");

  const updatePath = useCallback(async () => {
    if (containerRef.current) {
      const svg = presetSvgLookup[preset];
      const path = await extractPathsFromSvgString(
        svg,
        containerRef.current.offsetWidth,
        containerRef.current.offsetHeight,
      );
      setExtractedPath(path);
    }
  }, [preset]);

  useEffect(() => {
    updatePath();
    const observer = new ResizeObserver(updatePath);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updatePath]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Controls Overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-999 flex flex-wrap items-end gap-6 bg-black/50 backdrop-blur-md px-5 py-4 rounded-xl border border-white/10 max-w-[calc(100%-3rem)]">
        <div className="flex flex-col gap-2">
          <div className="flex gap-1.5">
            {Object.keys(presetSvgLookup).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPreset(p);
                  setRepeat(presetRepeatDefaults[p] ?? 3);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  preset === p
                    ? "bg-white text-black"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 min-w-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
              Speed
            </span>
            <span className="text-[10px] tabular-nums text-white/50">
              {speed}
            </span>
          </div>
          <Slider
            min={0}
            max={20}
            step={0.5}
            value={[speed]}
            onValueChange={([v]) => setSpeed(v)}
            className="**:data-[slot=slider-track]:bg-white/15 **:data-[slot=slider-range]:bg-white/70 **:data-[slot=slider-thumb]:size-3 **:data-[slot=slider-thumb]:border-white/70 **:data-[slot=slider-thumb]:bg-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
            Repeat
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRepeat((r) => Math.max(1, r - 1))}
              className="w-6 h-6 rounded flex items-center justify-center bg-white/10 text-white/60 hover:bg-white/20 transition-colors text-sm leading-none"
            >
              −
            </button>
            <span className="text-xs tabular-nums text-white/50 w-4 text-center">
              {repeat}
            </span>
            <button
              onClick={() => setRepeat((r) => Math.min(10, r + 1))}
              className="w-6 h-6 rounded flex items-center justify-center bg-white/10 text-white/60 hover:bg-white/20 transition-colors text-sm leading-none"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 w-full relative">
        {extractedPath && (
          <MarqueeAlongSvgPath
            path={extractedPath}
            baseVelocity={speed}
            repeat={repeat}
            fade={false}
            draggable={true}
            grabCursor={true}
            slowdownOnHover={true}
            slowDownFactor={0.3}
            dragVelocityDecay={0.7}
            dragAwareDirection={true}
            scrollAwareDirection={true}
          >
            {images.map((src, i) => (
              <motion.div
                key={i}
                className="w-24 h-32 md:w-32 md:h-44 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5"
                whileHover={{ scale: 1.1, zIndex: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />
              </motion.div>
            ))}
          </MarqueeAlongSvgPath>
        )}
      </div>
    </div>
  );
}
