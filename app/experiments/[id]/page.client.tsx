"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Check, LinkIcon } from "lucide-react";
import { sortedExperiments } from "@/lib/experiments";
import { ExperimentDisplay } from "@/components/experiment-display";
import { ExperimentInfo } from "@/components/experiment-info";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  params: { id: string };
}

export default function ExperimentPageClient({ params }: Props) {
  const { id } = params;
  const [copied, setCopied] = useState(false);

  const currentIndex = sortedExperiments.findIndex((exp) => exp.id === id);

  if (currentIndex === -1) {
    notFound();
  }

  const experiment = sortedExperiments[currentIndex];
  const prevExperiment =
    currentIndex > 0 ? sortedExperiments[currentIndex - 1] : null;
  const nextExperiment =
    currentIndex < sortedExperiments.length - 1
      ? sortedExperiments[currentIndex + 1]
      : null;

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-1000">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link
                href="/"
                className="flex items-center gap-2 hover:text-foreground transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                Playground
              </Link>
              <ChevronRight className="size-4" />
              <span className="text-foreground">{experiment.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="default"
                size="sm"
                className="gap-2 btn-press h-8 text-xs"
              >
                <a
                  href={experiment.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="size-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Source
                </a>
              </Button>
              <ExperimentInfo experiment={experiment} />
              <Button
                onClick={handleCopyUrl}
                variant="secondary"
                size="icon"
                className="h-8 w-8 btn-press"
              >
                <span className="relative flex items-center justify-center">
                  <Check
                    className={`size-4 absolute transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      copied
                        ? "opacity-100 blur-0"
                        : "opacity-0 blur-[2px]"
                    }`}
                  />
                  <LinkIcon
                    className={`size-3.5 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      copied
                        ? "opacity-0 blur-[2px]"
                        : "opacity-100 blur-0"
                    }`}
                  />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative min-h-screen">
        <div className="h-screen w-full">
          <ExperimentDisplay experimentId={experiment.component} />
        </div>

        <div className="fixed bottom-4 right-4 flex items-center gap-2 z-1000">
          {prevExperiment && (
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="gap-1 h-8 text-xs hover:-translate-y-px"
            >
              <Link href={`/experiments/${prevExperiment.id}`}>
                <ChevronLeft className="size-3.5" />
                Prev
              </Link>
            </Button>
          )}
          {nextExperiment && (
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="gap-1 h-8 text-xs hover:-translate-y-px"
            >
              <Link href={`/experiments/${nextExperiment.id}`}>
                Next
                <ChevronRight className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
