// app/api/demo-hcs/route.ts
import { NextResponse } from "next/server";
import {
  Client,
  AccountId,
  PrivateKey,
  TopicMessageSubmitTransaction,
  TopicId,
} from "@hashgraph/sdk";

// --- Create Hedera client ---
function getHederaClient() {
  const operatorId = process.env.HEDERA_OPERATOR_ID!;
  const operatorKey = process.env.HEDERA_OPERATOR_KEY!;

  const client = Client.forTestnet();

  let privateKey: PrivateKey;
  try {
    privateKey = PrivateKey.fromString(operatorKey);
  } catch {
    if (operatorKey.startsWith("0x")) {
      privateKey = PrivateKey.fromStringECDSA(operatorKey);
    } else {
      privateKey = PrivateKey.fromStringDer(operatorKey);
    }
  }

  client.setOperator(AccountId.fromString(operatorId), privateKey);
  console.log("✅ Hedera client initialized with operator:", operatorId);
  return client;
}

// --- Submit a message to HCS ---
async function submitToHCS(client: Client, topicId: string, message: Record<string, any>) {
  try {
    const tx = new TopicMessageSubmitTransaction({
      topicId: TopicId.fromString(topicId),
      message: JSON.stringify(message),
    });

    const txResponse = await tx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    if (!receipt || !receipt.status) {
      throw new Error("Message submission failed: no receipt or status.");
    }

    return receipt.status.toString();
  } catch (err) {
    console.error("❌ Error submitting to HCS:", err);
    return "FAILED";
  }
}

// --- App Router API handler ---
export async function GET() {
  try {
    const client = getHederaClient();

    // Use the TOPIC_ID from env
    const topicId = process.env.HEDERA_TOPIC_ID!;
    if (!topicId) throw new Error("Missing HEDERA_TOPIC_ID in .env");

    // Dummy SOS
    const dummySOS = {
      alertId: "ALERT_001",
      type: "SOS",
      patientId: "PATIENT_123",
      responderId: null,
      location: { lat: 9.03, lng: 38.74, address: "Addis Ababa" },
      timestamp: Date.now(),
    };
    const sosStatus = await submitToHCS(client, topicId, dummySOS);

    // Dummy ACCEPT
    const dummyAccept = {
      alertId: "ALERT_001",
      type: "ACCEPT",
      patientId: "PATIENT_123",
      responderId: "RESPONDER_456",
      location: { lat: 9.05, lng: 38.75, address: "En route" },
      timestamp: Date.now(),
    };
    const acceptStatus = await submitToHCS(client, topicId, dummyAccept);

    return NextResponse.json({
      topicId,
      sosStatus,
      acceptStatus,
      message: "✅ Dummy SOS + ACCEPT submitted to HCS successfully!",
    });
  } catch (error: any) {
    console.error("❌ Handler error:", error);
    return NextResponse.json(
      { error: "Failed to submit to HCS", details: String(error) },
      { status: 500 }
    );
  }
}
