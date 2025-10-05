import { NextResponse } from "next/server"
import { submitToHCS } from "@/lib/hedera/hcs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { alertId, responderId, arrivalLocation, timestamp } = body

    // Submit arrival to HCS
    const sequenceNumber = await submitToHCS({
      type: "ARRIVE",
      alertId,
      responderId,
      location: arrivalLocation,
      timestamp,
    })

    return NextResponse.json({
      success: true,
      sequenceNumber,
      message: "Arrival logged to Hedera Consensus Service",
    })
  } catch (error) {
    console.error("[v0] Arrive API error:", error)
    return NextResponse.json({ success: false, error: "Failed to log arrival" }, { status: 500 })
  }
}
