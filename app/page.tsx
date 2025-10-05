"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Shield, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function HomePage() {
  const { data: session } = useSession({
    required: false,
  });
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Vita</span>
          </div>
          <div>
            <h1>Member Client Session</h1>
            <div>{session?.user?.email}</div>
            {/* <div>{session?.user?.role}</div> */}
          </div>

          <nav className="flex items-center gap-4">
            {session ? (
              <Link href="/api/auth/signout?callbackUrl=/">
                <Button variant="ghost">Log out</Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
            )}
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary mb-4">
              Powered by Hedera Blockchain
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
              Emergency Response at the Speed of Life
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Connect patients with nearby responders instantly. Transparent and
              secure emergency care powered by blockchain technology.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/patient">
                <Button size="lg" className="h-12 px-8">
                  I Need Help
                </Button>
              </Link>
              <Link href="/responder">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8 bg-transparent"
                >
                  I'm a Responder
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-24">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-8 space-y-4 bg-card hover:bg-card/80 transition-colors border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">For Patients</h3>
              <p className="text-muted-foreground leading-relaxed">
                Send instant SOS alerts with your location. Get help from nearby
                certified responders in seconds.
              </p>
            </Card>

            <Card className="p-8 space-y-4 bg-card hover:bg-card/80 transition-colors border-border">
              <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold">For Responders</h3>
              <p className="text-muted-foreground leading-relaxed">
                Accept nearby emergencies, navigate to patients, and save lives.
                Build your reputation on-chain.
              </p>
            </Card>

            <Card className="p-8 space-y-4 bg-card hover:bg-card/80 transition-colors border-border">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">For Admins</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor system-wide activity, track response times, and ensure
                quality care with transparent blockchain records.
              </p>
            </Card>
          </div>
        </section>

        {/* Trust Section */}
        <section className="container mx-auto px-4 py-24 border-t border-border">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Built on Trust & Transparency
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Every emergency alert and response is recorded immutably on
              Hedera's Consensus Service. Your data, your control.
            </p>
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>HCS Consensus</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-secondary" />
                <span>Real-time Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span>GPS Tracking</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built for Hedera Hackathon 2024 • Saving Lives with Blockchain</p>
        </div>
      </footer>
    </div>
  );
}
