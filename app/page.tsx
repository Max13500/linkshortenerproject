import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { BarChart3, Globe2, Link2, Zap } from "lucide-react";
import { redirect } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Short links in seconds",
    description:
      "Turn long URLs into clean, shareable links that look polished everywhere you post them.",
    icon: Link2,
  },
  {
    title: "Instant performance insights",
    description:
      "Track engagement with a simple dashboard so you can see which links are getting attention.",
    icon: BarChart3,
  },
  {
    title: "Built for reliable sharing",
    description:
      "Keep campaigns, social posts, and internal resources easy to manage from one place.",
    icon: Globe2,
  },
  {
    title: "Fast workflow for teams",
    description:
      "Create and organize links quickly so your team can move from publishing to measuring without friction.",
    icon: Zap,
  },
];

const steps = [
  "Paste the destination URL you want to share.",
  "Generate a short link that is easier to remember and distribute.",
  "Watch performance from your dashboard after people start clicking.",
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) redirect("/dashboard");

  return (
    <main className="flex flex-1 flex-col bg-background">
      <section className="border-b border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-20 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:py-28">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground">
              Simple link management for modern teams
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Shorten links, share faster, and measure what works.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                LinkShortener helps you turn long URLs into clean links that are easy to share, easy
                to manage, and ready for performance tracking.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <SignUpButton mode="modal">
                <Button size="lg" className="px-6">
                  Start shortening links
                </Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button variant="outline" size="lg" className="px-6">
                  Sign in
                </Button>
              </SignInButton>
              <a href="#features" className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "px-6")}>
                Explore features
              </a>
            </div>
          </div>

          <div className="grid w-full max-w-xl gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:col-span-2">
              <p className="text-sm text-muted-foreground">Why teams use it</p>
              <p className="mt-3 text-2xl font-semibold text-card-foreground">
                Create shorter links that are easier to share across campaigns, docs, and social posts.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-3xl font-semibold text-card-foreground">Fast</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Generate links quickly without leaving your workflow.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-3xl font-semibold text-card-foreground">Clear</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Keep sharing clean and consistent with short, readable URLs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Everything you need for better link sharing
          </h2>
          <p className="text-lg text-muted-foreground">
            A focused workflow for creating short links, keeping them organized, and understanding how
            they perform.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {features.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
                <Icon aria-hidden="true" className="size-5 text-foreground" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-card-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground">How it works</h2>
              <p className="text-lg text-muted-foreground">
                Get from a long URL to a trackable short link in a few straightforward steps.
              </p>
            </div>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </div>
                  <p className="pt-2 text-sm leading-6 text-muted-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 py-20 text-center md:px-10">
        <div className="rounded-[2rem] border border-border bg-card px-6 py-12 shadow-sm sm:px-10">
          <h2 className="text-3xl font-semibold tracking-tight text-card-foreground">
            Ready to turn long URLs into better links?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Create an account to start shortening, organizing, and tracking the links you share every day.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <SignUpButton mode="modal">
              <Button size="lg" className="px-6">
                Create free account
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg" className="px-6">
                I already have an account
              </Button>
            </SignInButton>
          </div>
        </div>
      </section>
    </main>
  );
}
