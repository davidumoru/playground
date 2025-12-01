"use client"

import Link from "next/link"
import { experiments } from "@/lib/experiments"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header>
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-accent" />
            <h1 className="text-lg font-medium text-foreground">Playground</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {experiments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-16 rounded-2xl bg-muted mb-6" />
            <h3 className="text-xl font-medium text-foreground mb-2">No experiments yet</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiments.map((experiment) => (
              <Link key={experiment.id} href={`/experiments/${experiment.id}`} className="group block">
                <div className="relative overflow-hidden bg-muted aspect-[4/3] transition-all ease-ui animate-medium hover:shadow-xl active:scale-[0.97]">
                  <Image
                    src={`/.jpg?height=600&width=800&query=${encodeURIComponent(experiment.title)}`}
                    alt={experiment.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-ui group-hover:scale-105"
                  />
                </div>

                <div className="flex items-center justify-between mt-3">
                  <h3 className="text-base font-medium text-foreground group-hover:text-accent transition-colors ease-ui animate-fast">
                    {experiment.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {experiment.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
