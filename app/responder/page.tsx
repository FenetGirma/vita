"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, MapPin, Navigation, Clock, CheckCircle, User, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Alert {
  id: string
  patientName: string
  distance: string
  time: string
  severity: "critical" | "urgent" | "moderate"
  location: string
  lat: number
  lng: number
}

export default function ResponderDashboard() {
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null)
  const [responding, setResponding] = useState(false)
  const [arrived, setArrived] = useState(false)
  const [responderLocation, setResponderLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setResponderLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("[v0] Responder geolocation error:", error)
        },
      )
    }
  }, [])

  const alerts: Alert[] = [
    {
      id: "1",
      patientName: "John D.",
      distance: "0.3 mi",
      time: "2 min ago",
      severity: "critical",
      location: "123 Main St, San Francisco",
      lat: 37.7749,
      lng: -122.4194,
    },
    {
      id: "2",
      patientName: "Sarah M.",
      distance: "0.8 mi",
      time: "5 min ago",
      severity: "urgent",
      location: "456 Oak Ave, San Francisco",
      lat: 37.7849,
      lng: -122.4094,
    },
  ]

  const handleAccept = async (alert: Alert) => {
    setActiveAlert(alert)
    setResponding(true)

    try {
      const response = await fetch("/api/emergency/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId: alert.id,
          responderId: "responder-456",
          responderName: "Dr. Sarah Johnson",
          responderLocation,
          timestamp: new Date().toISOString(),
        }),
      })

      const data = await response.json()
      console.log("[v0] Response accepted, logged to HCS:", data)
    } catch (error) {
      console.error("[v0] Failed to log acceptance:", error)
    }
  }

  const handleArrive = async () => {
    setArrived(true)

    try {
      const response = await fetch("/api/emergency/arrive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId: activeAlert?.id,
          responderId: "responder-456",
          arrivalLocation: responderLocation,
          timestamp: new Date().toISOString(),
        }),
      })

      const data = await response.json()
      console.log("[v0] Arrival logged to HCS:", data)
    } catch (error) {
      console.error("[v0] Failed to log arrival:", error)
    }
  }

  const handleComplete = async () => {
    try {
      const response = await fetch("/api/emergency/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId: activeAlert?.id,
          responderId: "responder-456",
          timestamp: new Date().toISOString(),
        }),
      })

      const data = await response.json()
      console.log("[v0] Response completed, logged to HCS:", data)
    } catch (error) {
      console.error("[v0] Failed to log completion:", error)
    }

    setActiveAlert(null)
    setResponding(false)
    setArrived(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-primary text-primary-foreground"
      case "urgent":
        return "bg-orange-500 text-white"
      case "moderate":
        return "bg-yellow-500 text-black"
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
            <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium">Dr. Sarah Johnson</p>
              <p className="text-xs text-muted-foreground">Certified Responder • EMT-12345</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Lives Saved</p>
              <CheckCircle className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-2xl font-bold">47</p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Avg Response</p>
              <Clock className="h-4 w-4 text-accent" />
            </div>
            <p className="text-2xl font-bold">4.2 min</p>
          </Card>

          <Card className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Rating</p>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-2xl font-bold">4.9/5</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active Response Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Active Response</h2>

            {!responding ? (
              <Card className="p-6 text-center space-y-3 bg-muted/30">
                <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                  <Navigation className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">No Active Response</p>
                  <p className="text-sm text-muted-foreground">Accept an alert to start responding</p>
                </div>
              </Card>
            ) : (
              <Card className="p-6 space-y-4 bg-secondary/5 border-secondary">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold">{activeAlert?.patientName}</h3>
                      <p className="text-sm text-muted-foreground">{activeAlert?.distance} away</p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(activeAlert?.severity || "moderate")}>
                    {activeAlert?.severity}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                    <MapPin className="h-5 w-5 text-secondary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Patient Location</p>
                      <p className="text-xs text-muted-foreground">{activeAlert?.location}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        GPS: {activeAlert?.lat.toFixed(4)}, {activeAlert?.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                {!arrived ? (
                  <div className="space-y-2">
                    <Button className="w-full bg-secondary hover:bg-secondary/90" size="lg" onClick={handleArrive}>
                      <Navigation className="h-4 w-4 mr-2" />
                      Mark as Arrived
                    </Button>
                    <Button variant="outline" className="w-full bg-background" onClick={handleComplete}>
                      Cancel Response
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-secondary/10 border border-secondary rounded-lg text-center">
                      <CheckCircle className="h-8 w-8 text-secondary mx-auto mb-2" />
                      <p className="font-medium text-secondary">Arrived at Scene</p>
                      <p className="text-xs text-muted-foreground mt-1">Providing care to patient</p>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleComplete}>
                      Complete Response
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Nearby Alerts Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Nearby Alerts</h2>
              <Badge variant="outline" className="bg-background">
                {alerts.length} active
              </Badge>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card
                  key={alert.id}
                  className={`p-4 space-y-3 hover:bg-card/80 transition-colors ${
                    responding && activeAlert?.id === alert.id ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{alert.patientName}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{alert.distance}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>~{Number.parseInt(alert.distance) * 2} min</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-secondary hover:bg-secondary/90"
                    onClick={() => handleAccept(alert)}
                    disabled={responding}
                  >
                    Accept & Respond
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
