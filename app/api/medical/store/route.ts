import { NextResponse } from "next/server"
import { storeMedicalRecord } from "@/lib/hedera/hfs"
import type { MedicalRecord } from "@/lib/hedera/hfs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const record: MedicalRecord = {
      patientId: body.patientId,
      bloodType: body.bloodType,
      allergies: body.allergies || [],
      medications: body.medications || [],
      conditions: body.conditions || [],
      emergencyContacts: body.emergencyContacts || [],
      lastUpdated: Date.now(),
    }

    // Store medical record on Hedera File Service
    const fileId = await storeMedicalRecord(record)

    return NextResponse.json({
      success: true,
      fileId,
      message: "Medical record stored on blockchain",
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("[v0] Error storing medical record:", error)
    return NextResponse.json({ error: "Failed to store medical record" }, { status: 500 })
  }
}
