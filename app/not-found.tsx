import Link from "next/link";
import GrainGradient from "@/components/experiments/grain-gradient";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background selection:bg-foreground selection:text-background overflow-hidden">
      <div className="absolute inset-0 z-0">
        <GrainGradient
          colors={["#f8fafc", "#f1f5f9", "#e2e8f0"]}
          colorBack="#ffffff"
          intensity={0.05}
          noise={0.1}
          speed={0.5}
          shape="blob"
        />
      </div>

      <header className="relative z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              Playground -- David Umoru
            </Link>
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/theumoru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                X
              </a>
              <a
                href="https://github.com/davidumoru"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          <div className="space-y-2">
            <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-foreground/5 font-barlow-condensed select-none">
              404
            </h1>
            <div className="relative -mt-24 md:-mt-32">
              <h2 className="text-2xl md:text-4xl font-medium tracking-tight text-foreground">
                Lost in the Playground
              </h2>
              <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-md mx-auto leading-relaxed">
                The experiment you're looking for doesn't exist, or has been
                moved to another dimension.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="rounded-full px-8"
            >
              <Link href="/">Return to Experiments</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="h-px w-full bg-border/50" />
        </div>
      </footer>
    </div>
  );
}
