import { NextResponse } from "next/server"
import { submitToHCS } from "@/lib/hedera/hcs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { alertId, responderId, responderName, responderLocation, timestamp } = body

    if (!alertId || !responderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const sequenceNumber = await submitToHCS({
      type: "ACCEPT",
      alertId,
      responderId,
      responderName,
      location: responderLocation,
      timestamp: timestamp || Date.now(),
    })

    return NextResponse.json({
      success: true,
      sequenceNumber,
      message: "Accept action logged to Hedera Consensus Service",
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("[v0] Error logging accept action:", error)
    return NextResponse.json({ error: "Failed to log accept action" }, { status: 500 })
  }
}
