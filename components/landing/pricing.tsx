import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Starter",
    description: "Perfect for individual developers",
    price: "$29",
    period: "per month",
    features: [
      "3 GitHub repositories",
      "Basic code analysis",
      "Redundancy detection",
      "Code review suggestions",
      "Documentation generation",
      "Email support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    description: "Ideal for professional developers and small teams",
    price: "$79",
    period: "per month",
    features: [
      "10 GitHub repositories",
      "Advanced code analysis",
      "All Starter features",
      "Framework migration assistant",
      "Security scanning",
      "Package maintenance",
      "Priority support",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For organizations with advanced needs",
    price: "$199",
    period: "per month",
    features: [
      "Unlimited repositories",
      "All Professional features",
      "Autonomous refactoring",
      "Team collaboration",
      "Custom integrations",
      "Advanced security features",
      "Dedicated support",
      "Custom training",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function LandingPricing() {
  return (
    <section id="pricing" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that's right for you or your team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? "border-purple-500 shadow-lg" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit px-3 py-1 bg-purple-500 text-white text-sm font-medium rounded-full">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/login">{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
