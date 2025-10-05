"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Users, AlertCircle, Clock, TrendingUp, TrendingDown, Shield, Award, User } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const recentAlerts = [
    {
      id: "1",
      patient: "John D.",
      responder: "Dr. Sarah J.",
      status: "completed",
      responseTime: "3.2 min",
      location: "Downtown SF",
      timestamp: "2 min ago",
    },
    {
      id: "2",
      patient: "Sarah M.",
      responder: "EMT Mike R.",
      status: "in-progress",
      responseTime: "1.8 min",
      location: "Mission District",
      timestamp: "5 min ago",
    },
    {
      id: "3",
      patient: "Mike R.",
      responder: "Pending",
      status: "pending",
      responseTime: "-",
      location: "SOMA",
      timestamp: "8 min ago",
    },
  ]

  const topResponders = [
    { name: "Dr. Sarah Johnson", responses: 47, avgTime: "3.2 min", rating: 4.9, tokens: 2450 },
    { name: "EMT Mike Rodriguez", responses: 42, avgTime: "3.8 min", rating: 4.8, tokens: 2180 },
    { name: "Paramedic Lisa Chen", responses: 38, avgTime: "4.1 min", rating: 4.7, tokens: 1980 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-secondary text-secondary-foreground"
      case "in-progress":
        return "bg-accent text-accent-foreground"
      case "pending":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium">Admin Dashboard</p>
              <p className="text-xs text-muted-foreground">System Overview</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              Sign Out
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="bg-background">
                Live
              </Badge>
            </div>
            <div>
              <p className="text-3xl font-bold">23</p>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-secondary">
              <TrendingUp className="h-4 w-4" />
              <span>+12% from yesterday</span>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <Badge variant="outline" className="bg-background">
                Online
              </Badge>
            </div>
            <div>
              <p className="text-3xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Active Responders</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-secondary">
              <TrendingUp className="h-4 w-4" />
              <span>+8% from last week</span>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <Badge variant="outline" className="bg-background">
                24h Avg
              </Badge>
            </div>
            <div>
              <p className="text-3xl font-bold">3.8 min</p>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-primary">
              <TrendingDown className="h-4 w-4" />
              <span>-15% improvement</span>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-secondary" />
              </div>
              <Badge variant="outline" className="bg-background">
                Today
              </Badge>
            </div>
            <div>
              <p className="text-3xl font-bold">342</p>
              <p className="text-sm text-muted-foreground">Completed Responses</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-secondary">
              <TrendingUp className="h-4 w-4" />
              <span>+23% from yesterday</span>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Alerts */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Recent Alerts</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <Card key={alert.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold">{alert.patient}</p>
                        <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Responder</p>
                      <p className="font-medium truncate">{alert.responder}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Response Time</p>
                      <p className="font-medium">{alert.responseTime}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Location</p>
                      <p className="font-medium">{alert.location}</p>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Responders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Top Responders</h2>
              <Award className="h-5 w-5 text-accent" />
            </div>

            <div className="space-y-3">
              {topResponders.map((responder, index) => (
                <Card key={responder.name} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-secondary" />
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{responder.name}</p>
                      <p className="text-xs text-muted-foreground">{responder.responses} responses</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2 bg-muted/50 rounded text-center">
                      <p className="text-muted-foreground mb-0.5">Avg Time</p>
                      <p className="font-semibold">{responder.avgTime}</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded text-center">
                      <p className="text-muted-foreground mb-0.5">Rating</p>
                      <p className="font-semibold">{responder.rating}/5</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded text-center">
                      <p className="text-muted-foreground mb-0.5">Tokens</p>
                      <p className="font-semibold">{responder.tokens}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-bold mb-6">System Health</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">HCS Consensus Service</p>
                <Badge className="bg-secondary text-secondary-foreground">Operational</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Messages logged</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Avg latency</span>
                  <span className="font-medium">0.8s</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">HFS File Storage</p>
                <Badge className="bg-secondary text-secondary-foreground">Operational</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Files stored</span>
                  <span className="font-medium">3,892</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Storage used</span>
                  <span className="font-medium">2.4 GB</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">HTS Token Service</p>
                <Badge className="bg-secondary text-secondary-foreground">Operational</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Tokens distributed</span>
                  <span className="font-medium">124,500</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Active holders</span>
                  <span className="font-medium">156</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
