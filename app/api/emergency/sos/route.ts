import { NextResponse } from "next/server"
import { submitToHCS } from "@/lib/hedera/hcs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientId, patientName, location, timestamp } = body

    if (!patientId || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const sequenceNumber = await submitToHCS({
      type: "SOS",
      patientId,
      patientName,
      location,
      timestamp: timestamp || Date.now(),
    })

    return NextResponse.json({
      success: true,
      sequenceNumber,
      message: "SOS alert logged to Hedera Consensus Service",
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("[v0] Error logging SOS alert:", error)
    return NextResponse.json({ error: "Failed to log SOS alert" }, { status: 500 })
  }
}
