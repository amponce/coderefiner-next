import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Senior Developer at TechCorp",
    avatar: "/placeholder.svg?key=y4rz7",
    content:
      "CodeRefiner has transformed our development workflow. The AI agents identified optimization opportunities we had missed for months, resulting in a 40% performance improvement.",
  },
  {
    name: "Sarah Chen",
    role: "CTO at StartupX",
    avatar: "/confident-innovator.png",
    content:
      "The framework migration agent saved us weeks of work when moving from React to Next.js. The step-by-step guidance was invaluable for our team.",
  },
  {
    name: "Michael Rodriguez",
    role: "Lead Engineer at DevShop",
    avatar: "/thoughtful-engineer.png",
    content:
      "I was skeptical about AI code refactoring, but CodeRefiner proved me wrong. The modularization suggestions were spot-on and helped us reduce technical debt significantly.",
  },
]

export function LandingTestimonials() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Trusted by Developers</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what developers and teams are saying about CodeRefiner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
