import { BarChart3, Code2, FileCode, GitBranch, Lock, Puzzle, RefreshCw, Rocket, Shield, Zap } from "lucide-react"

const features = [
  {
    icon: <Code2 className="h-10 w-10 text-purple-500" />,
    title: "Code Review Agent",
    description:
      "Analyze code for complexity, readability issues, and anti-patterns with actionable improvement suggestions.",
  },
  {
    icon: <Zap className="h-10 w-10 text-purple-500" />,
    title: "Optimization Agent",
    description:
      "Identify performance bottlenecks, inefficient algorithms, and memory issues with detailed optimization strategies.",
  },
  {
    icon: <Puzzle className="h-10 w-10 text-purple-500" />,
    title: "Modularization Agent",
    description:
      "Detect complex components and provide step-by-step instructions to refactor them into modular, reusable pieces.",
  },
  {
    icon: <FileCode className="h-10 w-10 text-purple-500" />,
    title: "Documentation Agent",
    description:
      "Automatically generate up-to-date markdown documentation covering architecture, component APIs, and usage examples.",
  },
  {
    icon: <RefreshCw className="h-10 w-10 text-purple-500" />,
    title: "Framework Migration Agent",
    description:
      "Interactive, guided flow for migrating between frameworks, including routing, state management, and styling transitions.",
  },
  {
    icon: <Shield className="h-10 w-10 text-purple-500" />,
    title: "Security Scan Agent",
    description:
      "Continuously monitor for vulnerabilities in dependencies and code with automated security recommendations.",
  },
  {
    icon: <GitBranch className="h-10 w-10 text-purple-500" />,
    title: "GitHub Integration",
    description: "Seamless OAuth authentication to connect your GitHub accounts and import repositories for analysis.",
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-purple-500" />,
    title: "Interactive Insights",
    description:
      "Dynamic dashboard displaying critical metrics such as commit frequency, pull request stats, and complexity hotspots.",
  },
  {
    icon: <Rocket className="h-10 w-10 text-purple-500" />,
    title: "Autonomous Refactoring",
    description: "Automatically apply refactoring changes following approved patterns and project conventions.",
  },
  {
    icon: <Lock className="h-10 w-10 text-purple-500" />,
    title: "Enterprise Security",
    description:
      "Best practices for handling user code and sensitive data, including encryption and secure OAuth flows.",
  },
]

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Powerful AI Agents at Your Service</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our multi-agent system analyzes your code from every angle, providing actionable insights and automated
            improvements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-card rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
