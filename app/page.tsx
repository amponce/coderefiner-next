"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Code2,
  ArrowUpRight,
  Sparkles,
  CircleDot,
  MoveUpRight,
  Lightbulb,
  RefreshCcw,
  FileCode,
  BarChart2,
  History,
  Shield,
  Puzzle,
  Zap,
} from "lucide-react"

export default function LandingPage() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [activeSection, setActiveSection] = useState("hero")
  const [email, setEmail] = useState("")
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY

      // Update active section based on scroll position
      if (scrollPosition < 800) {
        setActiveSection("hero")
      } else if (scrollPosition < 1600) {
        setActiveSection("features")
      } else if (scrollPosition < 2400) {
        setActiveSection("agents")
      } else if (scrollPosition < 3200) {
        setActiveSection("join")
      } else {
        setActiveSection("pricing")
      }

      // Set scrolled state for header styling
      if (scrollPosition > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Email submitted:", email)
    setEmail("")
    // Here you could hook up actual email signup logic
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-accent selection:text-black overflow-hidden">
      {/* Interactive cursor effect */}
      <div
        className="hidden md:block fixed w-60 h-60 rounded-full bg-gradient-to-r from-primary via-accent to-secondary blur-3xl opacity-30 pointer-events-none z-50"
        style={{
          left: `${cursorPosition.x - 120}px`,
          top: `${cursorPosition.y - 120}px`,
          transform: "translate(0, 0) scale(1)",
          transition: "transform 0.1s linear, opacity 0.3s ease, width 0.3s ease, height 0.3s ease",
        }}
      ></div>

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 p-6 transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "mix-blend-difference"
        }`}
      >
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <Link href="/" className="flex items-center gap-2 relative z-10">
            <Code2 className="h-8 w-8 text-white" strokeWidth={1.5} />
            <span className="text-2xl font-bold tracking-tighter">Code Refiner</span>
          </Link>
          <nav className="hidden md:flex items-center gap-10 relative z-10">
            <Link
              href="#features"
              className={`text-sm uppercase tracking-wider border-b-2 ${
                activeSection === "features" ? "border-accent" : "border-transparent"
              }`}
            >
              Features
            </Link>
            <Link
              href="#agents"
              className={`text-sm uppercase tracking-wider border-b-2 ${
                activeSection === "agents" ? "border-accent" : "border-transparent"
              }`}
            >
              AI Agents
            </Link>
            <Link
              href="#join"
              className={`text-sm uppercase tracking-wider border-b-2 ${
                activeSection === "join" ? "border-accent" : "border-transparent"
              }`}
            >
              Join
            </Link>
            <Link
              href="#pricing"
              className={`text-sm uppercase tracking-wider border-b-2 ${
                activeSection === "pricing" ? "border-accent" : "border-transparent"
              }`}
            >
              Pricing
            </Link>
            <div className="ml-6">
              <div className="flex gap-2">
                <Button variant="ghost" className="text-white" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button className="bg-accent hover:bg-accent/90 text-black" asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            </div>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden text-white relative z-10">
            <MoveUpRight className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Hero section */}
      <section id="hero" className="relative min-h-screen flex flex-col justify-center px-6 pt-24 overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-primary to-transparent opacity-20 blur-3xl -z-10"></div>
        <div className="absolute bottom-[10%] right-[15%] w-[30vw] h-[30vw] rounded-full bg-gradient-to-tl from-secondary to-transparent opacity-10 blur-3xl -z-10"></div>

        {/* Minimal grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10 -z-20"></div>

        <div className="max-w-[1600px] mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium space-x-2 mb-8">
                <span className="animate-pulse relative flex h-2 w-2 rounded-full bg-accent"></span>
                <span className="uppercase tracking-widest text-white/70">AI-Powered Analysis</span>
              </div>

              <h1 className="text-7xl md:text-[8rem] font-bold leading-[0.9] tracking-tighter mb-8">
                Code
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                  Refiner
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/70 max-w-xl mb-12 font-light">
                Intelligent code refactoring powered by AI. Analyze, improve, and transform your codebase with
                unprecedented precision.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-8 bg-white text-black hover:bg-accent hover:text-black"
                  asChild
                >
                  <Link href="/register">
                    <span className="text-lg font-medium">Sign up free</span>
                    <ArrowUpRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-8 border-white/30 text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/login">
                    <span className="text-lg font-medium">Log in</span>
                    <CircleDot className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Abstract visual */}
            <div className="relative hidden md:flex justify-center items-center">
              <div className="relative w-[500px] h-[500px]">
                {/* Animated rings */}
                <div className="absolute inset-0 border-2 border-white/5 rounded-full animate-pulse"></div>
                <div
                  className="absolute inset-[40px] border border-white/10 rounded-full"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute inset-[80px] border border-accent/30 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute inset-[120px] border border-white/20 rounded-full animate-pulse"
                  style={{ animationDelay: "1.5s" }}
                ></div>
                <div
                  className="absolute inset-[160px] border border-primary/30 rounded-full animate-pulse"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="absolute inset-[200px] border border-white/5 rounded-full animate-pulse"
                  style={{ animationDelay: "2.5s" }}
                ></div>
                <div
                  className="absolute inset-[240px] border-2 border-accent/40 rounded-full animate-pulse"
                  style={{ animationDelay: "3s" }}
                ></div>
                {/* Centered icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Code2 className="h-24 w-24 text-white" strokeWidth={1} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="relative py-40 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black -z-10"></div>

        <div className="max-w-[1600px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-5 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-widest text-white/50 mb-6">01 / Features</span>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
                Exceed <span className="text-accent">expectations</span>
              </h2>
              <p className="text-xl text-white/70 mb-12">
                Advanced code analysis tools that go beyond traditional static analysis. See your code through the eyes
                of an expert.
              </p>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-12 h-12 rounded-xl flex items-center justify-center bg-white/5">
                    <Lightbulb className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Intelligent insights</h3>
                    <p className="text-white/70">
                      AI-driven analysis identifies patterns, anti-patterns, and opportunities for improvement your team
                      might miss.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-12 h-12 rounded-xl flex items-center justify-center bg-white/5">
                    <History className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Historical tracking</h3>
                    <p className="text-white/70">
                      Track your codebase's evolution with detailed historical analysis and visualize improvements over
                      time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-12 h-12 rounded-xl flex items-center justify-center bg-white/5">
                    <RefreshCcw className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-2">Automated refactoring</h3>
                    <p className="text-white/70">
                      Get actionable refactoring plans with step-by-step guidance to implement improvements with
                      confidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 flex items-center justify-center">
              <div className="relative w-full aspect-square max-w-[600px]">
                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
                  {[...Array(25)].map((_, i) => (
                    <div key={i} className="border border-white/5 flex items-center justify-center">
                      {i % 7 === 0 && <div className="w-2 h-2 rounded-full bg-accent/50"></div>}
                    </div>
                  ))}
                </div>

                {/* Floating elements */}
                <div className="absolute top-[20%] left-[30%] w-40 h-40 bg-gradient-to-br from-primary to-accent rounded-xl rotate-12 blur-md opacity-30 animate-float"></div>
                <div
                  className="absolute bottom-[25%] right-[20%] w-60 h-60 bg-gradient-to-tl from-accent to-secondary rounded-full -rotate-12 blur-lg opacity-20 animate-float"
                  style={{ animationDelay: "1.5s" }}
                ></div>

                {/* Code block artwork */}
                <div className="absolute inset-[15%] flex items-center justify-center">
                  <div className="w-full h-full border border-white/20 rounded-3xl bg-white/5 backdrop-blur-sm p-6 rotate-3 animate-float">
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-accent/20 via-transparent to-primary/30 p-4 font-mono text-sm overflow-hidden">
                      <div className="text-white/80">
                        <div className="text-primary">
                          function <span className="text-white">analyzeCode</span>() {"{"}
                        </div>
                        <div className="pl-4">
                          const insights = <span className="text-accent">AI</span>.analyze(codebase);
                        </div>
                        <div className="pl-4">
                          const plan = <span className="text-accent">AI</span>.createRefactoringPlan(insights);
                        </div>
                        <div className="pl-4">return {"{"}</div>
                        <div className="pl-8">improvements: plan.suggestions,</div>
                        <div className="pl-8">metrics: insights.metrics,</div>
                        <div className="pl-8">visualizations: createVisuals(insights)</div>
                        <div className="pl-4">{"}"}</div>
                        <div>{"}"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents section */}
      <section id="agents" className="relative py-40 bg-gradient-to-b from-black to-[#080808] overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-xs uppercase tracking-widest text-white/50 mb-6 block">02 / AI Agents</span>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
              Specialized{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">agents</span>
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Our AI agents specialize in different aspects of code quality, working together to provide comprehensive
              insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Agent card 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all duration-300">
                <Code2 className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Code Review</h3>
              <p className="text-white/70 mb-6">
                Analyzes code for complexity, readability issues, and anti-patterns with actionable improvement
                suggestions.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Readability</span>
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Anti-patterns</span>
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Best Practices</span>
              </div>
            </div>

            {/* Agent card 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all duration-300">
                <Zap className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Optimization</h3>
              <p className="text-white/70 mb-6">
                Identifies performance bottlenecks, inefficient algorithms, and memory issues with detailed optimization
                strategies.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Performance</span>
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Algorithms</span>
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Memory</span>
              </div>
            </div>

            {/* Agent card 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all duration-300">
                <Puzzle className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Modularization</h3>
              <p className="text-white/70 mb-6">
                Detects complex components and provides step-by-step instructions to refactor them into modular,
                reusable pieces.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Architecture</span>
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Components</span>
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Reusability</span>
              </div>
            </div>

            {/* Agent card 4 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all duration-300">
                <Shield className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Security</h3>
              <p className="text-white/70 mb-6">
                Continuously monitors for vulnerabilities in dependencies and code with automated security
                recommendations.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Vulnerabilities</span>
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Dependencies</span>
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Best Practices</span>
              </div>
            </div>

            {/* Agent card 5 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all duration-300">
                <FileCode className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Documentation</h3>
              <p className="text-white/70 mb-6">
                Automatically generates up-to-date markdown documentation covering architecture, component APIs, and
                usage examples.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">APIs</span>
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Architecture</span>
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Examples</span>
              </div>
            </div>

            {/* Agent card 6 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-all duration-300">
                <RefreshCcw className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Framework Migration</h3>
              <p className="text-white/70 mb-6">
                Provides an interactive, guided flow for migrating between frameworks, including routing, state
                management, and styling.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Migration</span>
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Frameworks</span>
                <span className="px-2 py-1 bg-white/5 rounded-full text-xs">Guidance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-radial from-accent/5 to-transparent opacity-50 -z-10"></div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-white/50 mb-6 block">03 / PRICING</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              Choose your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">protection</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Start with our free plan to explore Code Refiner's capabilities, then upgrade as your code quality needs
              evolve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="rounded-2xl border border-white/10 backdrop-blur-sm p-8 bg-black/40 hover:border-white/20 transition-all duration-300">
              <div className="mb-6">
                <h3 className="font-semibold text-xl">Refiner Basic</h3>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-bold">Free</span>
                  <span className="text-white/60 text-sm">forever</span>
                </div>
                <p className="text-white/60 text-sm mt-2">
                  Perfect for individual developers wanting to test the waters.
                </p>
              </div>

              <Button variant="outline" className="w-full mb-8 py-6" asChild>
                <Link href="/register">Get started</Link>
              </Button>

              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Basic repository analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>5 files per analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Standard issue detection</span>
                </li>
                <li className="flex items-start gap-2 text-white/40">
                  <CircleDot className="h-5 w-5 text-white/40 shrink-0 mt-0.5" />
                  <span>AI-powered refactoring</span>
                </li>
                <li className="flex items-start gap-2 text-white/40">
                  <CircleDot className="h-5 w-5 text-white/40 shrink-0 mt-0.5" />
                  <span>Package vulnerability checks</span>
                </li>
              </ul>
            </div>

            {/* Pro Tier */}
            <div className="rounded-2xl border-2 border-accent backdrop-blur-sm p-8 bg-black/40 relative hover:border-accent transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-accent/20 scale-105 z-10">
              <div className="absolute top-0 left-0 w-full">
                <div className="bg-accent text-black text-sm font-medium py-2 rounded-t-lg text-center">
                  RECOMMENDED
                </div>
              </div>

              <div className="mb-6 mt-6">
                <h3 className="font-semibold text-2xl">Refiner Pro</h3>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-5xl font-bold">$19</span>
                  <span className="text-white/70 text-sm">/month</span>
                </div>
                <p className="text-white/70 text-sm mt-2">
                  For professional developers and small teams building quality software.
                </p>
              </div>

              <Button className="w-full mb-8 py-6 bg-accent hover:bg-accent/90 text-black font-bold shadow-md" asChild>
                <Link href="/register">Upgrade now</Link>
              </Button>

              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Advanced repository analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Unlimited files per analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Advanced issue detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>AI-powered refactoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Package vulnerability checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Custom rule sets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Private repository support</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Tier */}
            <div className="rounded-2xl border border-white/10 backdrop-blur-sm p-8 bg-black/40 hover:border-white/20 transition-all duration-300">
              <div className="mb-6">
                <h3 className="font-semibold text-xl">Refiner Enterprise</h3>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-white/60 text-sm">/month</span>
                </div>
                <p className="text-white/60 text-sm mt-2">
                  For teams and organizations requiring advanced code quality control.
                </p>
              </div>

              <Button variant="outline" className="w-full mb-8 py-6" asChild>
                <Link href="/contact">Contact sales</Link>
              </Button>

              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Team collaboration features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Custom rule sets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>API access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CircleDot className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Custom Solutions Box */}
          <div className="mt-12 rounded-2xl border border-white/10 backdrop-blur-sm p-8 bg-black/40">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Need a custom solution?</h3>
                  <p className="text-white/60">
                    We offer tailored solutions for large organizations with specific code quality requirements.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="shrink-0" asChild>
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Join section */}
      <section id="join" className="relative py-40 overflow-hidden bg-gradient-to-b from-[#080808] to-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-5 -z-10"></div>
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black to-transparent -z-10"></div>

        <div className="max-w-[1600px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest text-white/50 mb-6 block">04 / Join</span>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                Transform your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">codebase</span>
              </h2>
              <p className="text-xl text-white/70 mb-12">
                Join developers who are using AI-powered code analysis to elevate their projects, reduce technical debt,
                and build better software.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                    Join our waiting list
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-full focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      className="absolute right-1.5 top-1.5 rounded-full bg-accent text-black hover:bg-white"
                    >
                      Get early access
                    </Button>
                  </div>
                </div>
              </form>

              <div className="mt-12 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xs font-medium">
                    TK
                  </div>
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-xs font-medium">
                    JD
                  </div>
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                    RN
                  </div>
                </div>
                <p className="text-sm text-white/70">
                  Join <span className="font-medium text-white">120+</span> developers already using Code Refiner
                </p>
              </div>
            </div>

            <div className="hidden md:block relative">
              <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl -z-10"></div>

              <div className="relative border border-white/10 rounded-2xl backdrop-blur-sm p-6 bg-black/40">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <BarChart2 className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-medium">Analysis Results</h3>
                      <p className="text-xs text-white/60">Current Project</p>
                    </div>
                  </div>
                  <span className="text-xs text-white/60">Apr 13, 2025</span>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Code Complexity</span>
                      <span className="font-medium">Reduced by 28%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
                        style={{ width: "72%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Issues Resolved</span>
                      <span className="font-medium">34 of 42</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
                        style={{ width: "81%" }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Test Coverage</span>
                      <span className="font-medium">Increased by 45%</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button variant="outline" className="w-full border-white/10 hover:bg-white/5">
                    View full report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 mt-12">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Code2 className="h-6 w-6 text-white" strokeWidth={1.5} />
                <span className="text-xl font-bold tracking-tighter">Code Refiner</span>
              </div>
              <p className="text-sm text-white/60 mb-6">
                AI-powered code refactoring toolkit that identifies improvement opportunities and enhances developer
                productivity.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/60 hover:text-accent">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-accent">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.21c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-accent">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Features</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li>
                  <a href="#" className="hover:text-accent">
                    Code Analysis
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Refactoring Plans
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Historical Tracking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    AI Agents
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Visualization
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Resources</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li>
                  <a href="#" className="hover:text-accent">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li>
                  <a href="#" className="hover:text-accent">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Data Processing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-white/40">© 2025 Code Refiner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
