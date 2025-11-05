import { Link } from "wouter";
import { Book, Castle, Calculator, Calendar, Search, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const features = [
    {
      icon: Book,
      title: "Documentation Browser",
      description: "Explore comprehensive rules, facilities, orders, and mechanics with powerful search and navigation.",
      link: "/docs",
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Castle,
      title: "Bastion Builder",
      description: "Create and manage your character's Bastion with facility selection, defender tracking, and progression tools.",
      link: "/builder",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Calculator,
      title: "Cost Calculator",
      description: "Calculate facility construction costs, enlargements, and defensive walls with automatic pricing.",
      link: "/calculator",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Calendar,
      title: "Turn Tracker",
      description: "Manage Bastion turns, track banking, schedule orders, and monitor event triggers.",
      link: "/tracker",
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,46,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,46,0.08),transparent_50%)]" />
        
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground">
              Bastion System Explorer
            </h1>
          </div>
          
          <p className="text-center text-xl md:text-2xl text-muted-foreground font-serif mb-4">
            Pathfinder 2e Remastered v2.1
          </p>
          
          <p className="max-w-3xl mx-auto text-center text-lg text-foreground/80 mb-8">
            Interactive documentation and management tools for the complete Bastion System. 
            Build your stronghold, manage facilities, track turns, and master the rules with 
            comprehensive reference materials and calculators.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link href="/docs">
              <Button size="lg" data-testid="button-docs">
                <Book className="mr-2 h-5 w-5" />
                Browse Documentation
              </Button>
            </Link>
            <Link href="/builder">
              <Button size="lg" variant="outline" data-testid="button-builder">
                <Castle className="mr-2 h-5 w-5" />
                Build Your Bastion
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold mb-4">Comprehensive Tools & Resources</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to run the Bastion System in your Pathfinder 2e campaign, 
            from complete rules reference to interactive management tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {features.map((feature) => (
            <Link key={feature.link} href={feature.link}>
              <Card className="hover-elevate active-elevate-2 transition-all h-full" data-testid={`card-feature-${feature.link.slice(1)}`}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-muted ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="font-serif text-xl">{feature.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Reference Cards */}
        <div className="border-t pt-16">
          <h3 className="font-serif text-2xl font-bold mb-8 text-center">Quick Reference</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card data-testid="card-quick-levels">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Level Progression</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level 5:</span>
                  <span>Start with 4 facilities</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level 7:</span>
                  <span>Advanced tier</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level 9:</span>
                  <span>+1 facility</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level 11:</span>
                  <span>Enhanced tier</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level 13:</span>
                  <span>+1 facility</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level 15:</span>
                  <span>Master tier</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Level 17:</span>
                  <span>+1 facility</span>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-quick-costs">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Facility Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cramped (4 sq):</span>
                  <span className="font-bold">300 gp</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Roomy (16 sq):</span>
                  <span className="font-bold">800 gp</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vast (36 sq):</span>
                  <span className="font-bold">2,500 gp</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Cramped → Roomy:</span>
                    <span>500 gp</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Roomy → Vast:</span>
                    <span>1,700 gp</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Cramped → Vast:</span>
                    <span>2,200 gp</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-quick-income">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Income Caps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Levels 5-8:</span>
                  <span className="font-bold">50 gp/turn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Levels 9-12:</span>
                  <span className="font-bold">100 gp/turn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Levels 13-16:</span>
                  <span className="font-bold">150 gp/turn</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Levels 17+:</span>
                  <span className="font-bold">250 gp/turn</span>
                </div>
                <div className="border-t pt-2 mt-2 text-xs text-muted-foreground">
                  Excess income converts to non-monetary benefits
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-16">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-muted-foreground">
          <p className="font-serif">Pathfinder 2e Bastion System Explorer v2.1</p>
          <p className="mt-2">Complete interactive documentation and management tools</p>
        </div>
      </div>
    </div>
  );
}
