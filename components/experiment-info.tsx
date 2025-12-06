"use client"

import { useState } from "react"
import { Info, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { Experiment } from "@/lib/experiments"

interface ExperimentInfoProps {
  experiment: Experiment
}

export function ExperimentInfo({ experiment }: ExperimentInfoProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="secondary" size="sm" className="gap-2 btn-press" onClick={() => setIsOpen(true)}>
        <Info className="size-4" />
        Info
      </Button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 backdrop-blur-[2px] bg-black/5"
              onClick={() => setIsOpen(false)}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{
                  duration: 0.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative w-full max-w-2xl rounded-3xl bg-[#0a0a0a] p-12 shadow-2xl pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute left-8 top-8">
                  <button className="flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors">
                    <Info className="size-4" />
                    <span className="text-sm">Info</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-8 top-8 text-white/60 hover:text-white transition-colors btn-press"
                >
                  <X className="size-5" />
                </button>

                <div className="mt-16 space-y-8">
                  <div>
                    <h2 className="text-3xl font-normal text-white mb-4">{experiment.title}</h2>
                    <p className="text-white/60 leading-relaxed text-base">{experiment.description}</p>
                  </div>

                  <div>
                    <p className="text-sm text-white/50 mb-3">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {experiment.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 rounded-md bg-white/10 text-white/80 text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <span className="text-sm text-white/50">Made by</span>
                    <a
                      href={experiment.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#0ea5e9] font-medium hover:underline transition-all"
                    >
                      {experiment.author}
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
