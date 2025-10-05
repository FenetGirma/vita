import { NextResponse } from "next/server"
import { submitToHCS } from "@/lib/hedera/hcs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { alertId, responderId, timestamp } = body

    if (!alertId || !responderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const sequenceNumber = await submitToHCS({
      type: "COMPLETE",
      alertId,
      responderId,
      timestamp: timestamp || Date.now(),
    })

    return NextResponse.json({
      success: true,
      sequenceNumber,
      message: "Response completed and logged to Hedera Consensus Service",
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("[v0] Error completing response:", error)
    return NextResponse.json({ error: "Failed to complete response" }, { status: 500 })
  }
}
