"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Activity } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [role, setRole] = useState<"patient" | "responder" | "admin" | null>(null)

  const handleRoleSelect = (selectedRole: "patient" | "responder" | "admin") => {
    setRole(selectedRole)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // For demo purposes, redirect to appropriate dashboard
    if (role === "patient") router.push("/patient")
    if (role === "responder") router.push("/responder")
    if (role === "admin") router.push("/admin")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">PulsePoint</span>
          </div>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground">Join the emergency response network</p>
        </div>

        {!role ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground text-center">Select your role:</p>
            <Button
              variant="outline"
              className="w-full h-auto py-4 flex flex-col items-start gap-1 bg-transparent"
              onClick={() => handleRoleSelect("patient")}
            >
              <span className="font-semibold">Patient</span>
              <span className="text-xs text-muted-foreground">Send SOS alerts and share medical records</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-auto py-4 flex flex-col items-start gap-1 bg-transparent"
              onClick={() => handleRoleSelect("responder")}
            >
              <span className="font-semibold">Responder</span>
              <span className="text-xs text-muted-foreground">Accept alerts and earn rewards</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-auto py-4 flex flex-col items-start gap-1 bg-transparent"
              onClick={() => handleRoleSelect("admin")}
            >
              <span className="font-semibold">Admin</span>
              <span className="text-xs text-muted-foreground">Monitor system and analytics</span>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" className="bg-background" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" className="bg-background" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="bg-background" required />
            </div>

            {role === "responder" && (
              <div className="space-y-2">
                <Label htmlFor="certification">Certification ID</Label>
                <Input id="certification" type="text" placeholder="EMT-12345" className="bg-background" />
              </div>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => setRole(null)}>
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Create Account
              </Button>
            </div>
          </form>
        )}

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  )
}
