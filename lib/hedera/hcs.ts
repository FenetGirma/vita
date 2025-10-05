// Hedera Consensus Service (HCS) Integration
// Used for immutable logging of emergency alerts and responses

import { TopicCreateTransaction, TopicMessageSubmitTransaction, TopicId } from "@hashgraph/sdk"
import { getHederaClient } from "./client"

export interface EmergencyAlert {
  type: "SOS" | "ACCEPT" | "ARRIVE" | "COMPLETE"
  patientId: string
  responderId?: string
  location: {
    lat: number
    lng: number
    address: string
  }
  timestamp: number
  metadata?: Record<string, unknown>
}

let cachedTopicId: string | null = null

async function getOrCreateTopicId(): Promise<string> {
  // Return cached topic if available
  if (cachedTopicId) {
    return cachedTopicId
  }

  // Check environment variable
  if (process.env.HEDERA_EMERGENCY_TOPIC_ID) {
    cachedTopicId = process.env.HEDERA_EMERGENCY_TOPIC_ID
    return cachedTopicId
  }

  // Auto-create topic if not exists
  console.log("[v0] No topic ID found, creating new emergency topic...")
  const client = getHederaClient()

  const transaction = new TopicCreateTransaction().setSubmitKey(client.operatorPublicKey!)

  const txResponse = await transaction.execute(client)
  const receipt = await txResponse.getReceipt(client)

  const topicId = receipt.topicId
  if (!topicId) {
    throw new Error("Failed to create topic")
  }

  cachedTopicId = topicId.toString()
  console.log(`[v0] ✅ Created emergency topic: ${cachedTopicId}`)
  console.log(`[v0] 📋 Add this to your environment variables: HEDERA_EMERGENCY_TOPIC_ID=${cachedTopicId}`)

  return cachedTopicId
}

// Submit an emergency alert to HCS
export async function submitEmergencyAlert(alert: EmergencyAlert): Promise<string> {
  const topicId = await getOrCreateTopicId()
  const client = getHederaClient()

  const message = JSON.stringify(alert)

  const transaction = new TopicMessageSubmitTransaction({
    topicId: TopicId.fromString(topicId),
    message: message,
  })

  const txResponse = await transaction.execute(client)
  const receipt = await txResponse.getReceipt(client)

  console.log(`[v0] Submitted alert to HCS: ${receipt.status.toString()}`)
  return receipt.status.toString()
}

// POST /api/emergency/sos
export async function logSOSAlert(patientId: string, location: EmergencyAlert["location"]) {
  const alert: EmergencyAlert = {
    type: "SOS",
    patientId,
    location,
    timestamp: Date.now(),
  }

  return await submitEmergencyAlert(alert)
}

// POST /api/emergency/accept
export async function logAcceptAlert(patientId: string, responderId: string) {
  const alert: EmergencyAlert = {
    type: "ACCEPT",
    patientId,
    responderId,
    location: { lat: 0, lng: 0, address: "" },
    timestamp: Date.now(),
  }

  return await submitEmergencyAlert(alert)
}

// POST /api/emergency/arrive
export async function logArriveAlert(patientId: string, responderId: string) {
  const alert: EmergencyAlert = {
    type: "ARRIVE",
    patientId,
    responderId,
    location: { lat: 0, lng: 0, address: "" },
    timestamp: Date.now(),
  }

  return await submitEmergencyAlert(alert)
}

export async function submitToHCS(data: Record<string, unknown>): Promise<number> {
  const topicId = await getOrCreateTopicId()
  const client = getHederaClient()

  const message = JSON.stringify(data)

  const transaction = new TopicMessageSubmitTransaction({
    topicId: TopicId.fromString(topicId),
    message: message,
  })

  const txResponse = await transaction.execute(client)
  const receipt = await txResponse.getReceipt(client)

  console.log(`[v0] Submitted to HCS: ${receipt.status.toString()}`)

  return Date.now()
}
