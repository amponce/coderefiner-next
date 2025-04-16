import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Github } from "lucide-react"

export function LandingHero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[60vh] w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent blur-[100px]" />
      </div>

      <div className="container relative">
        <div className="text-center space-y-10 max-w-3xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Refine Your Code with{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI-Powered
              </span>{" "}
              Intelligence
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              CodeRefiner uses advanced AI to audit, optimize, refactor, and document your codebase, making your
              development workflow faster and more efficient.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">
                <Github className="mr-2 h-4 w-4" /> Connect with GitHub
              </Link>
            </Button>
          </div>

          <div className="pt-8">
            <div className="rounded-lg border bg-card p-1 shadow-sm">
              <img
                src="/code-analysis-dark-dashboard.png"
                alt="CodeRefiner Dashboard"
                className="rounded-md w-full h-auto shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
