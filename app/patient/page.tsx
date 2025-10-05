"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  MapPin,
  Phone,
  User,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function PatientDashboard() {
  const { data: session } = useSession({
    required: false,
  });
  const [sosActive, setSosActive] = useState(false);
  const [sosTimer, setSosTimer] = useState(0);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude,
            lng: longitude,
            address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          });
          setLocationLoading(false);
        },
        (error) => {
          console.error("[v0] Geolocation error:", error);
          setLocationError(
            "Unable to get location. Please enable location services."
          );
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError("Geolocation not supported by your browser");
    }
  }, []);

  const handleSOS = async () => {
    if (!sosActive && location) {
      setSosActive(true);

      try {
        const response = await fetch("/api/emergency/sos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: "patient-123", // In production, get from auth
            patientName: "John Doe",
            location: {
              lat: location.lat,
              lng: location.lng,
              address: location.address,
            },
            timestamp: new Date().toISOString(),
          }),
        });

        const data = await response.json();
        console.log("[v0] SOS Alert sent to HCS:", data);
      } catch (error) {
        console.error("[v0] Failed to send SOS:", error);
      }

      // Simulate timer
      const interval = setInterval(() => {
        setSosTimer((prev) => prev + 1);
      }, 1000);
      setTimeout(() => clearInterval(interval), 60000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">Patient</p>
            </div>
          </div>
          <div>
            <h1>Member Client Session</h1>
            <div>{session?.user?.email}</div>
            {/* <div>{session?.user?.role}</div> */}
          </div>
          <Link href="/">
            <Button variant="ghost" size="sm">
              Sign Out
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {locationLoading && (
          <Card className="p-4 mb-6 bg-accent/5 border-accent/20">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-accent animate-spin" />
              <p className="text-sm">Getting your location...</p>
            </div>
          </Card>
        )}

        {locationError && (
          <Card className="p-4 mb-6 bg-destructive/5 border-destructive/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">{locationError}</p>
            </div>
          </Card>
        )}

        {/* SOS Alert Section */}
        <div className="mb-8">
          {!sosActive ? (
            <Card className="p-8 text-center space-y-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="space-y-3">
                <h1 className="text-3xl font-bold">Emergency Assistance</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Press the button below to send an immediate SOS alert to
                  nearby certified responders with your real-time location.
                </p>
              </div>

              <button
                onClick={handleSOS}
                disabled={!location || locationLoading}
                className="mx-auto h-48 w-48 rounded-full bg-primary hover:bg-primary/90 active:scale-95 transition-all shadow-2xl shadow-primary/50 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-center">
                  <AlertCircle className="h-20 w-20 text-primary-foreground mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-2xl font-bold text-primary-foreground">
                    SOS
                  </span>
                </div>
              </button>

              <p className="text-xs text-muted-foreground">
                {location
                  ? "Your location will be shared with responders"
                  : "Waiting for location..."}
              </p>
            </Card>
          ) : (
            <Card className="p-8 space-y-6 bg-primary/5 border-primary animate-pulse-slow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">SOS Alert Active</h2>
                    <p className="text-sm text-muted-foreground">
                      Alert sent to Hedera network...
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold">
                    {formatTime(sosTimer)}
                  </div>
                  <p className="text-xs text-muted-foreground">Elapsed time</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Location Shared</p>
                    <p className="text-xs text-muted-foreground">
                      {location?.address}
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-secondary" />
                </div>

                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Alert Broadcasted</p>
                    <p className="text-xs text-muted-foreground">
                      Logged on Hedera Consensus Service
                    </p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full bg-background"
                onClick={() => setSosActive(false)}
              >
                Cancel Alert
              </Button>
            </Card>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6 space-y-3 hover:bg-card/80 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">My Location</h3>
                <p className="text-sm text-muted-foreground">
                  {location ? "Location active" : "Getting location..."}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-3 hover:bg-card/80 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Emergency Contacts</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your contact list
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Medical Information Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Your Medical Profile</h2>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Blood Type</p>
              <p className="font-medium">O+</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-medium">32 years</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Allergies</p>
              <div className="flex gap-2">
                <Badge variant="secondary">Penicillin</Badge>
                <Badge variant="secondary">Peanuts</Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Current Medications
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">Lisinopril</Badge>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Emergency Contacts
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div>
                  <p className="text-sm font-medium">Jane Doe (Spouse)</p>
                  <p className="text-xs text-muted-foreground">
                    +1 (555) 123-4567
                  </p>
                </div>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
