"use client";

import Link from "next/link";
import { experiments } from "@/lib/experiments";
import Image from "next/image";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header>
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="size-6 rounded-lg bg-accent" />
            <h1 className="text-lg font-medium text-foreground">Playground</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {experiments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-16 rounded-2xl bg-muted mb-6" />
            <h3 className="text-xl font-medium text-foreground mb-2">
              No experiments yet
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((experiment) => (
              <Link
                key={experiment.id}
                href={`/experiments/${experiment.id}`}
                className="group block"
              >
                <div className="bg-white rounded-xl border border-border/70 overflow-hidden flex flex-col h-full">
                  <div className="p-5 pb-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium text-foreground tracking-tight">
                        {experiment.title}
                      </h3>
                      <p className="text-sm text-muted-foreground tabular-nums">
                        {formatDate(experiment.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="relative overflow-hidden px-5 mb-4">
                    <div
                      className="relative w-full"
                      style={{ aspectRatio: "16/10" }}
                    >
                      {experiment.previewVideo ? (
                        <video
                          src={experiment.previewVideo}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <Image
                          src={`${experiment.previewImage}`}
                          alt={experiment.title}
                          fill
                          className="object-cover rounded"
                        />
                      )}
                    </div>
                  </div>

                  <div className="px-1.5 pb-1.5">
                    <div className="w-full rounded-md bg-secondary text-secondary-foreground text-xs font-medium py-2.5 px-3 text-center transition-all duration-200 ease-ui group-hover:bg-secondary/75 group-hover:-translate-y-px active:translate-y-0 active:scale-[0.98]">
                      View Prototype →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
