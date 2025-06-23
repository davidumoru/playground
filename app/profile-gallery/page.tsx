"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

const people = [
  { name: "Chloe", img: "https://i.pravatar.cc/200?img=10" },
  { name: "Ben", img: "https://i.pravatar.cc/200?img=2" },
  { name: "Adam", img: "https://i.pravatar.cc/200?img=3" },
  { name: "David", img: "https://i.pravatar.cc/200?img=4" },
  { name: "Ella", img: "https://i.pravatar.cc/200?img=5" },
  { name: "Finn", img: "https://i.pravatar.cc/200?img=6" },
  { name: "Jack", img: "https://i.pravatar.cc/200?img=7" },
  { name: "Henry", img: "https://i.pravatar.cc/200?img=8" },
  { name: "Ivy", img: "https://i.pravatar.cc/200?img=9" },
];

const defaultName = "tshirt0";

function splitText(text: string) {
  return text.split("").map((char, i) => (
    <span
      className="letter"
      key={i}
      style={{ position: "relative", display: "inline-block" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}

export default function ProfileGallery() {
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const namesRef = useRef<(HTMLDivElement | null)[]>([]);
  const defaultNameRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();

    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Initialize all name letters to be hidden
    namesRef.current.forEach((div) => {
      if (!div) return;
      const letters = Array.from(div.querySelectorAll(".letter"));
      gsap.set(letters, { y: "100%" });
    });

    // Initialize default name letters
    if (defaultNameRef.current) {
      const letters = Array.from(
        defaultNameRef.current.querySelectorAll(".letter")
      );
      gsap.set(letters, { y: "100%" });
    }

    let activeIndex: number | null = null;
    const cleanupFns: (() => void)[] = [];

    if (!isMobile) {
      // Desktop interactions
      imagesRef.current.forEach((img, index) => {
        const nameDiv = namesRef.current[index];
        if (!img || !nameDiv) return;
        const letters = Array.from(nameDiv.querySelectorAll(".letter"));

        const onEnter = () => {
          gsap.killTweensOf(img);
          gsap.killTweensOf(letters);
          gsap.to(img, {
            width: 120,
            height: 120,
            duration: 0.5,
            ease: "power4.out",
          });
          gsap.to(letters, {
            y: "-100%",
            ease: "power4.out",
            duration: 0.785,
            stagger: { each: 0.025, from: "center" },
          });
        };

        const onLeave = () => {
          gsap.killTweensOf(img);
          gsap.killTweensOf(letters);
          gsap.to(img, {
            width: 100,
            height: 100,
            duration: 0.5,
            ease: "power4.out",
          });
          gsap.to(letters, {
            y: "0%",
            ease: "power4.out",
            duration: 0.75,
            stagger: { each: 0.025, from: "center" },
          });
        };

        img.addEventListener("mouseenter", onEnter);
        img.addEventListener("mouseleave", onLeave);

        cleanupFns.push(() => {
          img.removeEventListener("mouseenter", onEnter);
          img.removeEventListener("mouseleave", onLeave);
        });
      });

      // Container hover for default name
      if (containerRef.current && defaultNameRef.current) {
        const container = containerRef.current;
        const defaultLetters = Array.from(
          defaultNameRef.current.querySelectorAll(".letter")
        );

        const onContainerEnter = () => {
          gsap.killTweensOf(defaultLetters);
          gsap.to(defaultLetters, {
            y: "0%",
            ease: "power4.out",
            duration: 0.75,
            stagger: { each: 0.025, from: "center" },
          });
        };

        const onContainerLeave = () => {
          gsap.killTweensOf(defaultLetters);
          gsap.to(defaultLetters, {
            y: "100%",
            ease: "power4.out",
            duration: 0.75,
            stagger: { each: 0.025, from: "center" },
          });
        };

        container.addEventListener("mouseenter", onContainerEnter);
        container.addEventListener("mouseleave", onContainerLeave);

        cleanupFns.push(() => {
          container.removeEventListener("mouseenter", onContainerEnter);
          container.removeEventListener("mouseleave", onContainerLeave);
        });
      }
    } else {
      // Mobile interactions
      imagesRef.current.forEach((img, index) => {
        const nameDiv = namesRef.current[index];
        if (!img || !nameDiv) return;
        const letters = Array.from(nameDiv.querySelectorAll(".letter"));

        gsap.set(letters, { y: "0%" });
        gsap.set(img, { scale: 1 });

        const onClick = () => {
          if (activeIndex === index) return;

          // Reset previous
          if (activeIndex !== null && namesRef.current[activeIndex]) {
            const prevLetters = Array.from(
              namesRef.current[activeIndex]!.querySelectorAll(".letter")
            );
            const prevImg = imagesRef.current[activeIndex];
            if (prevImg) {
              gsap.killTweensOf(prevLetters);
              gsap.killTweensOf(prevImg);
              gsap.to(prevLetters, {
                y: "0%",
                ease: "power4.out",
                duration: 0.5,
                stagger: { each: 0.02, from: "center" },
              });
              gsap.to(prevImg, {
                width: 60,
                height: 60,
                duration: 0.4,
                ease: "power2.out",
              });
            }
          }

          // Animate current
          gsap.killTweensOf(letters);
          gsap.killTweensOf(img);
          gsap.to(img, {
            width: 80,
            height: 80,
            duration: 0.4,
            ease: "power2.out",
          });
          gsap.to(letters, {
            y: "-100%",
            ease: "power4.out",
            duration: 0.75,
            stagger: { each: 0.025, from: "center" },
          });
          activeIndex = index;
        };

        img.addEventListener("click", onClick);
        cleanupFns.push(() => {
          img.removeEventListener("click", onClick);
        });
      });

      // Show default name on mobile
      if (defaultNameRef.current) {
        const defaultLetters = Array.from(
          defaultNameRef.current.querySelectorAll(".letter")
        );
        gsap.to(defaultLetters, {
          y: "0%",
          ease: "power4.out",
          duration: 0.75,
          stagger: { each: 0.025, from: "center" },
        });
      }
    }

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [isMobile, mounted]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  const imgSize = isMobile ? 60 : 100;
  const imgPadding = isMobile ? 2.5 : 5;
  const nameFontSize = isMobile ? "4rem" : "20rem";
  const nameLetterSpacing = isMobile ? "0" : "-0.5rem";
  const namesHeight = isMobile ? "4rem" : "20rem";

  return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
      <section
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          color: "#e3e3db",
          display: "flex",
          flexDirection: isMobile ? "column-reverse" : "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2.5em",
          overflow: "hidden",
        }}
      >
        <div
          ref={containerRef}
          className="profile-images"
          style={{
            width: "max-content",
            display: "flex",
            flexWrap: isMobile ? "wrap" : "nowrap",
            maxWidth: isMobile ? "90%" : "none",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {people.map((person, i) => (
            <div
              className="img"
              key={person.name}
              ref={(el) => {
                imagesRef.current[i] = el;
              }}
              style={{
                position: "relative",
                width: imgSize,
                height: imgSize,
                padding: imgPadding,
                cursor: "pointer",
                willChange: "width, height",
              }}
            >
              <Image
                src={person.img}
                alt={person.name}
                width={200}
                height={200}
                style={{
                  borderRadius: "0.5rem",
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
                unoptimized
              />
            </div>
          ))}
        </div>

        <div
          className="profile-names"
          style={{
            width: "100%",
            height: namesHeight,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            className="name default"
            ref={defaultNameRef}
            style={{
              position: "absolute",
              width: "100%",
              textAlign: "center",
              textTransform: "uppercase",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: nameFontSize,
              fontWeight: 900,
              letterSpacing: nameLetterSpacing,
              lineHeight: 1,
              color: "#e3e3db",
              userSelect: "none",
              left: 0,
              top: 0,
              transform: "translateY(100%)",
            }}
          >
            <h1 style={{ margin: 0 }}>{splitText(defaultName)}</h1>
          </div>
          {people.map((person, i) => (
            <div
              className="name"
              key={person.name}
              ref={(el) => {
                namesRef.current[i] = el;
              }}
              style={{
                position: "absolute",
                width: "100%",
                textAlign: "center",
                textTransform: "uppercase",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: nameFontSize,
                fontWeight: 900,
                letterSpacing: nameLetterSpacing,
                lineHeight: 1,
                color: "#f93535",
                userSelect: "none",
                left: 0,
                top: 0,
                transform: "translateY(100%)",
              }}
            >
              <h1 style={{ margin: 0 }}>{splitText(person.name)}</h1>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
