"use client";

import { ImageTrail } from "@/components/image-trail/ImageTrail";

export default function Page() {
  const imageUrls = [
    "https://images.unsplash.com/photo-1683009427590-dd987135e66c",
    "https://images.unsplash.com/photo-1513622118278-bc041b3c13ed",
    "https://images.unsplash.com/photo-1605315188787-e3c8f6bf927a",
    "https://images.unsplash.com/photo-1603565816030-6b389eeb23cb",
    "https://images.unsplash.com/photo-1503614472-8c93d56e92ce",
    "https://images.unsplash.com/photo-1483653364400-eedcfb9f1f88",
    "https://images.unsplash.com/photo-1609412058473-c199497c3c5d",
    "https://images.unsplash.com/photo-1741571530246-227ba4024cdf",
    "https://images.unsplash.com/photo-1741484730838-d8cc2e4a9bf4",
    "https://images.unsplash.com/photo-1741526798351-50eeb46b2a06",
  ].map((url) => `${url}?auto=format&fit=crop&w=400&q=80`);

  return (
    <div className="w-full h-screen">
      <ImageTrail
        images={imageUrls}
        duration={2.0}
        fadeOutDuration={0.5}
        spawnInterval={80}
        maxImages={8}
      />
    </div>
  );
}